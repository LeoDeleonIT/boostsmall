"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export interface MapPin {
  id: string;
  lng: number;
  lat: number;
  label?: string;
}

interface MapboxMapProps {
  center: [number, number]; // [lng, lat]
  zoom?: number;
  pins?: MapPin[];
  className?: string;
  /** Disable scroll-zoom on small embeds so the page scrolls instead. */
  interactive?: boolean;
}

export function MapboxMap({
  center,
  zoom = 14,
  pins = [],
  className,
  interactive = true,
}: MapboxMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
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
      center,
      zoom,
      attributionControl: false,
      interactive,
    });

    if (interactive) {
      // Top-left placement matches /search's ResultsMap so controls live
      // in the same corner across the app, and so a hovered pin (when
      // there's only one) doesn't ever sit under the buttons.
      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: false, visualizePitch: false }),
        "top-left"
      );
    }
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));

    // Disable rotate for a calmer feel
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    const markers: mapboxgl.Marker[] = [];
    for (const pin of pins) {
      // Mapbox positions the marker via `transform: translate(...)` on
      // its container. We split the marker so the outer wrapper stays
      // Mapbox-controlled, while an inner styled circle takes our
      // background/scale-on-hover styles. Touching transform on the
      // outer would snap the pin to (0,0) of the map.
      const outer = document.createElement("div");
      const inner = document.createElement("div");
      outer.setAttribute("aria-label", pin.label ?? "");
      outer.appendChild(inner);
      inner.style.cssText = [
        "width: 22px",
        "height: 22px",
        "border-radius: 50%",
        "background: var(--terracotta, #c97b5a)",
        "border: 3px solid white",
        "box-shadow: 0 2px 8px rgba(168, 94, 63, 0.35)",
        "cursor: pointer",
        "transition: transform 120ms",
      ].join(";");
      inner.addEventListener("mouseenter", () => {
        inner.style.transform = "scale(1.15)";
      });
      inner.addEventListener("mouseleave", () => {
        inner.style.transform = "scale(1)";
      });
      const marker = new mapboxgl.Marker(outer)
        .setLngLat([pin.lng, pin.lat])
        .addTo(map);
      if (pin.label) {
        marker.setPopup(
          new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(
            `<div style="font-family: var(--font-sans); font-weight: 600; font-size: 13px; color: #2c2a25;">${escapeHtml(pin.label)}</div>`
          )
        );
      }
      markers.push(marker);
    }

    mapRef.current = map;

    return () => {
      markers.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], zoom, interactive, pins.length]);

  return <div ref={containerRef} className={className} />;
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
