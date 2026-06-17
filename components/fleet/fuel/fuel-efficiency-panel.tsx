"use client";

import { Gauge } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { FleetVehicle } from "@/components/fleet/fleet-data";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";

export function FuelEfficiencyPanel({
  vehicles,
}: {
  vehicles: FleetVehicle[];
}) {
  const maxMpg = Math.max(...vehicles.map((vehicle) => vehicle.fuelEfficiencyMpg), 1);

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Efficiency</h2>
          <p className="text-sm text-muted-foreground">
            MPG by vehicle for fuel and cost review.
          </p>
        </div>
        <Gauge className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">{vehicle.unitNumber}</span>
              <span className="text-muted-foreground">
                {vehicle.fuelEfficiencyMpg.toFixed(1)} mpg
              </span>
            </div>
            <Progress value={(vehicle.fuelEfficiencyMpg / maxMpg) * 100} />
          </div>
        ))}
      </div>
      <FleetActionButton
        className="mt-4 w-full"
        variant="outline"
        feedbackTitle="Fuel report prepared"
        feedbackDescription="Fuel efficiency and cost report is ready for export."
      >
        Generate Fuel Report
      </FleetActionButton>
    </Card>
  );
}
