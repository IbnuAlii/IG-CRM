"use client";

import { Wrench } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";
import type { FleetVehicle } from "@/components/fleet/fleet-data";

export function AddMaintenanceDialog({
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Log Maintenance</DialogTitle>
          <DialogDescription>
            Mock maintenance form for service type, vendor, cost, odometer, description, and receipt status.
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
            <Label>Maintenance type</Label>
            <Select defaultValue="Oil Change">
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Oil Change">Oil Change</SelectItem>
                <SelectItem value="Repair">Repair</SelectItem>
                <SelectItem value="Inspection">Inspection</SelectItem>
                <SelectItem value="Tire Service">Tire Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maint-date">Date</Label>
            <Input id="maint-date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maint-cost">Cost</Label>
            <Input id="maint-cost" type="number" placeholder="350" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maint-vendor">Vendor</Label>
            <Input id="maint-vendor" placeholder="Fleet service vendor" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maint-odometer">Odometer</Label>
            <Input id="maint-odometer" type="number" placeholder="45000" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="maint-description">Description</Label>
            <Textarea id="maint-description" placeholder="Work performed and notes" />
          </div>
        </div>
        <DialogFooter>
          <FleetActionButton
            onClick={() => onOpenChange(false)}
            feedbackTitle="Maintenance logged"
            feedbackDescription="Maintenance history, cost totals, and service schedule were updated in the mock workflow."
          >
            <Wrench className="mr-2 h-4 w-4" />
            Save Maintenance
          </FleetActionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
