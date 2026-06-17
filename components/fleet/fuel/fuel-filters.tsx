"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FleetVehicle } from "@/components/fleet/fleet-data";

export function FuelFilters({
  vehicles,
  vehicleId,
  setVehicleId,
}: {
  vehicles: FleetVehicle[];
  vehicleId: string;
  setVehicleId: (value: string) => void;
}) {
  return (
    <Card className="border-border/70 bg-card p-4 shadow-sm md:p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <Select value={vehicleId} onValueChange={setVehicleId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Vehicle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All vehicles</SelectItem>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.unitNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setVehicleId("all")}
        >
          <RotateCcw className="h-4 w-4" />
          Reset filter
        </Button>
      </div>
    </Card>
  );
}
