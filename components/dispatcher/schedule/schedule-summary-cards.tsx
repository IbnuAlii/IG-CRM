"use client";

import { AlertTriangle, CalendarClock, ListChecks, Wrench } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { AdminEmployee, AdminJob } from "@/types";

export function ScheduleSummaryCards({
  jobs,
  technicians,
  riskCount,
}: {
  jobs: AdminJob[];
  technicians: AdminEmployee[];
  riskCount: number;
}) {
  const assignedJobs = jobs.filter((job) => job.technicianId);
  const avgUtilization = Math.round(
    (technicians.reduce(
      (total, technician) =>
        total + technician.scheduledHours / technician.capacityHours,
      0,
    ) /
      Math.max(technicians.length, 1)) *
      100,
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Visible Jobs"
        value={jobs.length}
        description="After schedule filters"
        trend={`${assignedJobs.length} assigned`}
        icon={CalendarClock}
        tone="blue"
      />
      <AdminStatCard
        label="Unassigned"
        value={jobs.length - assignedJobs.length}
        description="Need dispatch placement"
        trend="Shown in agenda and warnings"
        icon={ListChecks}
        tone="amber"
      />
      <AdminStatCard
        label="Technicians"
        value={technicians.length}
        description="Visible schedule columns"
        trend={`${avgUtilization}% average utilization`}
        icon={Wrench}
        tone="green"
      />
      <AdminStatCard
        label="Schedule Risks"
        value={riskCount}
        description="Conflicts and capacity warnings"
        trend="Mock conflict checks"
        icon={AlertTriangle}
        tone={riskCount > 0 ? "red" : "neutral"}
      />
    </div>
  );
}
