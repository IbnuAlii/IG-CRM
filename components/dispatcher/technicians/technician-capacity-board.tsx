"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AdminEmployee, AdminJob } from "@/types";
import {
  getTechnicianAvailabilityLabel,
  getTechnicianAvailabilityTone,
  getTechnicianJobs,
  getTechnicianUtilization,
} from "./technician-utils";

export function TechnicianCapacityBoard({
  technicians,
  jobs,
}: {
  technicians: AdminEmployee[];
  jobs: AdminJob[];
}) {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Availability Board</h2>
          <p className="text-sm text-muted-foreground">
            Technician workload, location, skills, and next assignment context.
          </p>
        </div>
        <Button variant="outline" asChild className="w-full sm:w-fit">
          <Link href="/dispatcher/schedule">
            Open Schedule
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {technicians.map((technician) => {
          const utilization = getTechnicianUtilization(technician);
          const technicianJobs = getTechnicianJobs(technician, jobs);
          const nextJob = technicianJobs
            .filter((job) => job.status !== "completed")
            .sort(
              (left, right) =>
                left.scheduledStart.getTime() - right.scheduledStart.getTime(),
            )[0];

          return (
            <div
              key={technician.id}
              className="rounded-lg border border-border/70 bg-background p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{technician.name}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">
                      {technician.currentLocation ?? "Location unavailable"}
                    </span>
                  </p>
                </div>
                <AdminStatusBadge status={technician.status} />
              </div>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium">
                    {getTechnicianAvailabilityLabel(technician)}
                  </span>
                  <span className="text-muted-foreground">
                    {technician.scheduledHours}/{technician.capacityHours}h
                  </span>
                </div>
                <Progress value={utilization} />
                <Badge
                  variant="outline"
                  className="mt-2"
                  data-tone={getTechnicianAvailabilityTone(technician)}
                >
                  {utilization}% utilization
                </Badge>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {technician.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="font-normal">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 rounded-md border border-border/70 p-3 text-sm">
                <p className="font-medium">Next assignment</p>
                {nextJob ? (
                  <Link
                    href={`/dispatcher/jobs/${nextJob.id}`}
                    className="mt-1 block text-muted-foreground hover:text-foreground"
                  >
                    {nextJob.jobNumber} - {nextJob.customerName}
                  </Link>
                ) : (
                  <p className="mt-1 text-muted-foreground">
                    No active assignment in the filtered set.
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {technicianJobs.length} assigned jobs
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Star className="h-4 w-4 text-amber-500" />
                  {technician.rating.toFixed(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
