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
      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: false, visualizePitch: false }),
        "top-right"
      );
    }
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));

    // Disable rotate for a calmer feel
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    const markers: mapboxgl.Marker[] = [];
    for (const pin of pins) {
      const el = document.createElement("div");
      el.setAttribute("aria-label", pin.label ?? "");
      el.style.cssText = [
        "width: 22px",
        "height: 22px",
        "border-radius: 50%",
        "background: var(--terracotta, #c97b5a)",
        "border: 3px solid white",
        "box-shadow: 0 2px 8px rgba(168, 94, 63, 0.35)",
        "cursor: pointer",
        "transition: transform 120ms",
      ].join(";");
      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.15)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });
      const marker = new mapboxgl.Marker(el)
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
