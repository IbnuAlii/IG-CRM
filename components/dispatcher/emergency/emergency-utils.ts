import type { AdminEmployee, AdminJob } from "@/types";

export function getEmergencyJobs(jobs: AdminJob[]) {
  return jobs.filter(
    (job) =>
      job.priority === "emergency" ||
      (job.priority === "high" && job.status !== "completed"),
  );
}

export function getEscalationLevel(job: AdminJob) {
  if (job.priority === "emergency" && !job.technicianId) {
    return "Critical";
  }
  if (job.priority === "emergency") {
    return "Emergency";
  }
  if (job.status === "in_progress") {
    return "Active";
  }
  return "Watchlist";
}

export function getEscalationTone(job: AdminJob) {
  const level = getEscalationLevel(job);
  if (level === "Critical") return "red";
  if (level === "Emergency") return "red";
  if (level === "Active") return "blue";
  return "amber";
}

export function getResponseEtaMinutes(job: AdminJob) {
  if (!job.technicianId) {
    return 18;
  }
  if (job.priority === "emergency") {
    return 12;
  }
  return 28;
}

export function getAvailableTechnicians(technicians: AdminEmployee[]) {
  return technicians
    .filter((technician) => technician.role === "technician")
    .sort((left, right) => {
      if (left.status !== right.status) {
        return left.status === "active" ? -1 : 1;
      }
      return (
        left.scheduledHours / left.capacityHours -
        right.scheduledHours / right.capacityHours
      );
    });
}

export function getTechnicianFitScore(technician: AdminEmployee, job: AdminJob) {
  const utilization = technician.scheduledHours / technician.capacityHours;
  const skillMatch = technician.skills.some((skill) =>
    job.serviceType.toLowerCase().includes(skill.toLowerCase().split(" ")[0]),
  );
  const base = technician.status === "active" ? 78 : 42;
  const utilizationAdjustment = Math.round((1 - utilization) * 18);
  const skillAdjustment = skillMatch ? 10 : 0;
  return Math.min(99, base + utilizationAdjustment + skillAdjustment);
}
