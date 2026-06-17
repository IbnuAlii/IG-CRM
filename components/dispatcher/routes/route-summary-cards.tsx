"use client";

import { Clock3, Fuel, MapPin, Zap } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { RouteStop } from "./route-utils";
import { getRouteMetrics } from "./route-utils";

export function RouteSummaryCards({ stops }: { stops: RouteStop[] }) {
  const metrics = getRouteMetrics(stops);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Route Stops"
        value={stops.length}
        description="Selected jobs in sequence"
        trend={`${metrics.emergencyStops} emergency priority`}
        icon={MapPin}
        tone="blue"
      />
      <AdminStatCard
        label="Distance"
        value={`${metrics.distance.toFixed(1)} mi`}
        description="Mock optimized distance"
        trend="Calculated from stop order"
        icon={Fuel}
        tone="green"
      />
      <AdminStatCard
        label="Drive Time"
        value={`${Math.round(metrics.driveMinutes)}m`}
        description="Estimated travel only"
        trend={`${Math.round(metrics.serviceMinutes)}m service time`}
        icon={Clock3}
        tone="amber"
      />
      <AdminStatCard
        label="Time Saved"
        value={`${metrics.savedMinutes}m`}
        description="Optimization estimate"
        trend="Before backend routing"
        icon={Zap}
        tone="green"
      />
    </div>
  );
}
