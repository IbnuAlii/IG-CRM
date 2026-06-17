"use client";

import Link from "next/link";
import { Clock3, MapPin } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AdminJob } from "@/types";
import { formatScheduleTime, getJobEnd } from "./schedule-utils";

export function ScheduleJobCard({
  job,
  compact = false,
}: {
  job: AdminJob;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/dispatcher/jobs/${job.id}`}
      className={cn(
        "block rounded-lg border bg-background p-3 text-sm transition hover:bg-accent/45 hover:shadow-sm",
        job.priority === "emergency" &&
          "border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950/25 dark:text-red-100",
      )}
    >
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold">{job.jobNumber}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {job.customerName}
          </p>
        </div>
        <Badge variant="secondary" className="shrink-0 gap-1">
          <Clock3 className="h-3 w-3" />
          {formatScheduleTime(job.scheduledStart)}
        </Badge>
      </div>
      {!compact ? (
        <>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <AdminStatusBadge status={job.status} />
            <AdminStatusBadge status={job.priority} />
          </div>
          <div className="mt-3 flex min-w-0 items-start gap-2 text-xs text-muted-foreground">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-2">
              {job.address}
            </span>
          </div>
        </>
      ) : null}
      <p className="mt-2 text-xs text-muted-foreground">
        Ends {formatScheduleTime(getJobEnd(job))}
      </p>
    </Link>
  );
}
