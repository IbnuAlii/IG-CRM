"use client";

import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Clock3 } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AdminJob } from "@/types";
import { formatDashboardTime } from "./dashboard-formatters";

export function DashboardOperations({
  jobs,
  emergencyJob,
  acceptedQuotesCount,
  openTickets,
}: {
  jobs: AdminJob[];
  emergencyJob?: AdminJob;
  acceptedQuotesCount: number;
  openTickets: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="border-border/70 bg-card p-0 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/70 p-5">
          <div>
            <h2 className="text-lg font-semibold">Dispatch Timeline</h2>
            <p className="text-sm text-muted-foreground">
              Jobs ordered by operational urgency.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/dispatch">Open Board</Link>
          </Button>
        </div>
        <div className="divide-y divide-border/70">
          {jobs.slice(0, 5).map((job, index) => (
            <Link key={job.id} href={`/admin/jobs/${job.id}`} className="grid gap-4 p-5 transition hover:bg-accent/45 md:grid-cols-[88px_1fr_auto]">
              <div className="flex items-start gap-3">
                <div className={cn("grid h-10 w-10 place-items-center rounded-md border text-sm font-semibold", index === 0 ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300" : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300")}>
                  {formatDashboardTime(job.scheduledStart)}
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{job.jobNumber}</p>
                  <AdminStatusBadge status={job.priority} />
                  <AdminStatusBadge status={job.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {job.customerName} - {job.serviceType}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {job.address}
                </p>
              </div>
              <div className="flex items-center gap-2 md:justify-end">
                <Badge variant="secondary" className="gap-1">
                  <Clock3 className="h-3.5 w-3.5" />
                  {job.estimatedDurationMinutes}m
                </Badge>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <Card className="border-border/70 bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Priority Queue</h2>
            <p className="text-sm text-muted-foreground">
              The few things that should not wait.
            </p>
          </div>
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </div>
        <div className="space-y-3">
          <Link href={emergencyJob ? `/admin/jobs/${emergencyJob.id}` : "/admin/jobs"} className="block rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 transition hover:shadow-sm dark:border-red-900 dark:bg-red-950/25 dark:text-red-200">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold">Emergency dispatch</span>
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <p className="mt-1">
              Assign {emergencyJob?.jobNumber ?? "the emergency job"} before the SLA window closes.
            </p>
          </Link>
          <Link href="/admin/quotes" className="block rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 transition hover:shadow-sm dark:border-green-900 dark:bg-green-950/25 dark:text-green-200">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold">Revenue ready</span>
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <p className="mt-1">
              {acceptedQuotesCount} accepted quote can be converted into scheduled work.
            </p>
          </Link>
          <Link href="/admin/tickets" className="block rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 transition hover:shadow-sm dark:border-amber-900 dark:bg-amber-950/25 dark:text-amber-200">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold">Customer risk</span>
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <p className="mt-1">
              {openTickets} tickets are still open or in progress today.
            </p>
          </Link>
        </div>
      </Card>
    </div>
  );
}
