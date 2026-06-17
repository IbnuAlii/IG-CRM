import { generateAdminDashboardData } from "@/lib/mock-data";
import type { AdminEmployee, AdminJob, AdminQuote } from "@/types";

export interface ManagerTeamMember extends AdminEmployee {
  utilization: number;
  performanceScore: number;
  openActions: number;
}

export interface ManagerApproval {
  id: string;
  type: "leave" | "quote" | "schedule" | "expense";
  title: string;
  requester: string;
  submittedAt: string;
  impact: string;
  status: "pending" | "approved" | "rejected";
}

export interface ManagerReport {
  id: string;
  name: string;
  category: "team" | "operations" | "financial" | "customer";
  period: string;
  status: "ready" | "pending";
  owner: string;
}

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(value);

function buildTeamMembers(employees: AdminEmployee[]): ManagerTeamMember[] {
  return employees
    .filter((employee) => ["manager", "dispatcher", "technician"].includes(employee.role))
    .slice(0, 8)
    .map((employee, index) => {
      const utilization = Math.round((employee.scheduledHours / Math.max(employee.capacityHours, 1)) * 100);

      return {
        ...employee,
        utilization,
        performanceScore: Math.min(99, Math.round(employee.rating * 18 + employee.jobsCompleted * 0.7 + index)),
        openActions: index % 3,
      };
    });
}

function buildApprovals(quotes: AdminQuote[], jobs: AdminJob[]): ManagerApproval[] {
  return [
    {
      id: "APR-1001",
      type: "leave",
      title: "PTO request / Nora Kim",
      requester: "Nora Kim",
      submittedAt: "May 22, 2026",
      impact: "Coverage required for 2 afternoon jobs",
      status: "pending",
    },
    {
      id: "APR-1002",
      type: "quote",
      title: `${quotes[0]?.quoteNumber ?? "Q-2048"} discount approval`,
      requester: quotes[0]?.assignedTo ?? "Caleb Reed",
      submittedAt: "May 21, 2026",
      impact: "Margin remains above department threshold",
      status: "pending",
    },
    {
      id: "APR-1003",
      type: "schedule",
      title: `${jobs[0]?.jobNumber ?? "JOB-1104"} priority change`,
      requester: jobs[0]?.technicianName ?? "Dispatch team",
      submittedAt: "May 21, 2026",
      impact: "Moves emergency work before routine service",
      status: "approved",
    },
    {
      id: "APR-1004",
      type: "expense",
      title: "Parts purchase exception",
      requester: "Ethan Brooks",
      submittedAt: "May 20, 2026",
      impact: "Emergency part pickup for active customer",
      status: "pending",
    },
  ];
}

function buildReports(): ManagerReport[] {
  return [
    { id: "MGR-RPT-1", name: "Team Performance Report", category: "team", period: "May 2026", status: "ready", owner: "Operations" },
    { id: "MGR-RPT-2", name: "Jobs by Employee", category: "operations", period: "Last 30 days", status: "ready", owner: "Operations" },
    { id: "MGR-RPT-3", name: "Limited Revenue Summary", category: "financial", period: "May 2026", status: "ready", owner: "Finance" },
    { id: "MGR-RPT-4", name: "Customer SLA Exceptions", category: "customer", period: "This week", status: "pending", owner: "Support" },
  ];
}

export function getManagerData() {
  const adminData = generateAdminDashboardData();
  const teamMembers = buildTeamMembers(adminData.employees);
  const approvals = buildApprovals(adminData.quotes, adminData.jobs);
  const reports = buildReports();
  const activeJobs = adminData.jobs.filter((job) => ["pending", "assigned", "in_progress", "on_hold"].includes(job.status));
  const completedJobs = adminData.jobs.filter((job) => job.status === "completed");
  const revenue = adminData.quotes.filter((quote) => quote.status === "accepted" || quote.status === "converted").reduce((sum, quote) => sum + quote.total, 0);
  const openPipeline = adminData.quotes.filter((quote) => ["sent", "viewed"].includes(quote.status)).reduce((sum, quote) => sum + quote.total, 0);

  return {
    adminData,
    teamMembers,
    approvals,
    reports,
    activeJobs,
    completedJobs,
    revenue,
    openPipeline,
  };
}

export function formatManagerCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export { formatDate };
