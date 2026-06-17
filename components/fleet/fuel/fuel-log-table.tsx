"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Card } from "@/components/ui/card";
import type { FleetFuelLog } from "@/components/fleet/fleet-data";
import {
  formatFleetCurrency,
  formatFleetDate,
} from "@/components/fleet/fleet-data";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";

export function FuelLogTable({ logs }: { logs: FleetFuelLog[] }) {
  const columns: DataTableColumn<FleetFuelLog>[] = [
    {
      id: "vehicle",
      header: "Vehicle",
      accessorFn: (log) => log.vehicleUnit,
      cell: (log) => <span className="font-medium">{log.vehicleUnit}</span>,
    },
    {
      id: "date",
      header: "Date",
      accessorFn: (log) => log.date,
      cell: (log) => formatFleetDate(log.date),
    },
    {
      id: "vendor",
      header: "Vendor",
      accessorFn: (log) => log.vendor,
      cell: (log) => log.vendor,
    },
    {
      id: "gallons",
      header: "Gallons",
      accessorFn: (log) => log.gallons,
      cell: (log) => `${log.gallons.toFixed(1)} gal`,
      align: "center",
    },
    {
      id: "cost",
      header: "Cost",
      accessorFn: (log) => log.cost,
      cell: (log) => formatFleetCurrency(log.cost),
      align: "center",
    },
    {
      id: "costPerGallon",
      header: "Cost/Gal",
      accessorFn: (log) => log.cost / log.gallons,
      cell: (log) => formatFleetCurrency(log.cost / log.gallons),
      align: "center",
    },
    {
      id: "odometer",
      header: "Odometer",
      accessorFn: (log) => log.odometer,
      cell: (log) => `${log.odometer.toLocaleString()} mi`,
      align: "center",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: (log) => (
        <div className="flex justify-center gap-2">
          <FleetActionButton
            size="sm"
            variant="outline"
            feedbackTitle="Fuel receipt opened"
            feedbackDescription={`${log.vehicleUnit} fuel purchase at ${log.vendor}.`}
          >
            Receipt
          </FleetActionButton>
        </div>
      ),
      align: "center",
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Fuel Logs</h2>
        <p className="text-sm text-muted-foreground">
          Fuel purchases with gallons, cost, vendor, odometer, and cost-per-gallon.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={logs}
        getRowKey={(log) => log.id}
        emptyMessage="No fuel logs match these filters."
        searchPlaceholder="Search fuel..."
        exportFileName="fleet-fuel.csv"
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
