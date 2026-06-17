"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LeafletRouteMap, type LeafletMapPoint } from "@/components/map/leaflet-route-map";
import type { FleetRouteHistory } from "@/components/fleet/fleet-data";

export function RoutePlaybackMap({
  route,
}: {
  route?: FleetRouteHistory;
}) {
  const points: LeafletMapPoint[] =
    route?.points.map((point, index) => ({
      id: point.id,
      label: index === 0 ? "O" : point.type === "incident" ? "!" : String(index),
      detail: `${point.timestamp} | ${point.note}`,
      lat: point.lat,
      lng: point.lng,
      kind:
        point.type === "incident"
          ? "emergency"
          : point.type === "origin"
            ? "origin"
            : "stop",
    })) ?? [];

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Route Playback</h2>
          <p className="text-sm text-muted-foreground">
            {route
              ? `${route.vehicleUnit} driven by ${route.driverName}, ${route.startTime}-${route.endTime}.`
              : "Select a route to review route playback."}
          </p>
        </div>
        {route ? (
          <Badge variant="outline" className="w-fit bg-background">
            {route.distanceMiles} mi / {route.durationMinutes} min
          </Badge>
        ) : null}
      </div>
      <LeafletRouteMap points={points} className="h-[430px]" />
      {route ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {route.points.map((point) => (
            <div
              key={point.id}
              className="rounded-md border border-border/70 bg-muted/20 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{point.label}</p>
                <span className="text-xs text-muted-foreground">
                  {point.timestamp}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{point.note}</p>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
