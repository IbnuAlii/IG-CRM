"use client";

import { Fuel, Gauge, ReceiptText, TrendingUp } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { FleetFuelLog, FleetVehicle } from "@/components/fleet/fleet-data";
import { formatFleetCurrency } from "@/components/fleet/fleet-data";

export function FuelSummaryCards({
  logs,
  vehicles,
}: {
  logs: FleetFuelLog[];
  vehicles: FleetVehicle[];
}) {
  const totalGallons = logs.reduce((total, log) => total + log.gallons, 0);
  const totalCost = logs.reduce((total, log) => total + log.cost, 0);
  const avgCostPerGallon = totalGallons > 0 ? totalCost / totalGallons : 0;
  const avgMpg =
    vehicles.reduce((total, vehicle) => total + vehicle.fuelEfficiencyMpg, 0) /
    Math.max(vehicles.length, 1);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Fuel Logs"
        value={logs.length}
        description="Recent purchases"
        trend={`${totalGallons.toFixed(1)} gallons`}
        icon={Fuel}
        tone="blue"
      />
      <AdminStatCard
        label="Fuel Spend"
        value={formatFleetCurrency(totalCost)}
        description="Filtered fuel cost"
        trend="Exportable for reports"
        icon={ReceiptText}
        tone="green"
      />
      <AdminStatCard
        label="Avg Cost/Gal"
        value={formatFleetCurrency(avgCostPerGallon)}
        description="Fuel price average"
        trend="Mock purchase data"
        icon={TrendingUp}
        tone="amber"
      />
      <AdminStatCard
        label="Avg MPG"
        value={avgMpg.toFixed(1)}
        description="Vehicle efficiency"
        trend="Used in cost reports"
        icon={Gauge}
        tone="neutral"
      />
    </div>
  );
}
