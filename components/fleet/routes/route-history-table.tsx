"use client";

import { Download, Play } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Card } from "@/components/ui/card";
import type { FleetRouteHistory } from "@/components/fleet/fleet-data";
import { formatFleetDate } from "@/components/fleet/fleet-data";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";

export function RouteHistoryTable({
  routes,
  onSelectRoute,
}: {
  routes: FleetRouteHistory[];
  onSelectRoute: (route: FleetRouteHistory) => void;
}) {
  const columns: DataTableColumn<FleetRouteHistory>[] = [
    {
      id: "vehicle",
      header: "Vehicle",
      accessorFn: (route) => `${route.vehicleUnit} ${route.driverName}`,
      cell: (route) => (
        <div>
          <p className="font-medium">{route.vehicleUnit}</p>
          <p className="text-xs text-muted-foreground">{route.driverName}</p>
        </div>
      ),
    },
    {
      id: "date",
      header: "Date",
      accessorFn: (route) => route.date,
      cell: (route) => formatFleetDate(route.date),
    },
    {
      id: "time",
      header: "Time",
      accessorFn: (route) => `${route.startTime}-${route.endTime}`,
      cell: (route) => `${route.startTime}-${route.endTime}`,
      align: "center",
    },
    {
      id: "distance",
      header: "Distance",
      accessorFn: (route) => route.distanceMiles,
      cell: (route) => `${route.distanceMiles} mi`,
      align: "center",
    },
    {
      id: "events",
      header: "Events",
      accessorFn: (route) =>
        route.behaviorEvents.speeding +
        route.behaviorEvents.harshBraking +
        route.behaviorEvents.idling,
      cell: (route) =>
        route.behaviorEvents.speeding +
        route.behaviorEvents.harshBraking +
        route.behaviorEvents.idling,
      align: "center",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: (route) => (
        <div className="flex justify-center gap-2">
          <FleetActionButton
            size="sm"
            variant="outline"
            onClick={() => onSelectRoute(route)}
            feedbackTitle="Route playback loaded"
            feedbackDescription={`${route.vehicleUnit} route is shown on the map.`}
          >
            <Play className="mr-2 h-4 w-4" />
            Play
          </FleetActionButton>
          <FleetActionButton
            size="sm"
            variant="outline"
            feedbackTitle="Route export prepared"
            feedbackDescription={`${route.vehicleUnit} historical GPS export queued.`}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </FleetActionButton>
        </div>
      ),
      align: "center",
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Historical Routes</h2>
        <p className="text-sm text-muted-foreground">
          Playback, stops, distance, duration, and driver behavior events.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={routes}
        getRowKey={(route) => route.id}
        emptyMessage="No route history matches these filters."
        searchPlaceholder="Search routes..."
        exportFileName="fleet-route-history.csv"
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
