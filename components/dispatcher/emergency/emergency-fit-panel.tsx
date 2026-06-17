"use client";

import { CheckCircle2, MapPin, Star, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AdminEmployee, AdminJob } from "@/types";
import {
  getAvailableTechnicians,
  getResponseEtaMinutes,
  getTechnicianFitScore,
} from "./emergency-utils";

export function EmergencyFitPanel({
  job,
  technicians,
}: {
  job?: AdminJob;
  technicians: AdminEmployee[];
}) {
  const rankedTechnicians = job
    ? getAvailableTechnicians(technicians).slice(0, 4)
    : [];

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Fast Assignment Fit</h2>
        <p className="text-sm text-muted-foreground">
          Capacity, status, location, rating, and mock skill fit for the selected urgent job.
        </p>
      </div>

      {!job ? (
        <div className="rounded-lg border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
          Select an urgent job to compare technicians.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-lg border border-border/70 bg-background p-4">
            <p className="text-sm font-medium">{job.jobNumber}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {job.serviceType} for {job.customerName}
            </p>
            <Badge variant="secondary" className="mt-3">
              Target ETA {getResponseEtaMinutes(job)}m
            </Badge>
          </div>

          {rankedTechnicians.map((technician) => {
            const fitScore = getTechnicianFitScore(technician, job);
            const utilization = Math.round(
              (technician.scheduledHours / technician.capacityHours) * 100,
            );

            return (
              <div
                key={technician.id}
                className="rounded-lg border border-border/70 bg-background p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">{technician.name}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {technician.currentLocation}
                    </p>
                  </div>
                  <Badge variant={technician.status === "active" ? "default" : "outline"}>
                    {technician.status === "active" ? "Ready" : "Unavailable"}
                  </Badge>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Fit score</p>
                    <p className="mt-1 font-semibold">{fitScore}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Utilization</p>
                    <p className="mt-1 font-semibold">{utilization}%</p>
                  </div>
                </div>
                <Progress value={fitScore} className="mt-3" />

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    {technician.rating.toFixed(1)} rating
                  </span>
                  <Button size="sm" disabled={technician.status !== "active"}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Assign
                  </Button>
                </div>
              </div>
            );
          })}

          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900 dark:border-green-900 dark:bg-green-950/25 dark:text-green-200">
            <div className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Mock notifications will alert technician, dispatcher, and customer.</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
