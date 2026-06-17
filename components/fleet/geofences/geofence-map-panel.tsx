"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LeafletRouteMap, type LeafletMapPoint } from "@/components/map/leaflet-route-map";
import type { FleetGeofence, FleetVehicle } from "@/components/fleet/fleet-data";

export function GeofenceMapPanel({
  geofences,
  vehicles,
}: {
  geofences: FleetGeofence[];
  vehicles: FleetVehicle[];
}) {
  const geofencePoints: LeafletMapPoint[] = geofences.map((geofence, index) => ({
    id: geofence.id,
    label: `G${index + 1}`,
    detail: `${geofence.name} | ${geofence.radiusMeters}m | ${geofence.alertType}`,
    lat: geofence.lat,
    lng: geofence.lng,
    kind: geofence.status === "paused" ? "emergency" : "stop",
  }));
  const vehiclePoints: LeafletMapPoint[] = vehicles.map((vehicle) => ({
    id: `vehicle_${vehicle.id}`,
    label: vehicle.unitNumber.replace(/[^0-9]/g, "").slice(-2) || "V",
    detail: `${vehicle.unitNumber} | ${vehicle.currentLocation}`,
    lat: vehicle.lat,
    lng: vehicle.lng,
    kind: "origin",
  }));

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Geo-fence Map</h2>
          <p className="text-sm text-muted-foreground">
            Customer, job, and yard alert zones overlaid with current vehicle positions.
          </p>
        </div>
        <Badge variant="outline" className="w-fit bg-background">
          Circle + polygon mock zones
        </Badge>
      </div>
      <LeafletRouteMap
        points={[...geofencePoints, ...vehiclePoints]}
        className="h-[430px]"
      />
    </Card>
  );
}
