"use client";

import { Clock, Flag, Gauge, Route } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { FleetRouteHistory } from "@/components/fleet/fleet-data";

export function RouteHistorySummaryCards({
  routes,
}: {
  routes: FleetRouteHistory[];
}) {
  const distance = routes.reduce((sum, route) => sum + route.distanceMiles, 0);
  const duration = routes.reduce((sum, route) => sum + route.durationMinutes, 0);
  const averageSpeed =
    routes.length === 0
      ? 0
      : Math.round(
          routes.reduce((sum, route) => sum + route.averageSpeedMph, 0) /
            routes.length,
        );
  const behaviorEvents = routes.reduce(
    (sum, route) =>
      sum +
      route.behaviorEvents.speeding +
      route.behaviorEvents.harshBraking +
      route.behaviorEvents.idling,
    0,
  );

  const cards = [
    { label: "Routes", value: routes.length, icon: Route },
    { label: "Miles", value: distance.toFixed(1), icon: Flag },
    { label: "Duration", value: `${Math.round(duration / 60)} hr`, icon: Clock },
    { label: "Avg Speed", value: `${averageSpeed} mph`, icon: Gauge },
    { label: "Events", value: behaviorEvents, icon: Flag },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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
