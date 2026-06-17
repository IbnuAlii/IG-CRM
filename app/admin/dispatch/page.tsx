"use client";

import { useMemo, useState } from "react";
import { DispatchBoard } from "@/components/admin/dispatch/dispatch-board";
import { DispatchControls } from "@/components/admin/dispatch/dispatch-controls";
import { DispatchHero } from "@/components/admin/dispatch/dispatch-hero";
import { DispatchMapAndRoutes } from "@/components/admin/dispatch/dispatch-map-and-routes";
import { DispatchQueues } from "@/components/admin/dispatch/dispatch-queues";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();

const timeSlots = [
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

export default function DispatchPage() {
  const [technicianFilter, setTechnicianFilter] = useState("all");
  const [view, setView] = useState("day");

  const technicians = data.employees.filter(
    (employee) => employee.role === "technician",
  );
  const visibleTechnicians = useMemo(() => {
    return technicianFilter === "all"
      ? technicians
      : technicians.filter((technician) => technician.id === technicianFilter);
  }, [technicianFilter, technicians]);

  const unassignedJobs = data.jobs.filter((job) => !job.technicianId);
  const emergencyJobs = data.jobs.filter((job) => job.priority === "emergency");
  const activeJobs = data.jobs.filter((job) =>
    ["pending", "assigned", "in_progress"].includes(job.status),
  );
  const avgUtilization = Math.round(
    (technicians.reduce(
      (total, technician) =>
        total + technician.scheduledHours / technician.capacityHours,
      0,
    ) /
      technicians.length) *
      100,
  );

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <DispatchHero
        activeJobsCount={activeJobs.length}
        unassignedJobsCount={unassignedJobs.length}
        emergencyJobsCount={emergencyJobs.length}
        avgUtilization={avgUtilization}
      />
      <DispatchControls
        technicians={technicians}
        technicianFilter={technicianFilter}
        setTechnicianFilter={setTechnicianFilter}
        view={view}
        setView={setView}
      />
      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.45fr_0.95fr]">
        <DispatchBoard
          jobs={data.jobs}
          view={view}
          visibleTechnicians={visibleTechnicians}
          timeSlots={timeSlots}
        />
        <DispatchMapAndRoutes
          technicians={technicians}
          jobs={data.jobs}
        />
      </div>
      <DispatchQueues
        unassignedJobs={unassignedJobs}
        technicians={technicians}
      />
    </div>
  );
}
