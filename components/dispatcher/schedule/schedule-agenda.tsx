"use client";

import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Card } from "@/components/ui/card";
import type { AdminJob } from "@/types";
import { ScheduleJobCard } from "./schedule-job-card";
import { formatScheduleDate, formatScheduleTime } from "./schedule-utils";

export function ScheduleAgenda({ jobs }: { jobs: AdminJob[] }) {
  const sortedJobs = [...jobs].sort(
    (left, right) =>
      left.scheduledStart.getTime() - right.scheduledStart.getTime(),
  );

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-5">
        <h2 className="text-lg font-semibold">Agenda</h2>
        <p className="text-sm text-muted-foreground">
          Chronological dispatch list with assignment and status context.
        </p>
      </div>
      <div className="divide-y divide-border/70">
        {sortedJobs.map((job) => (
          <div
            key={job.id}
            className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[160px_1fr_220px]"
          >
            <div>
              <p className="text-sm font-semibold">
                {formatScheduleDate(job.scheduledStart)}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatScheduleTime(job.scheduledStart)}
              </p>
            </div>
            <ScheduleJobCard job={job} />
            <div className="min-w-0 space-y-2 text-sm">
              <p className="font-medium">
                {job.technicianName ?? "Unassigned"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <AdminStatusBadge status={job.status} />
                <AdminStatusBadge status={job.priority} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
