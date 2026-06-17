"use client";

import { BellRing, MapPinned, PauseCircle, RadioTower } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { FleetGeofence, FleetGeofenceEvent } from "@/components/fleet/fleet-data";

export function GeofenceSummaryCards({
  geofences,
  events,
}: {
  geofences: FleetGeofence[];
  events: FleetGeofenceEvent[];
}) {
  const active = geofences.filter((geofence) => geofence.status === "active").length;
  const paused = geofences.filter((geofence) => geofence.status === "paused").length;
  const entryEvents = events.filter((event) => event.eventType === "entry").length;

  const cards = [
    { label: "Geo-fences", value: geofences.length, icon: MapPinned },
    { label: "Active", value: active, icon: RadioTower },
    { label: "Paused", value: paused, icon: PauseCircle },
    { label: "Entry Events", value: entryEvents, icon: BellRing },
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
