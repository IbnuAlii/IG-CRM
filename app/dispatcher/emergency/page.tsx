"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, Route } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EmergencyEscalationPanel } from "@/components/dispatcher/emergency/emergency-escalation-panel";
import { EmergencyFilters } from "@/components/dispatcher/emergency/emergency-filters";
import { EmergencyFitPanel } from "@/components/dispatcher/emergency/emergency-fit-panel";
import { EmergencyQueue } from "@/components/dispatcher/emergency/emergency-queue";
import { EmergencySummaryCards } from "@/components/dispatcher/emergency/emergency-summary-cards";
import { getEmergencyJobs } from "@/components/dispatcher/emergency/emergency-utils";
import { Button } from "@/components/ui/button";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();

export default function DispatcherEmergencyPage() {
  const [status, setStatus] = useState("all");
  const [ownership, setOwnership] = useState("all");
  const urgentJobs = getEmergencyJobs(data.jobs);
  const [selectedJobId, setSelectedJobId] = useState(urgentJobs[0]?.id);

  const technicians = data.employees.filter(
    (employee) => employee.role === "technician",
  );

  const filteredJobs = useMemo(() => {
    return urgentJobs.filter((job) => {
      const matchesStatus = status === "all" || job.status === status;
      const matchesOwnership =
        ownership === "all" ||
        (ownership === "unassigned" && !job.technicianId) ||
        (ownership === "assigned" && !!job.technicianId);
      return matchesStatus && matchesOwnership;
    });
  }, [ownership, status, urgentJobs]);

  const selectedJob =
    filteredJobs.find((job) => job.id === selectedJobId) ?? filteredJobs[0];

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Emergency"
        description="Prioritize urgent work, assign technicians quickly, notify stakeholders, and keep emergency routes moving."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/dispatcher/routes">
                <Route className="mr-2 h-4 w-4" />
                Routes
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dispatcher/schedule">
                <CalendarClock className="mr-2 h-4 w-4" />
                Schedule
              </Link>
            </Button>
          </>
        }
      />

      <EmergencySummaryCards jobs={data.jobs} technicians={technicians} />
      <EmergencyFilters
        status={status}
        setStatus={setStatus}
        ownership={ownership}
        setOwnership={setOwnership}
      />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
        <EmergencyQueue
          jobs={filteredJobs}
          selectedJobId={selectedJob?.id}
          onSelectJob={(job) => setSelectedJobId(job.id)}
        />
        <EmergencyEscalationPanel job={selectedJob} />
      </div>

      <EmergencyFitPanel job={selectedJob} technicians={technicians} />
    </div>
  );
}
