"use client";

import {
  DashboardCharts,
} from "@/components/admin/dashboard/dashboard-charts";
import { DashboardHero } from "@/components/admin/dashboard/dashboard-hero";
import { DashboardOperations } from "@/components/admin/dashboard/dashboard-operations";
import { DashboardTechnicianLoadout } from "@/components/admin/dashboard/dashboard-technician-loadout";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();

const statusColors = {
  pending: "#f59e0b",
  assigned: "#2563eb",
  in_progress: "#06b6d4",
  completed: "#10b981",
  on_hold: "#64748b",
};

export default function AdminDashboardPage() {
  const activeCustomers = data.customers.filter((customer) =>
    ["active", "vip"].includes(customer.status),
  ).length;
  const openTickets = data.tickets.filter((ticket) =>
    ["open", "in_progress"].includes(ticket.status),
  ).length;
  const scheduledToday = data.jobs.filter((job) =>
    ["pending", "assigned", "in_progress"].includes(job.status),
  ).length;
  const acceptedQuotes = data.quotes.filter(
    (quote) => quote.status === "accepted",
  );
  const acceptedQuoteValue = acceptedQuotes.reduce(
    (total, quote) => total + quote.total,
    0,
  );
  const availableTechnicians = data.employees.filter(
    (employee) =>
      employee.role === "technician" && employee.status === "active",
  ).length;
  const emergencyJob = data.jobs.find((job) => job.priority === "emergency");
  const totalRevenue = data.revenueTrend.reduce(
    (total, day) => total + day.revenue,
    0,
  );
  const technicians = data.employees.filter(
    (employee) => employee.role === "technician",
  );

  const jobStatusData = [
    {
      name: "Pending",
      value: data.jobs.filter((job) => job.status === "pending").length,
      color: statusColors.pending,
    },
    {
      name: "Assigned",
      value: data.jobs.filter((job) => job.status === "assigned").length,
      color: statusColors.assigned,
    },
    {
      name: "In Progress",
      value: data.jobs.filter((job) => job.status === "in_progress").length,
      color: statusColors.in_progress,
    },
    {
      name: "Completed",
      value: data.jobs.filter((job) => job.status === "completed").length,
      color: statusColors.completed,
    },
    {
      name: "On Hold",
      value: data.jobs.filter((job) => job.status === "on_hold").length,
      color: statusColors.on_hold,
    },
  ];

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <DashboardHero
        data={data}
        activeCustomers={activeCustomers}
        scheduledToday={scheduledToday}
        acceptedQuoteValue={acceptedQuoteValue}
        openTickets={openTickets}
        availableTechnicians={availableTechnicians}
        totalRevenue={totalRevenue}
        emergencyJob={emergencyJob}
      />
      <DashboardCharts data={data} jobStatusData={jobStatusData} />
      <DashboardOperations
        jobs={data.jobs}
        emergencyJob={emergencyJob}
        acceptedQuotesCount={acceptedQuotes.length}
        openTickets={openTickets}
      />
      <DashboardTechnicianLoadout technicians={technicians} />
    </div>
  );
}
