"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export interface ResultsMapPin {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  rating: number;
  subcategory: string;
}

interface ResultsMapProps {
  pins: ResultsMapPin[];
  userLocation: { lat: number; lng: number } | null;
  radiusMiles: number | null;
  className?: string;
}

const HOUSTON_CENTER: [number, number] = [-95.3698, 29.7604];

export function ResultsMap({
  pins,
  userLocation,
  radiusMiles,
  className,
}: ResultsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  // Effect 1: initialize map exactly once (StrictMode-safe via ref guard).
  useEffect(() => {
    if (mapRef.current) return; // already initialized
    if (!containerRef.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.warn("NEXT_PUBLIC_MAPBOX_TOKEN is not set");
      return;
    }
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: userLocation ? [userLocation.lng, userLocation.lat] : HOUSTON_CENTER,
      zoom: 11,
      attributionControl: false,
    });
    mapRef.current = map;

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false, visualizePitch: false }),
      "top-right"
    );
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    // We deliberately don't return a cleanup. StrictMode would otherwise
    // tear down the map between its double-mount, killing the `load` event
    // before any markers can be added.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect 2: paint markers + radius circle whenever pins or location change.
  // Waits for `style.load` if the map isn't ready yet.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const paint = () => {
      // Remove old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;

      // Remove old radius layers/sources
      if (map.getLayer("radius-line")) map.removeLayer("radius-line");
      if (map.getLayer("radius-fill")) map.removeLayer("radius-fill");
      if (map.getSource("radius")) map.removeSource("radius");

      // Optional radius circle
      if (userLocation && radiusMiles) {
        map.addSource("radius", {
          type: "geojson",
          data: circlePolygon(userLocation.lng, userLocation.lat, radiusMiles),
        });
        map.addLayer({
          id: "radius-fill",
          type: "fill",
          source: "radius",
          paint: { "fill-color": "#7d8b5e", "fill-opacity": 0.08 },
        });
        map.addLayer({
          id: "radius-line",
          type: "line",
          source: "radius",
          paint: {
            "line-color": "#7d8b5e",
            "line-width": 2,
            "line-dasharray": [2, 2],
          },
        });
      }

      // User-location marker
      if (userLocation) {
        const youEl = document.createElement("div");
        youEl.style.cssText = [
          "width: 16px",
          "height: 16px",
          "border-radius: 50%",
          "background: #7d8b5e",
          "border: 3px solid white",
          "box-shadow: 0 2px 8px rgba(125, 139, 94, 0.55)",
        ].join(";");
        userMarkerRef.current = new mapboxgl.Marker(youEl)
          .setLngLat([userLocation.lng, userLocation.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 14, closeButton: false }).setHTML(
              `<div style="font-family: ui-sans-serif, system-ui; font-size: 12px; font-weight: 600; color: #2c2a25;">📍 You</div>`
            )
          )
          .addTo(map);
      }

      // Result pins
      for (const p of pins) {
        const el = document.createElement("div");
        el.setAttribute("aria-label", p.name);
        el.dataset.slug = p.slug;
        el.style.cssText = [
          "width: 24px",
          "height: 24px",
          "border-radius: 50%",
          "background: #c97b5a",
          "border: 3px solid white",
          "box-shadow: 0 2px 8px rgba(168, 94, 63, 0.4)",
          "cursor: pointer",
          "transition: transform 120ms, background-color 120ms, box-shadow 120ms",
        ].join(";");
        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.2)";
        });
        el.addEventListener("mouseleave", () => {
          if (el.dataset.active !== "true") el.style.transform = "scale(1)";
        });
        // Click → tell the list side to scroll the matching card into view.
        // We don't preventDefault — Mapbox still opens the popup as usual.
        el.addEventListener("click", () => {
          window.dispatchEvent(
            new CustomEvent("bs:pin-click", { detail: { slug: p.slug } })
          );
        });
        const marker = new mapboxgl.Marker(el).setLngLat([p.lng, p.lat]).addTo(map);
        marker.setPopup(
          new mapboxgl.Popup({ offset: 20, closeButton: false }).setHTML(popupHtml(p))
        );
        markersRef.current.push(marker);
      }

      // Fit bounds
      if (pins.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        for (const p of pins) bounds.extend([p.lng, p.lat]);
        if (userLocation) bounds.extend([userLocation.lng, userLocation.lat]);
        map.fitBounds(bounds, { padding: 50, maxZoom: 14, duration: 0 });
      }
    };

    if (map.isStyleLoaded()) {
      paint();
    } else {
      map.once("style.load", paint);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pins.map((p) => p.slug).join("|"),
    userLocation?.lat,
    userLocation?.lng,
    radiusMiles,
  ]);

  // Effect 3: respond to `bs:hover-card` from the list side. Looks up the
  // pin DOM node by data-slug and toggles a stronger highlight style.
  useEffect(() => {
    const findPin = (slug: string): HTMLDivElement | null =>
      (containerRef.current?.querySelector(
        `.mapboxgl-marker [data-slug="${CSS.escape(slug)}"]`
      ) as HTMLDivElement | null) ??
      (containerRef.current?.querySelector(
        `[data-slug="${CSS.escape(slug)}"]`
      ) as HTMLDivElement | null);

    const onHover = (e: Event) => {
      const slug = (e as CustomEvent<{ slug: string }>).detail?.slug;
      if (!slug) return;
      const el = findPin(slug);
      if (!el) return;
      el.dataset.active = "true";
      el.style.transform = "scale(1.45)";
      el.style.background = "#a85e3f";
      el.style.boxShadow = "0 4px 14px rgba(168, 94, 63, 0.6)";
      el.style.zIndex = "10";
    };
    const onLeave = (e: Event) => {
      const slug = (e as CustomEvent<{ slug: string }>).detail?.slug;
      const reset = (el: HTMLDivElement) => {
        delete el.dataset.active;
        el.style.transform = "scale(1)";
        el.style.background = "#c97b5a";
        el.style.boxShadow = "0 2px 8px rgba(168, 94, 63, 0.4)";
        el.style.zIndex = "";
      };
      if (slug) {
        const el = findPin(slug);
        if (el) reset(el);
      } else {
        // No slug: clear all
        containerRef.current
          ?.querySelectorAll<HTMLDivElement>('[data-active="true"]')
          .forEach(reset);
      }
    };

    window.addEventListener("bs:hover-card", onHover);
    window.addEventListener("bs:leave-card", onLeave);
    return () => {
      window.removeEventListener("bs:hover-card", onHover);
      window.removeEventListener("bs:leave-card", onLeave);
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}

function popupHtml(p: ResultsMapPin) {
  return `
    <div style="font-family: ui-sans-serif, system-ui; min-width: 180px;">
      <div style="font-size: 14px; font-weight: 700; color: #2c2a25; line-height: 1.2;">${escapeHtml(p.name)}</div>
      <div style="font-size: 12px; color: #6b6760; margin-top: 2px;">${escapeHtml(p.subcategory)}</div>
      <div style="margin-top: 6px; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 12px; font-weight: 700; color: #c97b5a;">★ ${p.rating.toFixed(1)}</span>
        <a href="/b/${encodeURIComponent(p.slug)}" style="font-size: 12px; font-weight: 700; color: #2c2a25; text-decoration: none; border-bottom: 1px solid #c97b5a;">View →</a>
      </div>
    </div>
  `;
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Build a 64-point GeoJSON polygon approximating a circle of `radiusMiles`
// around (lng, lat). Used for the radius-search visualization.
function circlePolygon(lng: number, lat: number, radiusMiles: number): GeoJSON.Feature {
  const points = 64;
  const earthRadiusMiles = 3958.8;
  const ring: [number, number][] = [];
  const distRad = radiusMiles / earthRadiusMiles;
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  for (let i = 0; i <= points; i++) {
    const bearing = (i * 2 * Math.PI) / points;
    const lat2 = Math.asin(
      Math.sin(latRad) * Math.cos(distRad) +
        Math.cos(latRad) * Math.sin(distRad) * Math.cos(bearing)
    );
    const lng2 =
      lngRad +
      Math.atan2(
        Math.sin(bearing) * Math.sin(distRad) * Math.cos(latRad),
        Math.cos(distRad) - Math.sin(latRad) * Math.sin(lat2)
      );
    ring.push([(lng2 * 180) / Math.PI, (lat2 * 180) / Math.PI]);
  }
  return {
    type: "Feature",
    geometry: { type: "Polygon", coordinates: [ring] },
    properties: {},
  };
}
