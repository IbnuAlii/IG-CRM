"use client";

import { AlertTriangle, FileCheck2, Fuel, Route } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type {
  FleetFuelLog,
  FleetMaintenanceLog,
  FleetRouteHistory,
  FleetVehicle,
} from "@/components/fleet/fleet-data";
import { formatFleetCurrency } from "@/components/fleet/fleet-data";

export function ReportSummaryCards({
  vehicles,
  fuelLogs,
  maintenanceLogs,
  routes,
}: {
  vehicles: FleetVehicle[];
  fuelLogs: FleetFuelLog[];
  maintenanceLogs: FleetMaintenanceLog[];
  routes: FleetRouteHistory[];
}) {
  const fuelSpend = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
  const maintenanceSpend = maintenanceLogs.reduce((sum, log) => sum + log.cost, 0);
  const routeMiles = routes.reduce((sum, route) => sum + route.distanceMiles, 0);
  const complianceAlerts = vehicles.reduce(
    (sum, vehicle) =>
      sum +
      vehicle.documents.filter((document) => document.status !== "valid").length,
    0,
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Fuel Cost"
        value={formatFleetCurrency(fuelSpend)}
        description="Recent fuel log total"
        trend={`${fuelLogs.length} fuel entries`}
        icon={Fuel}
        tone="green"
      />
      <AdminStatCard
        label="Service Cost"
        value={formatFleetCurrency(maintenanceSpend)}
        description="Maintenance spend"
        trend={`${maintenanceLogs.length} service records`}
        icon={AlertTriangle}
        tone={maintenanceSpend > 4000 ? "amber" : "blue"}
      />
      <AdminStatCard
        label="Route Miles"
        value={routeMiles.toFixed(1)}
        description="Historical GPS mileage"
        trend={`${routes.length} routes tracked`}
        icon={Route}
        tone="blue"
      />
      <AdminStatCard
        label="Compliance Alerts"
        value={complianceAlerts}
        description="Expiring or expired docs"
        trend="Registration, insurance, inspection"
        icon={FileCheck2}
        tone={complianceAlerts > 0 ? "red" : "green"}
      />
    </div>
  );
}
