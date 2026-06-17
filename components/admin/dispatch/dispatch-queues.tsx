"use client";

import Link from "next/link";
import { AlertTriangle, ArrowUpRight } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AdminEmployee, AdminJob } from "@/types";

export function DispatchQueues({
  unassignedJobs,
  technicians,
  jobsBasePath = "/admin/jobs",
  teamPath = "/admin/team",
}: {
  unassignedJobs: AdminJob[];
  technicians: AdminEmployee[];
  jobsBasePath?: string;
  teamPath?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
      <Card className="border-border/70 bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Unassigned Jobs</h2>
            <p className="text-sm text-muted-foreground">
              Jobs waiting for technician assignment.
            </p>
          </div>
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </div>
        <div className="space-y-3">
          {unassignedJobs.map((job) => (
            <Link
              key={job.id}
              href={`${jobsBasePath}/${job.id}`}
              className="block rounded-lg border border-border/70 bg-background p-4 text-sm transition hover:bg-accent/45"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{job.jobNumber}</p>
                  <p className="mt-1 text-muted-foreground">
                    {job.customerName} - {job.serviceType}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <AdminStatusBadge status={job.priority} />
                <Badge variant="secondary">{job.estimatedDurationMinutes}m</Badge>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <Card className="border-border/70 bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Technician Availability</h2>
            <p className="text-sm text-muted-foreground">
              Workload compared with scheduled capacity.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={teamPath}>Open Team</Link>
          </Button>
        </div>
        <div className="space-y-4">
          {technicians.map((technician) => {
            const workload = Math.round(
              (technician.scheduledHours / technician.capacityHours) * 100,
            );

            return (
              <div
                key={technician.id}
                className="rounded-lg border border-border/70 bg-background p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{technician.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {technician.skills.join(", ")}
                    </p>
                  </div>
                  <Badge variant="outline">{workload}%</Badge>
                </div>
                <Progress value={workload} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
