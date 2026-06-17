"use client";

import { FileText } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { FleetMaintenanceLog } from "@/components/fleet/fleet-data";
import {
  formatFleetCurrency,
  formatFleetDate,
} from "@/components/fleet/fleet-data";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";

export function MaintenanceLogTable({
  logs,
}: {
  logs: FleetMaintenanceLog[];
}) {
  const columns: DataTableColumn<FleetMaintenanceLog>[] = [
    {
      id: "vehicle",
      header: "Vehicle",
      accessorFn: (log) => `${log.vehicleUnit} ${log.type}`,
      cell: (log) => (
        <div>
          <p className="font-medium">{log.vehicleUnit}</p>
          <p className="text-xs text-muted-foreground">{log.type}</p>
        </div>
      ),
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
      id: "cost",
      header: "Cost",
      accessorFn: (log) => log.cost,
      cell: (log) => formatFleetCurrency(log.cost),
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
      id: "receipt",
      header: "Receipt",
      accessorFn: (log) => log.receiptStatus,
      cell: (log) => (
        <Badge variant={log.receiptStatus === "attached" ? "secondary" : "destructive"}>
          {log.receiptStatus}
        </Badge>
      ),
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
            feedbackTitle="Maintenance receipt opened"
            feedbackDescription={`${log.vehicleUnit} receipt status: ${log.receiptStatus}.`}
          >
            <FileText className="mr-2 h-4 w-4" />
            Receipt
          </FleetActionButton>
          <FleetActionButton
            size="sm"
            variant="outline"
            feedbackTitle="Maintenance log reviewed"
            feedbackDescription={log.description}
          >
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
        <h2 className="font-semibold">Maintenance Logs</h2>
        <p className="text-sm text-muted-foreground">
          Service history with cost, vendor, odometer, receipt, and notes.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={logs}
        getRowKey={(log) => log.id}
        emptyMessage="No maintenance logs match these filters."
        searchPlaceholder="Search maintenance..."
        exportFileName="fleet-maintenance.csv"
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
