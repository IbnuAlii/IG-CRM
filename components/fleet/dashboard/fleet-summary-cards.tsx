"use client";

import { AlertTriangle, Fuel, Radar, Truck } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { FleetFuelLog, FleetVehicle } from "@/components/fleet/fleet-data";
import { formatFleetCurrency } from "@/components/fleet/fleet-data";

export function FleetSummaryCards({
  vehicles,
  fuelLogs,
}: {
  vehicles: FleetVehicle[];
  fuelLogs: FleetFuelLog[];
}) {
  const active = vehicles.filter((vehicle) => vehicle.status === "active").length;
  const tracking = vehicles.filter((vehicle) => vehicle.gpsStatus !== "offline").length;
  const alerts = vehicles.reduce(
    (total, vehicle) =>
      total +
      vehicle.documents.filter((document) => document.status !== "valid").length,
    0,
  );
  const fuelCost = fuelLogs.reduce((total, log) => total + log.cost, 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Vehicles"
        value={vehicles.length}
        description="Fleet profiles tracked"
        trend={`${active} active units`}
        icon={Truck}
        tone="blue"
      />
      <AdminStatCard
        label="GPS Online"
        value={tracking}
        description="Moving, idle, or parked"
        trend={`${vehicles.length - tracking} offline`}
        icon={Radar}
        tone={vehicles.length - tracking > 0 ? "amber" : "green"}
      />
      <AdminStatCard
        label="Document Alerts"
        value={alerts}
        description="Expiring or expired docs"
        trend="Registration and insurance"
        icon={AlertTriangle}
        tone={alerts > 0 ? "red" : "green"}
      />
      <AdminStatCard
        label="Fuel Spend"
        value={formatFleetCurrency(fuelCost)}
        description="Recent fuel log total"
        trend="Feeds cost reports"
        icon={Fuel}
        tone="green"
      />
    </div>
  );
}
