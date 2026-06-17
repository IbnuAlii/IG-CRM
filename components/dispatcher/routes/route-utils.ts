import type { AdminEmployee, AdminJob } from "@/types";

export interface RouteStop {
  job: AdminJob;
  sequence: number;
  distanceMiles: number;
  driveMinutes: number;
  arrivalWindow: string;
}

export function getRouteJobs({
  jobs,
  technicianId,
}: {
  jobs: AdminJob[];
  technicianId: string;
}) {
  if (technicianId === "all") {
    return jobs.filter((job) => job.technicianId);
  }
  if (technicianId === "unassigned") {
    return jobs.filter((job) => !job.technicianId);
  }
  return jobs.filter((job) => job.technicianId === technicianId);
}

export function buildRouteStops(jobs: AdminJob[]): RouteStop[] {
  return [...jobs]
    .sort((left, right) => {
      if (left.priority === "emergency" && right.priority !== "emergency") {
        return -1;
      }
      if (left.priority !== "emergency" && right.priority === "emergency") {
        return 1;
      }
      return left.scheduledStart.getTime() - right.scheduledStart.getTime();
    })
    .map((job, index) => ({
      job,
      sequence: index + 1,
      distanceMiles: 2.4 + ((index * 1.7 + job.estimatedDurationMinutes / 90) % 7),
      driveMinutes: 12 + ((index * 9 + job.estimatedDurationMinutes / 12) % 34),
      arrivalWindow: job.scheduledStart.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    }));
}

export function getRouteMetrics(stops: RouteStop[]) {
  const distance = stops.reduce((total, stop) => total + stop.distanceMiles, 0);
  const driveMinutes = stops.reduce((total, stop) => total + stop.driveMinutes, 0);
  const serviceMinutes = stops.reduce(
    (total, stop) => total + stop.job.estimatedDurationMinutes,
    0,
  );
  const emergencyStops = stops.filter(
    (stop) => stop.job.priority === "emergency",
  ).length;

  return {
    distance,
    driveMinutes,
    serviceMinutes,
    emergencyStops,
    savedMinutes: Math.max(0, Math.round(stops.length * 11 + emergencyStops * 8)),
  };
}

export function getRouteReadiness({
  technician,
  stops,
}: {
  technician?: AdminEmployee;
  stops: RouteStop[];
}) {
  const warnings: string[] = [];

  if (!technician) {
    warnings.push("Select a technician to review capacity and location.");
  } else if (technician.status === "on_leave") {
    warnings.push(`${technician.name} is marked on leave.`);
  }

  if (stops.some((stop) => !stop.job.technicianId)) {
    warnings.push("Some stops are unassigned and need an owner before dispatch.");
  }

  if (stops.length === 0) {
    warnings.push("No stops match the current route filters.");
  }

  return warnings;
}
