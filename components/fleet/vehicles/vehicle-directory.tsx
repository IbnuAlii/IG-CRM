"use client";

import { FileWarning, MapPin } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { FleetVehicle } from "@/components/fleet/fleet-data";
import { formatFleetDate } from "@/components/fleet/fleet-data";
import {
  FleetGpsStatusBadge,
  FleetVehicleStatusBadge,
} from "@/components/fleet/fleet-status-badge";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";

export function VehicleDirectory({
  vehicles,
  onSelectVehicle,
}: {
  vehicles: FleetVehicle[];
  onSelectVehicle: (vehicle: FleetVehicle) => void;
}) {
  const columns: DataTableColumn<FleetVehicle>[] = [
    {
      id: "vehicle",
      header: "Vehicle",
      accessorFn: (vehicle) =>
        `${vehicle.unitNumber} ${vehicle.make} ${vehicle.model} ${vehicle.licensePlate}`,
      cell: (vehicle) => (
        <div>
          <p className="font-medium">{vehicle.unitNumber}</p>
          <p className="text-xs text-muted-foreground">
            {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
          </p>
        </div>
      ),
    },
    {
      id: "driver",
      header: "Driver",
      accessorFn: (vehicle) => vehicle.assignedDriverName ?? "Unassigned",
      cell: (vehicle) => vehicle.assignedDriverName ?? "Unassigned",
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (vehicle) => vehicle.status,
      cell: (vehicle) => <FleetVehicleStatusBadge status={vehicle.status} />,
      align: "center",
    },
    {
      id: "gps",
      header: "GPS",
      accessorFn: (vehicle) => vehicle.gpsStatus,
      cell: (vehicle) => (
        <div className="space-y-1">
          <FleetGpsStatusBadge status={vehicle.gpsStatus} />
          <p className="text-xs text-muted-foreground">
            {vehicle.speedMph} mph {vehicle.direction}
          </p>
        </div>
      ),
      align: "center",
    },
    {
      id: "location",
      header: "Location",
      accessorFn: (vehicle) => vehicle.currentLocation,
      cell: (vehicle) => (
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          {vehicle.currentLocation}
        </span>
      ),
    },
    {
      id: "service",
      header: "Next Service",
      accessorFn: (vehicle) => vehicle.nextServiceDate,
      cell: (vehicle) => (
        <div>
          <p>{formatFleetDate(vehicle.nextServiceDate)}</p>
          <p className="text-xs text-muted-foreground">
            {vehicle.nextServiceMileage.toLocaleString()} mi
          </p>
        </div>
      ),
      align: "center",
    },
    {
      id: "documents",
      header: "Docs",
      accessorFn: (vehicle) =>
        vehicle.documents.map((document) => document.status).join(" "),
      cell: (vehicle) => {
        const alerts = vehicle.documents.filter(
          (document) => document.status !== "valid",
        ).length;
        return (
          <Badge variant={alerts > 0 ? "destructive" : "secondary"} className="gap-1">
            <FileWarning className="h-3.5 w-3.5" />
            {alerts > 0 ? `${alerts} alert` : "Valid"}
          </Badge>
        );
      },
      align: "center",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: (vehicle) => (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onSelectVehicle(vehicle)}>
            Profile
          </Button>
          <FleetActionButton
            variant="outline"
            size="sm"
            feedbackTitle="Vehicle assignment opened"
            feedbackDescription={`${vehicle.unitNumber} assignment workflow is ready in the mock frontend.`}
          >
            Assign
          </FleetActionButton>
        </div>
      ),
      align: "center",
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Vehicle Directory</h2>
        <p className="text-sm text-muted-foreground">
          Search vehicles by unit, driver, VIN, plate, GPS status, maintenance status, and document health.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={vehicles}
        getRowKey={(vehicle) => vehicle.id}
        emptyMessage="No vehicles match these filters."
        searchPlaceholder="Search vehicles..."
        exportFileName="fleet-vehicles.csv"
        features={{
          sorting: true,
          globalFilter: true,
          pagination: true,
          columnVisibility: true,
          export: true,
          rowSelection: true,
        }}
      />
    </Card>
  );
}
