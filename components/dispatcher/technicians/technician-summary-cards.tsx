"use client";

import { MapPin, ShieldCheck, Star, Wrench } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { AdminEmployee, AdminJob } from "@/types";
import {
  getTechnicianJobs,
  getTechnicianUtilization,
} from "./technician-utils";

export function TechnicianSummaryCards({
  technicians,
  jobs,
  visibleCount,
}: {
  technicians: AdminEmployee[];
  jobs: AdminJob[];
  visibleCount: number;
}) {
  const activeTechnicians = technicians.filter(
    (technician) => technician.status === "active",
  );
  const avgUtilization = Math.round(
    technicians.reduce(
      (total, technician) => total + getTechnicianUtilization(technician),
      0,
    ) / Math.max(technicians.length, 1),
  );
  const assignedJobs = technicians.reduce(
    (total, technician) => total + getTechnicianJobs(technician, jobs).length,
    0,
  );
  const avgRating =
    technicians.reduce((total, technician) => total + technician.rating, 0) /
    Math.max(technicians.length, 1);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Technicians"
        value={technicians.length}
        description="Field service workers"
        trend={`${visibleCount} visible`}
        icon={Wrench}
        tone="blue"
      />
      <AdminStatCard
        label="Active"
        value={activeTechnicians.length}
        description="Can receive assignments"
        trend={`${technicians.length - activeTechnicians.length} unavailable`}
        icon={ShieldCheck}
        tone="green"
      />
      <AdminStatCard
        label="Avg Utilization"
        value={`${avgUtilization}%`}
        description="Scheduled versus capacity"
        trend={`${assignedJobs} assigned job stops`}
        icon={MapPin}
        tone={avgUtilization >= 85 ? "amber" : "blue"}
      />
      <AdminStatCard
        label="Avg Rating"
        value={avgRating.toFixed(1)}
        description="From completed service work"
        trend="Used during assignment fit"
        icon={Star}
        tone="neutral"
      />
    </div>
  );
}
