"use client";

import { AlertTriangle, CalendarClock, FileWarning, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { FleetMaintenanceLog, FleetVehicle } from "@/components/fleet/fleet-data";
import { formatFleetDate } from "@/components/fleet/fleet-data";

export function FleetAlertPanel({
  vehicles,
  maintenanceLogs,
}: {
  vehicles: FleetVehicle[];
  maintenanceLogs: FleetMaintenanceLog[];
}) {
  const documentAlerts = vehicles.flatMap((vehicle) =>
    vehicle.documents
      .filter((document) => document.status !== "valid")
      .map((document) => ({
        id: document.id,
        title: `${vehicle.unitNumber} ${document.type}`,
        detail: `Expires ${formatFleetDate(document.expiresAt)}`,
        type: "Document",
      })),
  );
  const maintenanceAlerts = vehicles
    .filter((vehicle) => vehicle.status === "in_maintenance")
    .map((vehicle) => ({
      id: `maint-${vehicle.id}`,
      title: `${vehicle.unitNumber} in maintenance`,
      detail:
        maintenanceLogs.find((log) => log.vehicleId === vehicle.id)?.description ??
        "Maintenance activity in progress.",
      type: "Maintenance",
    }));
  const offlineAlerts = vehicles
    .filter((vehicle) => vehicle.gpsStatus === "offline")
    .map((vehicle) => ({
      id: `gps-${vehicle.id}`,
      title: `${vehicle.unitNumber} GPS offline`,
      detail: vehicle.currentLocation,
      type: "GPS",
    }));
  const alerts = [...documentAlerts, ...maintenanceAlerts, ...offlineAlerts];
  const iconByType = {
    Document: FileWarning,
    Maintenance: Wrench,
    GPS: CalendarClock,
  };

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Fleet Alerts</h2>
          <p className="text-sm text-muted-foreground">
            Expirations, maintenance reminders, and GPS health.
          </p>
        </div>
        <AlertTriangle className="h-5 w-5 text-amber-600" />
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = iconByType[alert.type as keyof typeof iconByType];

          return (
            <div
              key={alert.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-lg border border-border/70 bg-muted/40 p-2">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{alert.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {alert.detail}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="shrink-0 bg-background">
                {alert.type}
              </Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
