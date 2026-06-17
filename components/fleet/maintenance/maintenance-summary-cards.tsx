"use client";

import { AlertTriangle, CalendarClock, ReceiptText, Wrench } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type {
  FleetMaintenanceLog,
  FleetVehicle,
} from "@/components/fleet/fleet-data";
import { formatFleetCurrency } from "@/components/fleet/fleet-data";

export function MaintenanceSummaryCards({
  logs,
  vehicles,
}: {
  logs: FleetMaintenanceLog[];
  vehicles: FleetVehicle[];
}) {
  const totalCost = logs.reduce((total, log) => total + log.cost, 0);
  const missingReceipts = logs.filter((log) => log.receiptStatus === "missing").length;
  const inMaintenance = vehicles.filter(
    (vehicle) => vehicle.status === "in_maintenance",
  ).length;
  const dueSoon = vehicles.filter((vehicle) => vehicle.nextServiceDate <= "2026-06-01").length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Maintenance Logs"
        value={logs.length}
        description="Recorded service events"
        trend={`${inMaintenance} vehicles in maintenance`}
        icon={Wrench}
        tone="blue"
      />
      <AdminStatCard
        label="Total Cost"
        value={formatFleetCurrency(totalCost)}
        description="Current log total"
        trend="Feeds fleet reports"
        icon={ReceiptText}
        tone="green"
      />
      <AdminStatCard
        label="Due Soon"
        value={dueSoon}
        description="Service due by date/mileage"
        trend="Reminder queue source"
        icon={CalendarClock}
        tone={dueSoon > 0 ? "amber" : "green"}
      />
      <AdminStatCard
        label="Receipt Gaps"
        value={missingReceipts}
        description="Missing invoices/receipts"
        trend="Action required"
        icon={AlertTriangle}
        tone={missingReceipts > 0 ? "red" : "green"}
      />
    </div>
  );
}
