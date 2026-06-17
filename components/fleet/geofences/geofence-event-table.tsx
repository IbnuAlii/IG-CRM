"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { FleetGeofenceEvent } from "@/components/fleet/fleet-data";

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function GeofenceEventTable({
  events,
}: {
  events: FleetGeofenceEvent[];
}) {
  const columns: DataTableColumn<FleetGeofenceEvent>[] = [
    {
      id: "event",
      header: "Event",
      accessorFn: (event) => `${event.geofenceName} ${event.eventType}`,
      cell: (event) => (
        <div>
          <p className="font-medium">{event.geofenceName}</p>
          <p className="text-xs text-muted-foreground">{event.linkedRecord}</p>
        </div>
      ),
    },
    {
      id: "type",
      header: "Type",
      accessorFn: (event) => event.eventType,
      cell: (event) => (
        <Badge variant={event.eventType === "entry" ? "secondary" : "outline"}>
          {event.eventType}
        </Badge>
      ),
      align: "center",
    },
    {
      id: "vehicle",
      header: "Vehicle",
      accessorFn: (event) => `${event.vehicleUnit} ${event.driverName}`,
      cell: (event) => (
        <div>
          <p className="font-medium">{event.vehicleUnit}</p>
          <p className="text-xs text-muted-foreground">{event.driverName}</p>
        </div>
      ),
    },
    {
      id: "time",
      header: "Time",
      accessorFn: (event) => event.happenedAt,
      cell: (event) => formatEventDate(event.happenedAt),
      align: "center",
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Event History</h2>
        <p className="text-sm text-muted-foreground">
          Entry and exit events from active customer, job, and yard zones.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={events}
        getRowKey={(event) => event.id}
        emptyMessage="No geo-fence events recorded."
        searchPlaceholder="Search events..."
        exportFileName="fleet-geofence-events.csv"
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
