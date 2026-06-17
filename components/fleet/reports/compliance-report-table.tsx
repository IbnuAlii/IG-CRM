"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Card } from "@/components/ui/card";
import type { FleetVehicle } from "@/components/fleet/fleet-data";
import { formatFleetDate } from "@/components/fleet/fleet-data";
import { FleetDocumentStatusBadge } from "@/components/fleet/fleet-status-badge";

interface ComplianceRow {
  id: string;
  vehicleUnit: string;
  documentType: string;
  status: FleetVehicle["documents"][number]["status"];
  expiresAt: string;
  version: string;
}

export function ComplianceReportTable({
  vehicles,
}: {
  vehicles: FleetVehicle[];
}) {
  const rows: ComplianceRow[] = vehicles.flatMap((vehicle) =>
    vehicle.documents.map((document) => ({
      id: document.id,
      vehicleUnit: vehicle.unitNumber,
      documentType: document.type,
      status: document.status,
      expiresAt: document.expiresAt,
      version: document.version,
    })),
  );

  const columns: DataTableColumn<ComplianceRow>[] = [
    {
      id: "vehicle",
      header: "Vehicle",
      accessorFn: (row) => row.vehicleUnit,
      cell: (row) => <span className="font-medium">{row.vehicleUnit}</span>,
    },
    {
      id: "document",
      header: "Document",
      accessorFn: (row) => `${row.documentType} ${row.version}`,
      cell: (row) => (
        <div>
          <p className="font-medium">{row.documentType}</p>
          <p className="text-xs text-muted-foreground">{row.version}</p>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (row) => row.status,
      cell: (row) => <FleetDocumentStatusBadge status={row.status} />,
      align: "center",
    },
    {
      id: "expires",
      header: "Expires",
      accessorFn: (row) => row.expiresAt,
      cell: (row) => formatFleetDate(row.expiresAt),
      align: "center",
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Document Compliance</h2>
        <p className="text-sm text-muted-foreground">
          Registration, insurance, and inspection status across vehicles.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(row) => row.id}
        searchPlaceholder="Search compliance..."
        exportFileName="fleet-compliance-report.csv"
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
