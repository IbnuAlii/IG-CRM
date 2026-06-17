"use client";

import { Fragment } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AdminEmployee, AdminJob } from "@/types";
import { formatDispatchTime } from "./dispatch-formatters";

export function DispatchBoard({
  jobs,
  view,
  visibleTechnicians,
  timeSlots,
  jobsBasePath = "/admin/jobs",
}: {
  jobs: AdminJob[];
  view: string;
  visibleTechnicians: AdminEmployee[];
  timeSlots: string[];
  jobsBasePath?: string;
}) {
  const visibleJobIds = new Set(
    visibleTechnicians.flatMap((technician) =>
      jobs
        .filter((job) => job.technicianId === technician.id)
        .map((job) => job.id),
    ),
  );
  const visibleJobs = jobs.filter((job) => visibleJobIds.has(job.id));

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border/70 bg-muted/20 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Dispatch Board</h2>
          <p className="text-sm text-muted-foreground">
            {view.charAt(0).toUpperCase() + view.slice(1)} scheduling by
            technician and time.
          </p>
        </div>
        <Badge variant="outline" className="w-fit bg-background">
          {visibleJobs.length} jobs visible
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div
            className="grid border-b border-border/70 bg-background text-xs font-medium text-muted-foreground"
            style={{
              gridTemplateColumns: `112px repeat(${Math.max(visibleTechnicians.length, 1)}, minmax(180px, 1fr))`,
            }}
          >
            <div className="p-3">Time</div>
            {visibleTechnicians.map((technician) => (
              <div key={technician.id} className="border-l border-border/70 p-3">
                <p className="text-sm font-semibold text-foreground">
                  {technician.name}
                </p>
                <p>{technician.currentLocation}</p>
              </div>
            ))}
          </div>

          <div>
            {timeSlots.map((slot) => (
              <div
                key={slot}
                className="grid min-h-[104px] border-b border-border/70 last:border-b-0"
                style={{
                  gridTemplateColumns: `112px repeat(${Math.max(visibleTechnicians.length, 1)}, minmax(180px, 1fr))`,
                }}
              >
                <div className="bg-muted/20 p-3 text-sm font-medium text-muted-foreground">
                  {slot}
                </div>
                {visibleTechnicians.map((technician) => {
                  const slotJobs = jobs.filter(
                    (job) =>
                      job.technicianId === technician.id &&
                      formatDispatchTime(job.scheduledStart).startsWith(
                        slot.split(":")[0],
                      ),
                  );

                  return (
                    <div
                      key={`${slot}-${technician.id}`}
                      className="space-y-2 border-l border-border/70 p-3"
                    >
                      {slotJobs.length === 0 ? (
                        <div className="h-full rounded-md border border-dashed border-border/70 bg-muted/10" />
                      ) : (
                        slotJobs.map((job) => (
                          <Fragment key={job.id}>
                            <Link
                              href={`${jobsBasePath}/${job.id}`}
                              className={cn(
                                "block rounded-lg border p-3 text-sm transition hover:shadow-sm",
                                job.priority === "emergency"
                                  ? "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/25 dark:text-red-200"
                                  : "border-border bg-background",
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="font-semibold">
                                    {job.jobNumber}
                                  </p>
                                  <p className="mt-1 truncate text-xs text-muted-foreground">
                                    {job.customerName}
                                  </p>
                                </div>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                              </div>
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                <AdminStatusBadge status={job.priority} />
                                <AdminStatusBadge status={job.status} />
                              </div>
                              <Badge
                                variant="secondary"
                                className="mt-3 gap-1 text-xs"
                              >
                                <Clock3 className="h-3 w-3" />
                                {job.estimatedDurationMinutes}m
                              </Badge>
                            </Link>
                          </Fragment>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
