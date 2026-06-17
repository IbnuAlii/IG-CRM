"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Card } from "@/components/ui/card";
import type {
  FleetFuelLog,
  FleetMaintenanceLog,
  FleetVehicle,
} from "@/components/fleet/fleet-data";
import { formatFleetCurrency } from "@/components/fleet/fleet-data";

interface CostReportRow {
  id: string;
  vehicleUnit: string;
  fuelCost: number;
  maintenanceCost: number;
  totalCost: number;
  mpg: number;
  costPerMile: number;
}

export function CostReportTable({
  vehicles,
  fuelLogs,
  maintenanceLogs,
}: {
  vehicles: FleetVehicle[];
  fuelLogs: FleetFuelLog[];
  maintenanceLogs: FleetMaintenanceLog[];
}) {
  const rows: CostReportRow[] = vehicles.map((vehicle) => {
    const fuelCost = fuelLogs
      .filter((log) => log.vehicleId === vehicle.id)
      .reduce((sum, log) => sum + log.cost, 0);
    const maintenanceCost = maintenanceLogs
      .filter((log) => log.vehicleId === vehicle.id)
      .reduce((sum, log) => sum + log.cost, 0);
    const totalCost = fuelCost + maintenanceCost;

    return {
      id: vehicle.id,
      vehicleUnit: vehicle.unitNumber,
      fuelCost,
      maintenanceCost,
      totalCost,
      mpg: vehicle.fuelEfficiencyMpg,
      costPerMile: totalCost / Math.max(vehicle.odometer, 1),
    };
  });

  const columns: DataTableColumn<CostReportRow>[] = [
    {
      id: "vehicle",
      header: "Vehicle",
      accessorFn: (row) => row.vehicleUnit,
      cell: (row) => <span className="font-medium">{row.vehicleUnit}</span>,
    },
    {
      id: "fuel",
      header: "Fuel",
      accessorFn: (row) => row.fuelCost,
      cell: (row) => formatFleetCurrency(row.fuelCost),
      align: "center",
    },
    {
      id: "maintenance",
      header: "Maintenance",
      accessorFn: (row) => row.maintenanceCost,
      cell: (row) => formatFleetCurrency(row.maintenanceCost),
      align: "center",
    },
    {
      id: "total",
      header: "Total",
      accessorFn: (row) => row.totalCost,
      cell: (row) => formatFleetCurrency(row.totalCost),
      align: "center",
    },
    {
      id: "mpg",
      header: "MPG",
      accessorFn: (row) => row.mpg,
      cell: (row) => row.mpg.toFixed(1),
      align: "center",
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Cost Report</h2>
        <p className="text-sm text-muted-foreground">
          Fuel, service, total spend, and efficiency by fleet unit.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(row) => row.id}
        searchPlaceholder="Search cost report..."
        exportFileName="fleet-cost-report.csv"
        features={{
          sorting: true,
          globalFilter: true,
          pagination: true,
          columnVisibility: true,
          export: true,
        }}
      />
    </Card>
  );
}
