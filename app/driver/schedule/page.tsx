"use client";

import Link from "next/link";
import { CalendarClock, Clock3, Download, MapPin, Plus, Route, ShieldAlert } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { TechnicianActionButton } from "@/components/driver/technician-action-button";
import { TechnicianPageHeader } from "@/components/driver/technician-page-header";
import {
  formatTechnicianDate,
  formatTechnicianTime,
  getTechnicianData,
  getTodayTechnicianJobs,
  technicianLeaveBalances,
  technicianProfile,
} from "@/components/driver/technician-utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const weekDays = [
  { day: "Mon", load: 65, jobs: 2 },
  { day: "Tue", load: 78, jobs: 3 },
  { day: "Wed", load: 52, jobs: 2 },
  { day: "Thu", load: 86, jobs: 4 },
  { day: "Fri", load: 71, jobs: 3 },
];

export default function TechnicianSchedulePage() {
  const { jobs, technician } = getTechnicianData();
  const sortedJobs = getTodayTechnicianJobs(jobs);

  return (
    <div className="mx-auto w-full max-w-[1760px] space-y-8 px-4 py-6 2xl:px-8">
      <TechnicianPageHeader
        badge="Personal schedule"
        title="My Schedule"
        description="Review today's agenda, route order, workload, availability, and leave balances."
        actions={
          <>
            <TechnicianActionButton variant="outline" feedbackTitle="Calendar export prepared">
              <Download className="mr-2 h-4 w-4" />
              Export iCal
            </TechnicianActionButton>
            <TechnicianActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle="Leave request opened">
              <Plus className="mr-2 h-4 w-4" />
              Request Leave
            </TechnicianActionButton>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
        <Card className="border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Today&apos;s Assignments</h2>
              <p className="text-sm text-muted-foreground">Jobs appear in scheduled order with route and status context.</p>
            </div>
            <CalendarClock className="h-5 w-5 text-blue-700" />
          </div>

          <div className="mt-6 space-y-4">
            {sortedJobs.map((job, index) => (
              <div key={job.id} className="grid gap-4 rounded-lg border border-border p-4 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-blue-50 font-semibold text-blue-700">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/driver/jobs/${job.id}`} className="font-semibold text-foreground hover:text-blue-700">
                      {job.serviceType}
                    </Link>
                    <AdminStatusBadge status={job.status} />
                    <AdminStatusBadge status={job.priority} />
                  </div>
                  <div className="mt-2 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                    <span className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-blue-700" />
                      {formatTechnicianTime(job.scheduledStart)} / {job.estimatedDurationMinutes} min
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-700" />
                      {job.address}
                    </span>
                    <span>{job.customerName}</span>
                  </div>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/driver/jobs/${job.id}`}>Open</Link>
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Shift Summary</h2>
            <div className="mt-5 space-y-4 text-sm">
              <SummaryLine label="Date" value={formatTechnicianDate(new Date())} />
              <SummaryLine label="Shift" value={technicianProfile.shift} />
              <SummaryLine label="Vehicle" value={`${technicianProfile.vehicle} / ${technicianProfile.licensePlate}`} />
              <SummaryLine label="Home base" value={technicianProfile.homeBase} />
              <SummaryLine label="Scheduled hours" value={`${technician?.scheduledHours ?? 0} of ${technician?.capacityHours ?? 0}`} />
            </div>
          </Card>

          <Card className="border-amber-200 bg-amber-50 p-6 shadow-sm">
            <div className="flex gap-3">
              <ShieldAlert className="mt-1 h-5 w-5 text-amber-700" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Conflict guard</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Dispatch conflict checks prevent overlapping assigned jobs. Any emergency reassignment will appear here.
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Leave Balance</h2>
            <div className="mt-5 grid gap-3">
              {technicianLeaveBalances.map((balance) => (
                <SummaryLine key={balance.label} label={balance.label} value={balance.value} />
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Route className="h-5 w-5 text-blue-700" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">Weekly Workload</h2>
            <p className="text-sm text-muted-foreground">Capacity view used by dispatch for assignment planning.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {weekDays.map((day) => (
            <div key={day.day} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground">{day.day}</p>
                <p className="text-sm text-muted-foreground">{day.jobs} jobs</p>
              </div>
              <Progress value={day.load} className="mt-4 h-2" />
              <p className="mt-2 text-sm text-muted-foreground">{day.load}% booked</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
