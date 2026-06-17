"use client";

import { Clock, Smartphone, WifiOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";
import type { FleetVehicle } from "@/components/fleet/fleet-data";

export function TrackingRefreshPanel({
  vehicles,
}: {
  vehicles: FleetVehicle[];
}) {
  const offlineVehicles = vehicles.filter(
    (vehicle) => vehicle.gpsStatus === "offline",
  );

  return (
    <Card className="border-border/70 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">Refresh & Alerts</h2>
          <p className="text-sm text-muted-foreground">
            Mock telemetry shows 30-second refresh, mobile GPS fallback, and offline alert state.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-border/70 p-4">
          <Clock className="mb-3 h-4 w-4 text-primary" />
          <p className="text-sm font-medium">Next refresh</p>
          <p className="text-2xl font-semibold">00:30</p>
        </div>
        <div className="rounded-md border border-border/70 p-4">
          <Smartphone className="mb-3 h-4 w-4 text-primary" />
          <p className="text-sm font-medium">Mobile fallback</p>
          <p className="text-2xl font-semibold">Enabled</p>
        </div>
        <div className="rounded-md border border-border/70 p-4">
          <WifiOff className="mb-3 h-4 w-4 text-destructive" />
          <p className="text-sm font-medium">Offline devices</p>
          <p className="text-2xl font-semibold">{offlineVehicles.length}</p>
        </div>
      </div>
      <FleetActionButton
        className="mt-5"
        variant="outline"
        feedbackTitle="GPS refresh requested"
        feedbackDescription="Latest mock telemetry has been requested."
      >
        Force Refresh
      </FleetActionButton>
    </Card>
  );
}
