"use client";

import { CalendarClock, IdCard, UserRoundCheck } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { FleetDriver, FleetVehicle } from "@/components/fleet/fleet-data";
import { formatFleetDate } from "@/components/fleet/fleet-data";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";

function driverStatusLabel(status: FleetDriver["status"]) {
  return status.replace("_", " ");
}

export function DriverDirectory({
  drivers,
  vehicles,
}: {
  drivers: FleetDriver[];
  vehicles: FleetVehicle[];
}) {
  const columns: DataTableColumn<FleetDriver>[] = [
    {
      id: "driver",
      header: "Driver",
      accessorFn: (driver) => `${driver.name} ${driver.licenseNumber}`,
      cell: (driver) => (
        <div>
          <p className="font-medium">{driver.name}</p>
          <p className="text-xs text-muted-foreground">
            {driver.licenseNumber} / class {driver.licenseClass}
          </p>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (driver) => driver.status,
      cell: (driver) => (
        <Badge variant={driver.status === "active" ? "secondary" : "outline"}>
          {driverStatusLabel(driver.status)}
        </Badge>
      ),
      align: "center",
    },
    {
      id: "vehicle",
      header: "Vehicle",
      accessorFn: (driver) =>
        vehicles.find((vehicle) => vehicle.id === driver.assignedVehicleId)
          ?.unitNumber ?? "Unassigned",
      cell: (driver) =>
        vehicles.find((vehicle) => vehicle.id === driver.assignedVehicleId)
          ?.unitNumber ?? "Unassigned",
      align: "center",
    },
    {
      id: "job",
      header: "Current Job",
      accessorFn: (driver) => driver.currentJob ?? "No active job",
      cell: (driver) => driver.currentJob ?? "No active job",
      align: "center",
    },
    {
      id: "license",
      header: "License Expiry",
      accessorFn: (driver) => driver.licenseExpiresAt,
      cell: (driver) => (
        <span className="inline-flex items-center gap-1">
          <CalendarClock className="h-3.5 w-3.5 text-primary" />
          {formatFleetDate(driver.licenseExpiresAt)}
        </span>
      ),
      align: "center",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: (driver) => (
        <div className="flex justify-center gap-2">
          <FleetActionButton
            size="sm"
            variant="outline"
            feedbackTitle="Driver assignment opened"
            feedbackDescription={`${driver.name} assignment workflow is ready in the mock frontend.`}
          >
            <IdCard className="mr-2 h-4 w-4" />
            Assign
          </FleetActionButton>
          <FleetActionButton
            size="sm"
            variant="outline"
            feedbackTitle="Driver status reviewed"
            feedbackDescription={`${driver.name} license and job status reviewed.`}
          >
            <UserRoundCheck className="mr-2 h-4 w-4" />
            Review
          </FleetActionButton>
        </div>
      ),
      align: "center",
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Driver Directory</h2>
        <p className="text-sm text-muted-foreground">
          Driver status, vehicle assignment, active job, and license expiration.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={drivers}
        getRowKey={(driver) => driver.id}
        emptyMessage="No drivers match these filters."
        searchPlaceholder="Search drivers..."
        exportFileName="fleet-drivers.csv"
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
