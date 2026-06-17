"use client";

import { Truck } from "lucide-react";
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

export function AddVehicleDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Vehicle</DialogTitle>
          <DialogDescription>
            Mock fleet onboarding form for vehicle profile, documents, assignment, and service schedule.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="unit-number">Unit number</Label>
            <Input id="unit-number" placeholder="TRK-410" />
          </div>
          <div className="space-y-2">
            <Label>Vehicle status</Label>
            <Select defaultValue="active">
              <SelectTrigger>
                <SelectValue placeholder="Vehicle status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="in_maintenance">In Maintenance</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Input id="make" placeholder="Ford" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input id="model" placeholder="Transit 250" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input id="year" type="number" placeholder="2026" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plate">License plate</Label>
            <Input id="plate" placeholder="NY-FS410" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="vin">VIN</Label>
            <Input id="vin" placeholder="Vehicle identification number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="insurance">Insurance expiration</Label>
            <Input id="insurance" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registration">Registration expiration</Label>
            <Input id="registration" type="date" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Document notes</Label>
            <Textarea
              id="notes"
              placeholder="Registration, insurance, inspection, and uploaded document notes"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <FleetActionButton
            variant="outline"
            onClick={() => onOpenChange(false)}
            feedbackTitle="Vehicle draft saved"
            feedbackDescription="Vehicle onboarding draft was saved in the mock frontend."
          >
            Save Draft
          </FleetActionButton>
          <FleetActionButton
            onClick={() => onOpenChange(false)}
            feedbackTitle="Vehicle added"
            feedbackDescription="Vehicle profile, document reminders, and assignment workflow were created."
          >
            <Truck className="mr-2 h-4 w-4" />
            Add Vehicle
          </FleetActionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
