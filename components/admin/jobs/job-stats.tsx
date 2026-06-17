"use client";

import { BriefcaseBusiness, CalendarClock, Wrench } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { AdminJob } from "@/types";

export function JobStats({
  jobs,
  visibleCount,
}: {
  jobs: AdminJob[];
  visibleCount: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Total Jobs"
        value={jobs.length}
        description="Current mock register"
        trend={`${visibleCount} visible`}
        icon={BriefcaseBusiness}
        tone="blue"
      />
      <AdminStatCard
        label="Unassigned"
        value={jobs.filter((job) => !job.technicianId).length}
        description="Need dispatch ownership"
        trend="Assign from jobs or dispatch"
        icon={Wrench}
        tone="amber"
      />
      <AdminStatCard
        label="Emergency"
        value={jobs.filter((job) => job.priority === "emergency").length}
        description="Prioritized for routing"
        trend="Immediate notification required"
        icon={CalendarClock}
        tone="red"
      />
      <AdminStatCard
        label="Recurring"
        value={jobs.filter((job) => job.recurring).length}
        description="Maintenance work"
        trend="Linked to customer history"
        icon={CalendarClock}
        tone="green"
      />
    </div>
  );
}
