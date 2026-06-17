"use client";

import { CalendarClock, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { FleetVehicle } from "@/components/fleet/fleet-data";
import { formatFleetDate } from "@/components/fleet/fleet-data";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";

export function ServiceReminderPanel({
  vehicles,
}: {
  vehicles: FleetVehicle[];
}) {
  const upcoming = vehicles
    .filter((vehicle) => vehicle.nextServiceDate <= "2026-07-15")
    .sort((a, b) => a.nextServiceDate.localeCompare(b.nextServiceDate));

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Service Reminders</h2>
          <p className="text-sm text-muted-foreground">
            Upcoming maintenance by date and mileage.
          </p>
        </div>
        <CalendarClock className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-3">
        {upcoming.map((vehicle) => {
          const milesRemaining = vehicle.nextServiceMileage - vehicle.odometer;

          return (
            <div
              key={vehicle.id}
              className="rounded-lg border border-border/70 bg-background p-3"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{vehicle.unitNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    Due {formatFleetDate(vehicle.nextServiceDate)}
                  </p>
                </div>
                <Badge variant={milesRemaining < 1000 ? "destructive" : "secondary"}>
                  {milesRemaining.toLocaleString()} mi left
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Gauge className="h-3.5 w-3.5" />
                Current {vehicle.odometer.toLocaleString()} mi / target{" "}
                {vehicle.nextServiceMileage.toLocaleString()} mi
              </div>
            </div>
          );
        })}
      </div>
      <FleetActionButton
        className="mt-4 w-full"
        feedbackTitle="Service reminders sent"
        feedbackDescription="Upcoming maintenance reminders were queued for fleet managers and drivers."
      >
        Send Maintenance Reminders
      </FleetActionButton>
    </Card>
  );
}
