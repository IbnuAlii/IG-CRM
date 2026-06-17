"use client";

import type { Dispatch, SetStateAction } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FleetVehicle } from "@/components/fleet/fleet-data";

export function RouteHistoryControls({
  vehicles,
  vehicleId,
  setVehicleId,
  date,
  setDate,
}: {
  vehicles: FleetVehicle[];
  vehicleId: string;
  setVehicleId: Dispatch<SetStateAction<string>>;
  date: string;
  setDate: Dispatch<SetStateAction<string>>;
}) {
  return (
    <Card className="border-border/70 p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <div className="space-y-2">
          <p className="text-sm font-medium">Vehicle</p>
          <Select value={vehicleId} onValueChange={setVehicleId}>
            <SelectTrigger>
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
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Service date</p>
          <Input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setVehicleId("all");
            setDate("all");
          }}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </Card>
  );
}
