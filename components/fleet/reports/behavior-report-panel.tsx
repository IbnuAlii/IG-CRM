"use client";

import { AlertTriangle, Route } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type {
  FleetGeofenceEvent,
  FleetRouteHistory,
} from "@/components/fleet/fleet-data";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";

export function BehaviorReportPanel({
  routes,
  geofenceEvents,
}: {
  routes: FleetRouteHistory[];
  geofenceEvents: FleetGeofenceEvent[];
}) {
  const maxEvents = Math.max(
    ...routes.map(
      (route) =>
        route.behaviorEvents.speeding +
        route.behaviorEvents.harshBraking +
        route.behaviorEvents.idling,
    ),
    1,
  );

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Behavior & Zone Activity</h2>
          <p className="text-sm text-muted-foreground">
            Unsafe driving events, route exceptions, and geo-fence activity.
          </p>
        </div>
        <AlertTriangle className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-4">
        {routes.map((route) => {
          const totalEvents =
            route.behaviorEvents.speeding +
            route.behaviorEvents.harshBraking +
            route.behaviorEvents.idling;

          return (
            <div key={route.id} className="rounded-md border border-border/70 p-3">
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">
                  {route.vehicleUnit} - {route.driverName}
                </span>
                <span className="text-muted-foreground">{totalEvents} events</span>
              </div>
              <Progress value={(totalEvents / maxEvents) * 100} />
              <p className="mt-2 text-xs text-muted-foreground">
                {route.behaviorEvents.speeding} speeding /{" "}
                {route.behaviorEvents.harshBraking} harsh braking /{" "}
                {route.behaviorEvents.idling} idling
              </p>
            </div>
          );
        })}
      </div>
      <div className="mt-5 rounded-md border border-border/70 bg-muted/20 p-4">
        <div className="flex items-center gap-2">
          <Route className="h-4 w-4 text-primary" />
          <p className="font-medium">Geo-fence export coverage</p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {geofenceEvents.length} entry/exit events are included in the report package.
        </p>
      </div>
      <FleetActionButton
        className="mt-5 w-full"
        variant="outline"
        feedbackTitle="Behavior report prepared"
        feedbackDescription="Driver behavior and geo-fence activity report is ready."
      >
        Generate Behavior Report
      </FleetActionButton>
    </Card>
  );
}
