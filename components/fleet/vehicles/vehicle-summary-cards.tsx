"use client";

import { AlertTriangle, Gauge, ShieldCheck, Truck } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { FleetVehicle } from "@/components/fleet/fleet-data";

export function VehicleSummaryCards({
  vehicles,
  visibleCount,
}: {
  vehicles: FleetVehicle[];
  visibleCount: number;
}) {
  const active = vehicles.filter((vehicle) => vehicle.status === "active").length;
  const maintenance = vehicles.filter(
    (vehicle) => vehicle.status === "in_maintenance",
  ).length;
  const avgMpg =
    vehicles.reduce((total, vehicle) => total + vehicle.fuelEfficiencyMpg, 0) /
    Math.max(vehicles.length, 1);
  const documentAlerts = vehicles.reduce(
    (total, vehicle) =>
      total +
      vehicle.documents.filter((document) => document.status !== "valid").length,
    0,
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Fleet Units"
        value={vehicles.length}
        description="Vehicle profiles"
        trend={`${visibleCount} visible`}
        icon={Truck}
        tone="blue"
      />
      <AdminStatCard
        label="Active"
        value={active}
        description="Available for assignment"
        trend={`${maintenance} in maintenance`}
        icon={ShieldCheck}
        tone="green"
      />
      <AdminStatCard
        label="Average MPG"
        value={avgMpg.toFixed(1)}
        description="Recent fuel efficiency"
        trend="From fuel log mock data"
        icon={Gauge}
        tone="neutral"
      />
      <AdminStatCard
        label="Doc Alerts"
        value={documentAlerts}
        description="Expiring or expired"
        trend="Reminder queue source"
        icon={AlertTriangle}
        tone={documentAlerts > 0 ? "red" : "green"}
      />
    </div>
  );
}
