"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Supercluster from "supercluster";

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

interface PinProps {
  cluster: false;
  slug: string;
  name: string;
  rating: number;
  subcategory: string;
}

export function ResultsMap({
  pins,
  userLocation,
  radiusMiles,
  className,
}: ResultsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  // DOM markers currently on the map. We blow these away every reclustering
  // pass since the cluster geometry changes with zoom.
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  // Supercluster index. Rebuilt whenever the pin set changes; queried on
  // every map move/zoom to find which points cluster at the current view.
  const indexRef = useRef<Supercluster<PinProps> | null>(null);

  // Effect 1: initialize map exactly once (StrictMode-safe via ref guard).
  useEffect(() => {
    if (mapRef.current) return;
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
    // No cleanup — StrictMode would otherwise tear down the map between
    // its double-mount and kill the load event before markers can be added.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect 2: rebuild the supercluster index whenever the pin set changes,
  // then paint the radius circle, user marker, and let the bounds-fit
  // settle. The bounds-fit triggers `moveend`, which kicks off the first
  // cluster rendering pass via effect 3.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const paint = () => {
      // Build supercluster index. Each input is a GeoJSON Point feature
      // with the pin props carried through.
      const idx = new Supercluster<PinProps>({
        radius: 60,
        maxZoom: 16,
        minPoints: 2,
      });
      idx.load(
        pins.map((p) => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: [p.lng, p.lat] },
          properties: {
            cluster: false,
            slug: p.slug,
            name: p.name,
            rating: p.rating,
            subcategory: p.subcategory,
          },
        })),
      );
      indexRef.current = idx;

      // Wipe stale user marker + radius layers so the new render is clean.
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      if (map.getLayer("radius-line")) map.removeLayer("radius-line");
      if (map.getLayer("radius-fill")) map.removeLayer("radius-fill");
      if (map.getSource("radius")) map.removeSource("radius");

      // Optional radius circle around the user location
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
              `<div style="font-family: ui-sans-serif, system-ui; font-size: 12px; font-weight: 600; color: #2c2a25;">📍 You</div>`,
            ),
          )
          .addTo(map);
      }

      // Fit bounds — triggers moveend → renderClusters via effect 3.
      if (pins.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        for (const p of pins) bounds.extend([p.lng, p.lat]);
        if (userLocation) bounds.extend([userLocation.lng, userLocation.lat]);
        map.fitBounds(bounds, { padding: 50, maxZoom: 14, duration: 0 });
      }

      // Always render at least once even if no bounds change happens.
      renderClusters();
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

  // Helper: read current map view, query supercluster, replace markers.
  function renderClusters() {
    const map = mapRef.current;
    const idx = indexRef.current;
    if (!map || !idx) return;

    const bounds = map.getBounds();
    if (!bounds) return;
    const bbox: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];
    const zoom = Math.floor(map.getZoom());
    const clusters = idx.getClusters(bbox, zoom);

    // Drop old markers
    for (const m of markersRef.current) m.remove();
    markersRef.current = [];

    for (const c of clusters) {
      const [lng, lat] = c.geometry.coordinates as [number, number];
      const props = c.properties as
        | (PinProps & { cluster: false })
        | { cluster: true; cluster_id: number; point_count: number; point_count_abbreviated: string };

      if (props.cluster) {
        // Cluster bubble — size scales with count, click expands.
        const count = props.point_count;
        const size =
          count >= 50 ? 44 : count >= 15 ? 38 : count >= 5 ? 32 : 28;
        const el = document.createElement("div");
        el.setAttribute("aria-label", `${count} places`);
        el.style.cssText = [
          `width: ${size}px`,
          `height: ${size}px`,
          "border-radius: 50%",
          "background: #c97b5a",
          "border: 3px solid white",
          "box-shadow: 0 3px 12px rgba(168, 94, 63, 0.45)",
          "color: white",
          "font-family: ui-sans-serif, system-ui",
          "font-weight: 700",
          "font-size: 13px",
          "display: flex",
          "align-items: center",
          "justify-content: center",
          "cursor: pointer",
          "transition: transform 120ms",
        ].join(";");
        el.textContent = props.point_count_abbreviated;
        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.08)";
        });
        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1)";
        });
        const clusterId = props.cluster_id;
        el.addEventListener("click", () => {
          const expansion = Math.min(idx.getClusterExpansionZoom(clusterId), 18);
          map.easeTo({ center: [lng, lat], zoom: expansion });
        });
        const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
        markersRef.current.push(marker);
        continue;
      }

      // Individual pin
      const p = props;
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
      el.addEventListener("click", () => {
        window.dispatchEvent(
          new CustomEvent("bs:pin-click", { detail: { slug: p.slug } }),
        );
      });
      const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
      marker.setPopup(
        new mapboxgl.Popup({ offset: 20, closeButton: false }).setHTML(
          popupHtml(p),
        ),
      );
      markersRef.current.push(marker);
    }
  }

  // Effect 3: re-render on map zoom / pan / load.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const handler = () => renderClusters();
    map.on("moveend", handler);
    map.on("zoomend", handler);
    map.on("load", handler);
    return () => {
      map.off("moveend", handler);
      map.off("zoomend", handler);
      map.off("load", handler);
    };
  }, []);

  // Effect 4: respond to list-side hover events. Same DOM-marker approach
  // as before — find the pin by data-slug and toggle a stronger highlight.
  // Note clusters don't get highlighted; only individual pins.
  useEffect(() => {
    const findPin = (slug: string): HTMLDivElement | null =>
      (containerRef.current?.querySelector(
        `.mapboxgl-marker [data-slug="${CSS.escape(slug)}"]`,
      ) as HTMLDivElement | null) ??
      (containerRef.current?.querySelector(
        `[data-slug="${CSS.escape(slug)}"]`,
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

function popupHtml(p: { slug: string; name: string; rating: number; subcategory: string }) {
  return `
    <div style="font-family: ui-sans-serif, system-ui; min-width: 180px;">
      <div style="font-size: 14px; font-weight: 700; color: #2c2a25; line-height: 1.2;">${escapeHtml(p.name)}</div>
      <div style="font-size: 12px; color: #6b6760; margin-top: 2px;">${escapeHtml(p.subcategory)}</div>
      <div style="margin-top: 6px; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 12px; font-weight: 700; color: #c97b5a;">★ ${Number(p.rating).toFixed(1)}</span>
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
        Math.cos(latRad) * Math.sin(distRad) * Math.cos(bearing),
    );
    const lng2 =
      lngRad +
      Math.atan2(
        Math.sin(bearing) * Math.sin(distRad) * Math.cos(latRad),
        Math.cos(distRad) - Math.sin(latRad) * Math.sin(lat2),
      );
    ring.push([(lng2 * 180) / Math.PI, (lat2 * 180) / Math.PI]);
  }
  return {
    type: "Feature",
    geometry: { type: "Polygon", coordinates: [ring] },
    properties: {},
  };
}
