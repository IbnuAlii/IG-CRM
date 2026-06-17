"use client";

import { LeafletRouteMap, type LeafletMapPoint } from "@/components/map/leaflet-route-map";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { FleetVehicle } from "@/components/fleet/fleet-data";

export function FleetMapPanel({ vehicles }: { vehicles: FleetVehicle[] }) {
  const points: LeafletMapPoint[] = vehicles.map((vehicle) => ({
    id: vehicle.id,
    label: vehicle.unitNumber.replace(/[^0-9]/g, "").slice(-2) || "V",
    detail: `${vehicle.unitNumber} - ${vehicle.assignedDriverName ?? "Unassigned"} - ${vehicle.gpsStatus}`,
    lat: vehicle.lat,
    lng: vehicle.lng,
    kind: vehicle.gpsStatus === "offline" ? "emergency" : "origin",
  }));

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Live Fleet Map</h2>
          <p className="text-sm text-muted-foreground">
            Leaflet map with active vehicle markers, GPS status, and driver context.
          </p>
        </div>
        <Badge variant="outline" className="w-fit bg-background">
          30 sec mock refresh
        </Badge>
      </div>
      <LeafletRouteMap points={points} className="h-[380px]" />
    </Card>
  );
}
