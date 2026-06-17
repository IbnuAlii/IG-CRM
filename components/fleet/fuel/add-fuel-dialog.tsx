"use client";

import { Fuel } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";
import type { FleetVehicle } from "@/components/fleet/fleet-data";

export function AddFuelDialog({
  vehicles,
  open,
  onOpenChange,
}: {
  vehicles: FleetVehicle[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Log Fuel Purchase</DialogTitle>
          <DialogDescription>
            Mock fuel form for gallons, cost, vendor, odometer, and receipt capture.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Vehicle</Label>
            <Select defaultValue={vehicles[0]?.id}>
              <SelectTrigger>
                <SelectValue placeholder="Vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.unitNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fuel-date">Date</Label>
            <Input id="fuel-date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fuel-gallons">Gallons</Label>
            <Input id="fuel-gallons" type="number" placeholder="18.2" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fuel-cost">Cost</Label>
            <Input id="fuel-cost" type="number" placeholder="72" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fuel-vendor">Vendor</Label>
            <Input id="fuel-vendor" placeholder="Fuel vendor" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fuel-odometer">Odometer</Label>
            <Input id="fuel-odometer" type="number" placeholder="42110" />
          </div>
        </div>
        <DialogFooter>
          <FleetActionButton
            onClick={() => onOpenChange(false)}
            feedbackTitle="Fuel purchase logged"
            feedbackDescription="Fuel cost, MPG, and reporting data were updated in the mock workflow."
          >
            <Fuel className="mr-2 h-4 w-4" />
            Save Fuel Log
          </FleetActionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
