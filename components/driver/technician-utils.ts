import { generateAdminDashboardData } from "@/lib/mock-data";
import type { AdminJob, AdminJobStatus } from "@/types";

export const technicianId = "emp_2";

export type TechnicianWorkStatus =
  | "clocked_in"
  | "en_route"
  | "on_site"
  | "on_break";

export const technicianStatusLabels: Record<TechnicianWorkStatus, string> = {
  clocked_in: "Clocked in",
  en_route: "En route",
  on_site: "On site",
  on_break: "On break",
};

export const technicianProfile = {
  employeeId: "TECH-2048",
  title: "Senior HVAC Technician",
  homeBase: "Manhattan Service Hub",
  shift: "8:00 AM - 5:00 PM",
  vehicle: "Ford Transit T-118",
  licensePlate: "NYC-4482",
  phone: "+1 (212) 555-0188",
  email: "ethan.brooks@asuitecare.com",
  emergencyContact: "Maya Brooks / +1 (212) 555-0109",
  location: "5th Ave & W 42nd St",
  gpsUpdatedAt: "2 min ago",
};

export const technicianChecklist = [
  { label: "Clocked in with GPS", done: true },
  { label: "Route reviewed", done: true },
  { label: "Customer contact visible", done: true },
  { label: "Photo requirements reviewed", done: false },
  { label: "Signature workflow ready", done: false },
];

export const technicianRouteStops = [
  { label: "Start", address: "Manhattan Service Hub", eta: "8:00 AM", status: "completed" },
  { label: "Stop 1", address: "456 Park Ave, New York, NY", eta: "9:10 AM", status: "current" },
  { label: "Stop 2", address: "123 Main St, New York, NY", eta: "11:30 AM", status: "upcoming" },
  { label: "Stop 3", address: "100 Central Park W, New York, NY", eta: "2:15 PM", status: "upcoming" },
];

export const technicianDocuments = [
  { name: "EPA 608 Universal", status: "Verified", expires: "Aug 15, 2026" },
  { name: "Electrical Safety", status: "Verified", expires: "Nov 30, 2025" },
  { name: "Customer Access Training", status: "Verified", expires: "Mar 15, 2027" },
  { name: "Vehicle Insurance Acknowledgement", status: "Signed", expires: "Jan 1, 2027" },
];

export const technicianLeaveBalances = [
  { label: "Vacation", value: "9 days" },
  { label: "Sick", value: "4 days" },
  { label: "Personal", value: "2 days" },
];

export const technicianTimeLog = [
  { label: "Clock in", time: "7:54 AM", detail: "GPS verified at Manhattan Service Hub" },
  { label: "Travel start", time: "8:38 AM", detail: "Route opened for JOB-1104" },
  { label: "On site", time: "9:08 AM", detail: "Geo-fence arrival captured" },
  { label: "Job update", time: "9:42 AM", detail: "Diagnostic photos uploaded" },
];

export const technicianWeeklyPerformance = [
  { day: "Mon", jobs: 2, onTime: 96, rating: 4.8 },
  { day: "Tue", jobs: 3, onTime: 91, rating: 4.7 },
  { day: "Wed", jobs: 2, onTime: 94, rating: 4.9 },
  { day: "Thu", jobs: 4, onTime: 88, rating: 4.6 },
  { day: "Fri", jobs: 3, onTime: 97, rating: 4.9 },
];

export const technicianPhotos = [
  "Equipment nameplate",
  "Before work area",
  "Completed repair",
  "Customer signature",
];

export function getTechnicianData() {
  const data = generateAdminDashboardData();
  const technician = data.employees.find((employee) => employee.id === technicianId);
  const jobs = data.jobs.filter((job) => job.technicianId === technicianId);
  return { data, technician, jobs };
}

export function formatTechnicianDateTime(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getActiveTechnicianJobs(jobs: AdminJob[]) {
  return jobs.filter((job) =>
    ["assigned", "in_progress", "on_hold", "pending"].includes(job.status),
  );
}

export function getTodayTechnicianJobs(jobs: AdminJob[]) {
  return [...jobs]
    .filter((job) => job.status !== "completed" && job.status !== "cancelled")
    .sort((left, right) => left.scheduledStart.getTime() - right.scheduledStart.getTime());
}

export function getTechnicianJobProgress(status: AdminJobStatus) {
  const progress: Record<AdminJobStatus, number> = {
    pending: 10,
    assigned: 25,
    in_progress: 62,
    on_hold: 45,
    completed: 100,
    cancelled: 0,
  };

  return progress[status] ?? 0;
}

export function formatTechnicianDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatTechnicianTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}
