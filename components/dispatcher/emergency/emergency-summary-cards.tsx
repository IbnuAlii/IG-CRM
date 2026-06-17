"use client";

import { AlertTriangle, Radio, ShieldAlert, Wrench } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { AdminEmployee, AdminJob } from "@/types";
import { getEmergencyJobs } from "./emergency-utils";

export function EmergencySummaryCards({
  jobs,
  technicians,
}: {
  jobs: AdminJob[];
  technicians: AdminEmployee[];
}) {
  const urgentJobs = getEmergencyJobs(jobs);
  const emergencyJobs = jobs.filter((job) => job.priority === "emergency");
  const unassignedEmergency = emergencyJobs.filter((job) => !job.technicianId);
  const activeTechnicians = technicians.filter(
    (technician) =>
      technician.role === "technician" && technician.status === "active",
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Urgent Queue"
        value={urgentJobs.length}
        description="Emergency and high priority"
        trend="Live dispatch watchlist"
        icon={Radio}
        tone="red"
      />
      <AdminStatCard
        label="Emergency"
        value={emergencyJobs.length}
        description="Immediate escalation"
        trend={`${unassignedEmergency.length} unassigned`}
        icon={ShieldAlert}
        tone="red"
      />
      <AdminStatCard
        label="Available Techs"
        value={activeTechnicians.length}
        description="Ready for reassignment"
        trend="Sorted by capacity fit"
        icon={Wrench}
        tone="green"
      />
      <AdminStatCard
        label="Escalation SLA"
        value="15m"
        description="Mock emergency target"
        trend="Notify dispatcher and customer"
        icon={AlertTriangle}
        tone="amber"
      />
    </div>
  );
}
