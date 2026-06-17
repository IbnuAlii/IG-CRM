"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock3, Route } from "lucide-react";
import {
  LeafletRouteMap,
  type LeafletMapPoint,
} from "@/components/map/leaflet-route-map";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { AdminEmployee, AdminJob } from "@/types";

const technicianCoordinates = [
  [40.758, -73.9855],
  [40.7549, -73.984],
  [40.7616, -73.9776],
  [40.7484, -73.9857],
  [40.7411, -73.9897],
];

const jobCoordinates = [
  [40.7505, -73.9934],
  [40.7421, -73.9826],
  [40.7308, -73.9973],
  [40.7218, -73.9872],
  [40.7163, -74.0086],
  [40.7336, -74.0027],
  [40.7465, -74.0014],
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function DispatchMapAndRoutes({
  technicians,
  jobs,
  teamPath = "/admin/team",
}: {
  technicians: AdminEmployee[];
  jobs: AdminJob[];
  teamPath?: string;
}) {
  const mapPoints = useMemo<LeafletMapPoint[]>(() => {
    const technicianPoints = technicians.slice(0, 5).map((technician, index) => {
      const [lat, lng] =
        technicianCoordinates[index % technicianCoordinates.length];

      return {
        id: `technician-${technician.id}`,
        label: getInitials(technician.name) || "T",
        detail: `${technician.name} - ${technician.currentLocation}`,
        lat,
        lng,
        kind: "origin" as const,
      };
    });

    const jobPoints = jobs.slice(0, 7).map((job, index) => {
      const [lat, lng] = jobCoordinates[index % jobCoordinates.length];

      return {
        id: `job-${job.id}`,
        label: String(index + 1),
        detail: `${job.jobNumber} - ${job.customerName}`,
        lat,
        lng,
        kind: job.priority === "emergency" ? "emergency" as const : "stop" as const,
      };
    });

    return [...technicianPoints, ...jobPoints];
  }, [jobs, technicians]);

  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Route Map</h2>
            <p className="text-sm text-muted-foreground">
              Technician locations and assigned service stops.
            </p>
          </div>
          <Route className="h-5 w-5 text-primary" />
        </div>
        <LeafletRouteMap className="h-[320px]" points={mapPoints} />
      </Card>

      <Card className="border-border/70 bg-card p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Route Optimization</h2>
          <p className="text-sm text-muted-foreground">
            Assigned routes ordered by workload.
          </p>
        </div>
        <div className="space-y-3">
          {technicians.slice(0, 4).map((technician) => {
            const assignedJobs = jobs.filter(
              (job) => job.technicianId === technician.id,
            );

            return (
              <Link
                key={technician.id}
                href={teamPath}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background p-3 text-sm transition hover:bg-accent/45"
              >
                <div className="min-w-0">
                  <p className="font-semibold">{technician.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {technician.currentLocation}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {assignedJobs.length} stops
                  </Badge>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
