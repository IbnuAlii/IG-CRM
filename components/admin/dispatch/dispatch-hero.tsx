"use client";

import {
  AlertTriangle,
  CalendarClock,
  Compass,
  Navigation,
  Radio,
  RotateCcw,
  ShieldAlert,
  Wrench,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DispatchSignalCard } from "./dispatch-signal-card";

export function DispatchHero({
  activeJobsCount,
  unassignedJobsCount,
  emergencyJobsCount,
  avgUtilization,
}: {
  activeJobsCount: number;
  unassignedJobsCount: number;
  emergencyJobsCount: number;
  avgUtilization: number;
}) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-border/70 bg-card p-5 shadow-sm md:p-6">
      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge className="gap-1.5 bg-blue-600 text-white hover:bg-blue-600">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              Dispatch & Scheduling
            </Badge>
            <Badge variant="outline" className="gap-1.5 bg-background/80">
              <Compass className="h-3.5 w-3.5" />
              Technician assignment
            </Badge>
            <Badge variant="outline" className="gap-1.5 bg-background/80">
              <ShieldAlert className="h-3.5 w-3.5" />
              Scheduling conflict checks
            </Badge>
          </div>
          <h1 className="max-w-4xl text-3xl font-semibold md:text-5xl">
            Manage jobs, technician assignments, calendar scheduling, routes,
            and emergency priority work.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
            Review unassigned jobs, technician availability, route optimization
            context, and same-day scheduling conflicts.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Navigation className="mr-2 h-4 w-4" />
            Optimize Route
          </Button>
        </div>
      </div>

      <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DispatchSignalCard label="Active Jobs" value={activeJobsCount} detail="Pending, assigned, in progress" icon={CalendarClock} tone="blue" />
        <DispatchSignalCard label="Unassigned" value={unassignedJobsCount} detail="Need dispatch ownership" icon={AlertTriangle} tone="amber" />
        <DispatchSignalCard label="Emergency" value={emergencyJobsCount} detail="Escalation priority" icon={Zap} tone="red" />
        <DispatchSignalCard label="Technician Workload" value={`${avgUtilization}%`} detail="Workload and capacity" icon={Wrench} tone="green" />
      </div>
    </section>
  );
}
