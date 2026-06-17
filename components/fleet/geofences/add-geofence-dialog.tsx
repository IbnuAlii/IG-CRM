"use client";

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

export function AddGeofenceDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Geo-fence</DialogTitle>
          <DialogDescription>
            Mock form for a customer, job, or yard alert zone.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="geofence-name">Name</Label>
            <Input id="geofence-name" placeholder="Customer alert zone" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="geofence-link">Linked record</Label>
            <Input id="geofence-link" placeholder="JOB-1108 or customer name" />
          </div>
          <div className="grid gap-2">
            <Label>Shape</Label>
            <Select defaultValue="circle">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Alert type</Label>
            <Select defaultValue="both">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry</SelectItem>
                <SelectItem value="exit">Exit</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <FleetActionButton
            feedbackTitle="Geo-fence created"
            feedbackDescription="Mock geo-fence saved for backend integration."
            onClick={() => onOpenChange(false)}
          >
            Create Geo-fence
          </FleetActionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
