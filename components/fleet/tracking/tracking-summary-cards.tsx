"use client";

import { Activity, Gauge, RadioTower, WifiOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { FleetVehicle } from "@/components/fleet/fleet-data";

export function TrackingSummaryCards({
  vehicles,
}: {
  vehicles: FleetVehicle[];
}) {
  const onlineVehicles = vehicles.filter(
    (vehicle) => vehicle.gpsStatus !== "offline",
  ).length;
  const movingVehicles = vehicles.filter(
    (vehicle) => vehicle.gpsStatus === "moving",
  ).length;
  const averageSpeed =
    vehicles.length === 0
      ? 0
      : Math.round(
          vehicles.reduce((sum, vehicle) => sum + vehicle.speedMph, 0) /
            vehicles.length,
        );
  const offlineVehicles = vehicles.filter(
    (vehicle) => vehicle.gpsStatus === "offline",
  ).length;

  const cards = [
    {
      label: "Online GPS",
      value: `${onlineVehicles}/${vehicles.length}`,
      icon: RadioTower,
    },
    {
      label: "Moving Now",
      value: movingVehicles,
      icon: Activity,
    },
    {
      label: "Avg Speed",
      value: `${averageSpeed} mph`,
      icon: Gauge,
    },
    {
      label: "Offline Alerts",
      value: offlineVehicles,
      icon: WifiOff,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.label} className="border-border/70 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="mt-1 text-2xl font-semibold">{card.value}</p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
