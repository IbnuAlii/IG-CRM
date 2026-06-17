"use client";

import { Bell, Crosshair } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Card } from "@/components/ui/card";
import type { FleetDriver, FleetVehicle } from "@/components/fleet/fleet-data";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";
import { FleetGpsStatusBadge } from "@/components/fleet/fleet-status-badge";

export function VehicleLocationTable({
  vehicles,
  drivers,
}: {
  vehicles: FleetVehicle[];
  drivers: FleetDriver[];
}) {
  const columns: DataTableColumn<FleetVehicle>[] = [
    {
      id: "vehicle",
      header: "Vehicle",
      accessorFn: (vehicle) => `${vehicle.unitNumber} ${vehicle.currentLocation}`,
      cell: (vehicle) => (
        <div>
          <p className="font-medium">{vehicle.unitNumber}</p>
          <p className="text-xs text-muted-foreground">
            {vehicle.make} {vehicle.model}
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
      header: "GPS",
      accessorFn: (vehicle) => vehicle.gpsStatus,
      cell: (vehicle) => <FleetGpsStatusBadge status={vehicle.gpsStatus} />,
      align: "center",
    },
    {
      id: "speed",
      header: "Speed",
      accessorFn: (vehicle) => vehicle.speedMph,
      cell: (vehicle) => `${vehicle.speedMph} mph ${vehicle.direction}`,
      align: "center",
    },
    {
      id: "location",
      header: "Location",
      accessorFn: (vehicle) => vehicle.currentLocation,
      cell: (vehicle) => vehicle.currentLocation,
    },
    {
      id: "job",
      header: "Job",
      accessorFn: (vehicle) =>
        drivers.find((driver) => driver.assignedVehicleId === vehicle.id)
          ?.currentJob ?? "No active job",
      cell: (vehicle) =>
        drivers.find((driver) => driver.assignedVehicleId === vehicle.id)
          ?.currentJob ?? "No active job",
      align: "center",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: (vehicle) => (
        <div className="flex justify-center gap-2">
          <FleetActionButton
            size="sm"
            variant="outline"
            feedbackTitle="Vehicle centered"
            feedbackDescription={`${vehicle.unitNumber} selected on the live map.`}
          >
            <Crosshair className="mr-2 h-4 w-4" />
            Center
          </FleetActionButton>
          <FleetActionButton
            size="sm"
            variant="outline"
            feedbackTitle="GPS alert rule queued"
            feedbackDescription={`${vehicle.unitNumber} alert rule is ready for backend wiring.`}
          >
            <Bell className="mr-2 h-4 w-4" />
            Alert
          </FleetActionButton>
        </div>
      ),
      align: "center",
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Vehicle Locations</h2>
        <p className="text-sm text-muted-foreground">
          Driver assignment, speed, current job, and latest GPS status.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={vehicles}
        getRowKey={(vehicle) => vehicle.id}
        emptyMessage="No vehicles match these tracking filters."
        searchPlaceholder="Search vehicles..."
        exportFileName="fleet-live-tracking.csv"
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
