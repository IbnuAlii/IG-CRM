"use client";

import { useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  MapPinned,
  Radio,
  Route,
  Star,
  Timer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TechnicianActionButton } from "@/components/driver/technician-action-button";
import { TechnicianJobCard } from "@/components/driver/technician-job-card";
import { TechnicianPageHeader } from "@/components/driver/technician-page-header";
import { TechnicianRoutePanel } from "@/components/driver/technician-route-panel";
import { TechnicianStatCard } from "@/components/driver/technician-stat-card";
import {
  getActiveTechnicianJobs,
  getTechnicianData,
  technicianChecklist,
  technicianProfile,
  technicianRouteStops,
  technicianStatusLabels,
  technicianTimeLog,
  type TechnicianWorkStatus,
} from "@/components/driver/technician-utils";

export default function TechnicianDashboardPage() {
  const [workStatus, setWorkStatus] = useState<TechnicianWorkStatus>("clocked_in");
  const { technician, jobs } = getTechnicianData();
  const activeJobs = getActiveTechnicianJobs(jobs);
  const currentJob = activeJobs[0];
  const completedJobs = jobs.filter((job) => job.status === "completed");
  const utilization = technician
    ? Math.round((technician.scheduledHours / technician.capacityHours) * 100)
    : 0;

  return (
    <div className="mx-auto w-full max-w-[1760px] space-y-8 px-4 py-6 2xl:px-8">
      <TechnicianPageHeader
        badge="Field operations"
        title={`Good afternoon, ${technician?.name?.split(" ")[0] ?? "Technician"}`}
        description="Clock in, follow today's route, update assigned jobs, capture proof of work, and keep dispatch synchronized."
        actions={
          <>
            <TechnicianActionButton
              variant="outline"
              feedbackTitle="GPS status refreshed"
              feedbackDescription="Latest mobile GPS packet is ready for backend sync."
            >
              <MapPinned className="mr-2 h-4 w-4" />
              Refresh GPS
            </TechnicianActionButton>
            <TechnicianActionButton
              className="bg-blue-600 hover:bg-blue-700"
              feedbackTitle={workStatus === "clocked_in" ? "Clock out queued" : "Clock in queued"}
              onClick={() => setWorkStatus((value) => (value === "clocked_in" ? "on_break" : "clocked_in"))}
            >
              <Radio className="mr-2 h-4 w-4" />
              {workStatus === "clocked_in" ? "Clock Out" : "Clock In"}
            </TechnicianActionButton>
          </>
        }
      />

      <Card className="overflow-hidden border-border bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 text-white shadow-sm dark:from-blue-950 dark:via-slate-950 dark:to-black">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/15">
                {technicianStatusLabels[workStatus]}
              </Badge>
              <Badge className="bg-blue-400/15 text-blue-100 hover:bg-blue-400/15">
                GPS updated {technicianProfile.gpsUpdatedAt}
              </Badge>
            </div>
            <h2 className="mt-6 max-w-3xl text-3xl font-semibold tracking-normal text-white md:text-5xl">
              {currentJob ? `${currentJob.serviceType} at ${currentJob.customerName}` : "No active field assignment"}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100/80 md:text-base">
              {currentJob
                ? `${currentJob.address}. ${currentJob.description}`
                : "Review your schedule or wait for dispatch to assign the next job."}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["Vehicle", technicianProfile.vehicle],
                ["Shift", technicianProfile.shift],
                ["Home base", technicianProfile.homeBase],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase text-blue-200/70">{label}</p>
                  <p className="mt-1 font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-card p-5 text-foreground">
            <h3 className="text-lg font-semibold">Start-of-job checklist</h3>
            <div className="mt-5 space-y-3">
              {technicianChecklist.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm">
                  <span className="flex items-center gap-2">
                    {item.done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    {item.label}
                  </span>
                  <span className={item.done ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                    {item.done ? "Done" : "Needed"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TechnicianStatCard icon={BriefcaseBusiness} label="Active jobs" value={activeJobs.length} detail="Assigned or in progress" tone="blue" />
        <TechnicianStatCard icon={CheckCircle2} label="Completed" value={completedJobs.length} detail="Recorded in job history" tone="green" />
        <TechnicianStatCard icon={Timer} label="Utilization" value={`${utilization}%`} detail={`${technician?.scheduledHours ?? 0}/${technician?.capacityHours ?? 0} scheduled hrs`} tone="amber" />
        <TechnicianStatCard icon={Star} label="Rating" value={technician?.rating.toFixed(1) ?? "0.0"} detail="Customer service score" tone="purple" />
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card className="border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Current Assignment</h2>
                <p className="text-sm text-muted-foreground">Customer details, address, contact actions, and progress.</p>
              </div>
              <Route className="h-5 w-5 text-blue-700" />
            </div>
            {currentJob ? (
              <TechnicianJobCard job={currentJob} />
            ) : (
              <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                No active job assigned.
              </div>
            )}
          </Card>

          <Card className="border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Today&apos;s Route Order</h2>
            <div className="mt-5 space-y-4">
              {technicianRouteStops.map((stop, index) => (
                <div key={stop.label} className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                  <div className={`grid h-9 w-9 place-items-center rounded-full ${stop.status === "current" ? "bg-blue-600 text-white" : stop.status === "completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200" : "bg-muted text-muted-foreground"}`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{stop.label}</p>
                    <p className="text-sm text-muted-foreground">{stop.address}</p>
                  </div>
                  <Badge variant="outline">{stop.eta}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {currentJob ? <TechnicianRoutePanel job={currentJob} /> : null}
          <Card className="border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Attendance Timeline</h2>
            <div className="mt-5 space-y-4">
              {technicianTimeLog.map((item) => (
                <div key={item.label} className="flex gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full bg-blue-600" />
                  <div>
                    <p className="font-semibold text-foreground">{item.label} <span className="text-sm font-normal text-muted-foreground">{item.time}</span></p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Weekly Capacity</h2>
            <p className="mt-1 text-sm text-muted-foreground">Scheduled workload versus available field hours.</p>
            <div className="mt-5">
              <Progress value={utilization} className="h-3" />
              <p className="mt-2 text-sm text-muted-foreground">{utilization}% booked this week</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
