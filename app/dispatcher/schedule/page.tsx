"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Move, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ScheduleAgenda } from "@/components/dispatcher/schedule/schedule-agenda";
import { ScheduleCalendarBoard } from "@/components/dispatcher/schedule/schedule-calendar-board";
import { ScheduleControls } from "@/components/dispatcher/schedule/schedule-controls";
import { ScheduleRiskPanel } from "@/components/dispatcher/schedule/schedule-risk-panel";
import { ScheduleSummaryCards } from "@/components/dispatcher/schedule/schedule-summary-cards";
import {
  getScheduleRisks,
  type ScheduleView,
} from "@/components/dispatcher/schedule/schedule-utils";
import { Button } from "@/components/ui/button";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();

export default function DispatcherSchedulePage() {
  const [technicianFilter, setTechnicianFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [customer, setCustomer] = useState("all");
  const [serviceType, setServiceType] = useState("all");
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const [view, setView] = useState<ScheduleView>("day");

  const technicians = data.employees.filter(
    (employee) => employee.role === "technician",
  );

  const filteredJobs = useMemo(() => {
    return data.jobs.filter((job) => {
      const matchesStatus = status === "all" || job.status === status;
      const matchesCustomer = customer === "all" || job.customerName === customer;
      const matchesServiceType =
        serviceType === "all" || job.serviceType === serviceType;
      const matchesTechnician =
        technicianFilter === "all" ||
        (technicianFilter === "unassigned" && !job.technicianId) ||
        job.technicianId === technicianFilter;
      return matchesStatus && matchesCustomer && matchesServiceType && matchesTechnician;
    });
  }, [customer, serviceType, status, technicianFilter]);

  const customers = useMemo(
    () => Array.from(new Set(data.jobs.map((job) => job.customerName))).sort(),
    [],
  );
  const serviceTypes = useMemo(
    () => Array.from(new Set(data.jobs.map((job) => job.serviceType))).sort(),
    [],
  );

  const visibleTechnicians = useMemo(() => {
    if (technicianFilter === "all" || technicianFilter === "unassigned") {
      return technicians;
    }
    return technicians.filter((technician) => technician.id === technicianFilter);
  }, [technicianFilter, technicians]);

  const risks = getScheduleRisks({
    jobs: filteredJobs,
    technicians: visibleTechnicians,
  });
  const blockingRiskCount = risks.filter((risk) => risk.id !== "clear").length;

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Schedule"
        description="Plan technician calendars across day, week, month, and agenda views with mocked conflict checks and capacity warnings."
        actions={
          <>
            <Button
              variant={rescheduleMode ? "default" : "outline"}
              onClick={() => setRescheduleMode((value) => !value)}
            >
              <Move className="mr-2 h-4 w-4" />
              Reschedule Mode
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export iCal
            </Button>
            <Button asChild>
              <Link href="/dispatcher/jobs">
                <Plus className="mr-2 h-4 w-4" />
                Create Job
              </Link>
            </Button>
          </>
        }
      />
      <ScheduleControls
        technicians={technicians}
        customers={customers}
        serviceTypes={serviceTypes}
        technicianFilter={technicianFilter}
        setTechnicianFilter={setTechnicianFilter}
        status={status}
        setStatus={setStatus}
        customer={customer}
        setCustomer={setCustomer}
        serviceType={serviceType}
        setServiceType={setServiceType}
        view={view}
        setView={setView}
      />
      {rescheduleMode ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/25 dark:text-amber-200">
          Drag-and-drop rescheduling mock is active. Job cards represent movable appointments; backend calendar persistence is pending.
        </div>
      ) : null}
      <ScheduleSummaryCards
        jobs={filteredJobs}
        technicians={visibleTechnicians}
        riskCount={blockingRiskCount}
      />
      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
        {view === "agenda" ? (
          <ScheduleAgenda jobs={filteredJobs} />
        ) : (
          <ScheduleCalendarBoard
            jobs={filteredJobs}
            technicians={visibleTechnicians}
            view={view}
          />
        )}
        <ScheduleRiskPanel risks={risks} />
      </div>
    </div>
  );
}
