import type { AdminEmployee, AdminJob } from "@/types";

export function getTechnicianUtilization(technician: AdminEmployee) {
  return Math.round(
    (technician.scheduledHours / Math.max(technician.capacityHours, 1)) * 100,
  );
}

export function getTechnicianJobs(technician: AdminEmployee, jobs: AdminJob[]) {
  return jobs.filter((job) => job.technicianId === technician.id);
}

export function getTechnicianAvailabilityLabel(technician: AdminEmployee) {
  if (technician.status === "on_leave") {
    return "On leave";
  }

  const utilization = getTechnicianUtilization(technician);
  if (utilization >= 90) {
    return "Near capacity";
  }
  if (utilization >= 75) {
    return "Limited capacity";
  }
  return "Available";
}

export function getTechnicianAvailabilityTone(technician: AdminEmployee) {
  if (technician.status === "on_leave") {
    return "red";
  }

  const utilization = getTechnicianUtilization(technician);
  if (utilization >= 90) {
    return "red";
  }
  if (utilization >= 75) {
    return "amber";
  }
  return "green";
}
