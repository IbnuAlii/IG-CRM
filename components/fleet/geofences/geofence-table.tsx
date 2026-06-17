"use client";

import { Settings, ToggleLeft } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { FleetGeofence } from "@/components/fleet/fleet-data";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";

export function GeofenceTable({
  geofences,
}: {
  geofences: FleetGeofence[];
}) {
  const columns: DataTableColumn<FleetGeofence>[] = [
    {
      id: "name",
      header: "Geo-fence",
      accessorFn: (geofence) => `${geofence.name} ${geofence.linkedTo}`,
      cell: (geofence) => (
        <div>
          <p className="font-medium">{geofence.name}</p>
          <p className="text-xs text-muted-foreground">{geofence.linkedTo}</p>
        </div>
      ),
    },
    {
      id: "shape",
      header: "Shape",
      accessorFn: (geofence) => geofence.shape,
      cell: (geofence) => geofence.shape,
      align: "center",
    },
    {
      id: "radius",
      header: "Radius",
      accessorFn: (geofence) => geofence.radiusMeters,
      cell: (geofence) => `${geofence.radiusMeters}m`,
      align: "center",
    },
    {
      id: "alert",
      header: "Alert",
      accessorFn: (geofence) => geofence.alertType,
      cell: (geofence) => geofence.alertType,
      align: "center",
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (geofence) => geofence.status,
      cell: (geofence) => (
        <Badge variant={geofence.status === "active" ? "secondary" : "outline"}>
          {geofence.status}
        </Badge>
      ),
      align: "center",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: (geofence) => (
        <div className="flex justify-center gap-2">
          <FleetActionButton
            size="sm"
            variant="outline"
            feedbackTitle="Geo-fence settings opened"
            feedbackDescription={`${geofence.name} settings are ready for backend wiring.`}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </FleetActionButton>
          <FleetActionButton
            size="sm"
            variant="outline"
            feedbackTitle="Geo-fence status updated"
            feedbackDescription={`${geofence.name} mock status toggle completed.`}
          >
            <ToggleLeft className="mr-2 h-4 w-4" />
            {geofence.status === "active" ? "Pause" : "Activate"}
          </FleetActionButton>
        </div>
      ),
      align: "center",
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Geo-fences</h2>
        <p className="text-sm text-muted-foreground">
          Linked alert zones for customers, jobs, yards, and priority service areas.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={geofences}
        getRowKey={(geofence) => geofence.id}
        emptyMessage="No geo-fences match this view."
        searchPlaceholder="Search geo-fences..."
        exportFileName="fleet-geofences.csv"
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
