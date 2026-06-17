"use client";

import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { AdminEmployee, AdminJob } from "@/types";
import { ScheduleJobCard } from "./schedule-job-card";
import {
  formatScheduleDate,
  formatScheduleDay,
  getScheduleDays,
  isSameScheduleDate,
  scheduleTimeSlots,
  type ScheduleView,
} from "./schedule-utils";

export function ScheduleCalendarBoard({
  jobs,
  technicians,
  view,
}: {
  jobs: AdminJob[];
  technicians: AdminEmployee[];
  view: Exclude<ScheduleView, "agenda">;
}) {
  if (view === "day") {
    return <ScheduleDayBoard jobs={jobs} technicians={technicians} />;
  }

  return <ScheduleDateBoard jobs={jobs} view={view} />;
}

function ScheduleDayBoard({
  jobs,
  technicians,
}: {
  jobs: AdminJob[];
  technicians: AdminEmployee[];
}) {
  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border/70 bg-muted/20 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Day Schedule</h2>
          <p className="text-sm text-muted-foreground">
            Technician columns with hourly placement and capacity markers.
          </p>
        </div>
        <Badge variant="outline" className="w-fit bg-background">
          {jobs.filter((job) => job.technicianId).length} assigned jobs
        </Badge>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[820px]">
          <div
            className="grid border-b border-border/70 bg-background text-xs font-medium text-muted-foreground"
            style={{
              gridTemplateColumns: `112px repeat(${Math.max(technicians.length, 1)}, minmax(190px, 1fr))`,
            }}
          >
            <div className="p-3">Time</div>
            {technicians.map((technician) => (
              <div key={technician.id} className="border-l border-border/70 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {technician.name}
                  </p>
                  {technician.status === "on_leave" ? (
                    <Badge variant="outline">On Leave</Badge>
                  ) : null}
                </div>
                <p className="truncate">{technician.currentLocation}</p>
              </div>
            ))}
          </div>
          {scheduleTimeSlots.map((slot) => (
            <div
              key={slot}
              className="grid min-h-[112px] border-b border-border/70 last:border-b-0"
              style={{
                gridTemplateColumns: `112px repeat(${Math.max(technicians.length, 1)}, minmax(190px, 1fr))`,
              }}
            >
              <div className="bg-muted/20 p-3 text-sm font-medium text-muted-foreground">
                {slot}
              </div>
              {technicians.map((technician) => {
                const slotHour = Number(slot.split(":")[0]);
                const slotJobs = jobs.filter(
                  (job) =>
                    job.technicianId === technician.id &&
                    job.scheduledStart.getHours() === slotHour,
                );

                return (
                  <div
                    key={`${technician.id}-${slot}`}
                    className="space-y-2 border-l border-border/70 p-3"
                  >
                    {slotJobs.length > 0 ? (
                      slotJobs.map((job) => (
                        <ScheduleJobCard key={job.id} job={job} compact />
                      ))
                    ) : (
                      <div className="h-full rounded-md border border-dashed border-border/70 bg-muted/10" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function ScheduleDateBoard({
  jobs,
  view,
}: {
  jobs: AdminJob[];
  view: "week" | "month";
}) {
  const days = getScheduleDays(jobs);

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border/70 bg-muted/20 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {view === "week" ? "Week Schedule" : "Month Workload"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Jobs grouped by service date for scan-friendly planning.
          </p>
        </div>
        <CalendarDays className="h-5 w-5 text-primary" />
      </div>
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 xl:grid-cols-7">
        {days.map((day) => {
          const dayJobs = jobs.filter((job) =>
            isSameScheduleDate(job.scheduledStart, day),
          );

          return (
            <div
              key={day.toISOString()}
              className="min-h-64 border-b border-border/70 p-4 xl:border-r xl:last:border-r-0"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">
                    {formatScheduleDay(day)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatScheduleDate(day)}
                  </p>
                </div>
                <Badge variant="secondary">{dayJobs.length}</Badge>
              </div>
              <div className="space-y-2">
                {dayJobs.length > 0 ? (
                  dayJobs.map((job) => (
                    <ScheduleJobCard key={job.id} job={job} compact />
                  ))
                ) : (
                  <div className="rounded-md border border-dashed border-border/70 p-4 text-center text-xs text-muted-foreground">
                    No jobs
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
