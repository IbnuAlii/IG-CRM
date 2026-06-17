"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LeafletRouteMap, type LeafletMapPoint } from "@/components/map/leaflet-route-map";
import type { FleetVehicle } from "@/components/fleet/fleet-data";
import { FleetGpsStatusBadge } from "@/components/fleet/fleet-status-badge";

export function TrackingMapPanel({
  vehicles,
}: {
  vehicles: FleetVehicle[];
}) {
  const points: LeafletMapPoint[] = vehicles.map((vehicle) => ({
    id: vehicle.id,
    label: vehicle.unitNumber.replace(/[^0-9]/g, "").slice(-2) || "V",
    detail: `${vehicle.unitNumber} | ${vehicle.assignedDriverName ?? "Unassigned"} | ${vehicle.speedMph} mph ${vehicle.direction}`,
    lat: vehicle.lat,
    lng: vehicle.lng,
    kind: vehicle.gpsStatus === "offline" ? "emergency" : "origin",
  }));

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Live Vehicle Tracking</h2>
          <p className="text-sm text-muted-foreground">
            Current vehicle locations with driver, speed, heading, and job context.
          </p>
        </div>
        <Badge variant="outline" className="w-fit bg-background">
          30 sec mock refresh
        </Badge>
      </div>
      <LeafletRouteMap points={points} className="h-[460px]" />
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="rounded-md border border-border/70 bg-muted/20 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{vehicle.unitNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {vehicle.currentLocation}
                </p>
              </div>
              <FleetGpsStatusBadge status={vehicle.gpsStatus} />
            </div>
            <p className="mt-2 text-sm">
              {vehicle.speedMph} mph {vehicle.direction}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
