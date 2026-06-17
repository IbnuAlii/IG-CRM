import type { AdminEmployee, AdminJob } from "@/types";

export type ScheduleView = "day" | "week" | "month" | "agenda";

export const scheduleTimeSlots = [
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

export function formatScheduleTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatScheduleDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatScheduleDay(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
  });
}

export function isSameScheduleDate(left: Date, right: Date) {
  return left.toDateString() === right.toDateString();
}

export function getJobEnd(job: AdminJob) {
  return new Date(
    job.scheduledStart.getTime() + job.estimatedDurationMinutes * 60_000,
  );
}

export function jobsOverlap(first: AdminJob, second: AdminJob) {
  return first.scheduledStart < getJobEnd(second) && second.scheduledStart < getJobEnd(first);
}

export function getScheduleDays(jobs: AdminJob[]) {
  const firstJobDate = jobs
    .map((job) => job.scheduledStart)
    .sort((left, right) => left.getTime() - right.getTime())[0];
  const startDate = firstJobDate ?? new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });
}

export function getScheduleRisks({
  jobs,
  technicians,
}: {
  jobs: AdminJob[];
  technicians: AdminEmployee[];
}) {
  const risks: Array<{
    id: string;
    title: string;
    detail: string;
    tone: "amber" | "red" | "blue";
  }> = [];

  technicians.forEach((technician) => {
    const technicianJobs = jobs.filter(
      (job) => job.technicianId === technician.id,
    );

    technicianJobs.forEach((job, index) => {
      technicianJobs.slice(index + 1).forEach((nextJob) => {
        if (jobsOverlap(job, nextJob)) {
          risks.push({
            id: `${job.id}-${nextJob.id}`,
            title: "Scheduling conflict",
            detail: `${technician.name} has overlapping work: ${job.jobNumber} and ${nextJob.jobNumber}.`,
            tone: "red",
          });
        }
      });
    });

    if (technician.status === "on_leave" && technicianJobs.length > 0) {
      risks.push({
        id: `${technician.id}-leave`,
        title: "Assigned while on leave",
        detail: `${technician.name} has ${technicianJobs.length} scheduled job(s) while marked on leave.`,
        tone: "red",
      });
    }

    const utilization = Math.round(
      (technician.scheduledHours / technician.capacityHours) * 100,
    );
    if (utilization >= 85) {
      risks.push({
        id: `${technician.id}-capacity`,
        title: "Capacity warning",
        detail: `${technician.name} is at ${utilization}% scheduled capacity.`,
        tone: "amber",
      });
    }
  });

  jobs
    .filter((job) => job.priority === "emergency" && !job.technicianId)
    .forEach((job) => {
      risks.push({
        id: `${job.id}-unassigned-emergency`,
        title: "Emergency unassigned",
        detail: `${job.jobNumber} is emergency priority and needs an owner.`,
        tone: "red",
      });
    });

  if (risks.length === 0) {
    risks.push({
      id: "clear",
      title: "No blocking conflicts",
      detail: "The current filtered schedule has no overlapping assignments.",
      tone: "blue",
    });
  }

  return risks;
}
