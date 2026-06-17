"use client";

import { FileText, Gauge, MapPin, Wrench } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";
import type { FleetVehicle } from "@/components/fleet/fleet-data";
import {
  formatFleetCurrency,
  formatFleetDate,
} from "@/components/fleet/fleet-data";
import {
  FleetDocumentStatusBadge,
  FleetGpsStatusBadge,
  FleetVehicleStatusBadge,
} from "@/components/fleet/fleet-status-badge";

export function VehicleProfileDialog({
  vehicle,
  open,
  onOpenChange,
}: {
  vehicle?: FleetVehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Vehicle Profile</DialogTitle>
          <DialogDescription>
            Vehicle details, assignment, documents, GPS status, and service readiness.
          </DialogDescription>
        </DialogHeader>

        {vehicle ? (
          <div className="space-y-5">
            <Card className="border-border/70 bg-card p-4 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{vehicle.unitNumber}</h2>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.year} {vehicle.make} {vehicle.model} - VIN {vehicle.vin}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FleetVehicleStatusBadge status={vehicle.status} />
                  <FleetGpsStatusBadge status={vehicle.gpsStatus} />
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-border/70 bg-background p-3">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  Location
                </p>
                <p className="font-medium">{vehicle.currentLocation}</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background p-3">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Gauge className="h-3.5 w-3.5" />
                  Odometer
                </p>
                <p className="font-medium">{vehicle.odometer.toLocaleString()} mi</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background p-3">
                <p className="text-xs text-muted-foreground">Assigned Driver</p>
                <p className="font-medium">{vehicle.assignedDriverName ?? "Unassigned"}</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background p-3">
                <p className="text-xs text-muted-foreground">Maintenance YTD</p>
                <p className="font-medium">
                  {formatFleetCurrency(vehicle.maintenanceCostYtd)}
                </p>
              </div>
            </div>

            <section>
              <div className="mb-2 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Service Schedule</h3>
              </div>
              <div className="rounded-lg border border-border/70 bg-background p-3 text-sm">
                Next service {formatFleetDate(vehicle.nextServiceDate)} at{" "}
                {vehicle.nextServiceMileage.toLocaleString()} miles.
              </div>
            </section>

            <section>
              <div className="mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Documents</h3>
              </div>
              <div className="space-y-2">
                {vehicle.documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">{document.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {document.version} - Expires {formatFleetDate(document.expiresAt)}
                      </p>
                    </div>
                    <FleetDocumentStatusBadge status={document.status} />
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-wrap gap-2">
              <FleetActionButton
                feedbackTitle="Maintenance workflow opened"
                feedbackDescription={`${vehicle.unitNumber} maintenance logging is ready.`}
              >
                Log Maintenance
              </FleetActionButton>
              <FleetActionButton
                variant="outline"
                feedbackTitle="Expiration reminder queued"
                feedbackDescription={`${vehicle.unitNumber} document reminders were queued.`}
              >
                Send Reminders
              </FleetActionButton>
              <Badge variant="outline" className="bg-background">
                {vehicle.fuelEfficiencyMpg.toFixed(1)} mpg
              </Badge>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
