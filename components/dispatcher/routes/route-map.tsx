"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LeafletRouteMap, type LeafletMapPoint } from "@/components/map/leaflet-route-map";
import type { AdminEmployee } from "@/types";
import type { RouteStop } from "./route-utils";

function getStopPoint(stop: RouteStop, index: number): LeafletMapPoint {
  const coordinates = [
    [40.7616, -73.9776],
    [40.7505, -73.9934],
    [40.7421, -73.9826],
    [40.7308, -73.9973],
    [40.7218, -73.9872],
    [40.7163, -74.0086],
  ];
  const [lat, lng] = coordinates[index % coordinates.length];

  return {
    id: stop.job.id,
    label: String(stop.sequence),
    detail: `${stop.job.jobNumber} - ${stop.job.customerName}`,
    lat,
    lng,
    kind: stop.job.priority === "emergency" ? "emergency" : "stop",
  };
}

export function RouteMap({
  stops,
  technician,
}: {
  stops: RouteStop[];
  technician?: AdminEmployee;
}) {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Route Map</h2>
          <p className="text-sm text-muted-foreground">
            Mock map with technician origin and optimized stop order.
          </p>
        </div>
        <Badge variant="outline" className="w-fit bg-background">
          {technician?.currentLocation ?? "Multi-route view"}
        </Badge>
      </div>

      <LeafletRouteMap
        points={[
          {
            id: "origin",
            label: "T",
            detail: technician?.name ?? "Dispatch origin",
            lat: 40.758,
            lng: -73.9855,
            kind: "origin",
          },
          ...stops.map(getStopPoint),
        ]}
      />
    </Card>
  );
}
