"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Clock3, MapPin, PhoneCall, Radio } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AdminJob } from "@/types";
import {
  getEscalationLevel,
  getEscalationTone,
  getResponseEtaMinutes,
} from "./emergency-utils";

export function EmergencyQueue({
  jobs,
  selectedJobId,
  onSelectJob,
}: {
  jobs: AdminJob[];
  selectedJobId?: string;
  onSelectJob: (job: AdminJob) => void;
}) {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Urgent Job Queue</h2>
          <p className="text-sm text-muted-foreground">
            Emergency jobs and high-priority work requiring dispatch attention.
          </p>
        </div>
        <Badge variant="outline" className="w-fit bg-background">
          {jobs.length} active signal{jobs.length === 1 ? "" : "s"}
        </Badge>
      </div>

      <div className="space-y-3">
        {jobs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
            No urgent jobs match the current filters.
          </div>
        ) : (
          jobs.map((job) => {
            const tone = getEscalationTone(job);

            return (
              <button
                key={job.id}
                type="button"
                onClick={() => onSelectJob(job)}
                className={cn(
                  "w-full rounded-lg border bg-background p-4 text-left transition hover:bg-accent/45",
                  selectedJobId === job.id && "border-primary ring-2 ring-primary/20",
                  tone === "red" &&
                    "border-red-200 bg-red-50/80 dark:border-red-900 dark:bg-red-950/20",
                  tone === "amber" &&
                    "border-amber-200 bg-amber-50/80 dark:border-amber-900 dark:bg-amber-950/20",
                )}
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={cn(
                          "gap-1.5 text-white",
                          tone === "red" ? "bg-red-600" : "bg-amber-600",
                        )}
                      >
                        <Radio className="h-3.5 w-3.5 animate-pulse" />
                        {getEscalationLevel(job)}
                      </Badge>
                      <Link
                        href={`/dispatcher/jobs/${job.id}`}
                        className="font-semibold hover:underline"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {job.jobNumber}
                      </Link>
                    </div>
                    <p className="mt-2 font-medium">
                      {job.customerName} - {job.serviceType}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {job.description}
                    </p>
                    <p className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{job.address}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <AdminStatusBadge status={job.priority} />
                    <AdminStatusBadge status={job.status} />
                    <Badge variant="secondary" className="gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      ETA {getResponseEtaMinutes(job)}m
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectJob(job);
                    }}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Escalate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <PhoneCall className="mr-2 h-4 w-4" />
                    Notify
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/dispatcher/jobs/${job.id}`}
                      onClick={(event) => event.stopPropagation()}
                    >
                      Open
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </button>
            );
          })
        )}
      </div>
    </Card>
  );
}
