"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { cn } from "@/lib/utils";

export interface LeafletMapPoint {
  id: string;
  label: string;
  detail?: string;
  lat: number;
  lng: number;
  kind: "origin" | "stop" | "emergency";
}

const markerStyles: Record<LeafletMapPoint["kind"], string> = {
  origin: "bg-blue-600",
  stop: "bg-emerald-600",
  emergency: "bg-red-600",
};

function buildMarkerIcon(L: typeof Leaflet, point: LeafletMapPoint) {
  return L.divIcon({
    className: "crm-leaflet-marker",
    html: `<div class="grid h-9 w-9 place-items-center rounded-full border-2 border-white ${markerStyles[point.kind]} text-xs font-semibold text-white shadow-md">${escapeHtml(point.label)}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function LeafletRouteMap({
  points,
  className,
}: {
  points: LeafletMapPoint[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const latestPointsRef = useRef(points);
  const [mounted, setMounted] = useState(false);
  const pointKey = useMemo(
    () =>
      points
        .map((point) =>
          [
            point.id,
            point.label,
            point.detail ?? "",
            point.lat,
            point.lng,
            point.kind,
          ].join(":"),
        )
        .join("|"),
    [points],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    latestPointsRef.current = points;
  }, [points]);

  useEffect(() => {
    if (!mounted) return;

    let disposed = false;

    async function initMap() {
      if (!containerRef.current) return;

      const L = await import("leaflet");
      if (disposed || !containerRef.current) return;

      mapRef.current?.remove();
      mapRef.current = null;

      const routePoints = latestPointsRef.current;
      const center = routePoints[0] ?? {
        lat: 40.758,
        lng: -73.9855,
      };

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
      }).setView([center.lat, center.lng], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const latLngs: Leaflet.LatLngExpression[] = routePoints.map((point) => [
        point.lat,
        point.lng,
      ]);

      routePoints.forEach((point) => {
        L.marker([point.lat, point.lng], {
          icon: buildMarkerIcon(L, point),
        })
          .bindPopup(
            `<strong>${escapeHtml(point.label)}</strong>${point.detail ? `<br />${escapeHtml(point.detail)}` : ""}`,
          )
          .addTo(map);
      });

      if (latLngs.length > 1) {
        L.polyline(latLngs, {
          color: "#2563eb",
          weight: 4,
          opacity: 0.85,
        }).addTo(map);
        map.fitBounds(L.latLngBounds(latLngs), { padding: [34, 34] });
      }

      mapRef.current = map;
      window.setTimeout(() => map.invalidateSize(), 0);
    }

    initMap();

    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [mounted, pointKey]);

  if (!mounted) {
    return (
      <div
        className={cn(
          "grid h-[430px] place-items-center overflow-hidden rounded-lg border border-border/70 bg-muted text-sm text-muted-foreground",
          className,
        )}
      >
        Loading map...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      suppressHydrationWarning
      className={cn(
        "h-[430px] overflow-hidden rounded-lg border border-border/70 bg-muted",
        className,
      )}
    />
  );
}
