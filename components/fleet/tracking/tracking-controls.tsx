"use client";

import type { Dispatch, SetStateAction } from "react";
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
import type { FleetGpsStatus, FleetVehicle } from "@/components/fleet/fleet-data";

export function TrackingControls({
  vehicles,
  vehicleId,
  setVehicleId,
  gpsStatus,
  setGpsStatus,
}: {
  vehicles: FleetVehicle[];
  vehicleId: string;
  setVehicleId: Dispatch<SetStateAction<string>>;
  gpsStatus: "all" | FleetGpsStatus;
  setGpsStatus: Dispatch<SetStateAction<"all" | FleetGpsStatus>>;
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
                  {vehicle.unitNumber} - {vehicle.assignedDriverName ?? "Unassigned"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">GPS status</p>
          <Select
            value={gpsStatus}
            onValueChange={(value) => setGpsStatus(value as "all" | FleetGpsStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="GPS status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="moving">Moving</SelectItem>
              <SelectItem value="idle">Idle</SelectItem>
              <SelectItem value="parked">Parked</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setVehicleId("all");
            setGpsStatus("all");
          }}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </Card>
  );
}
