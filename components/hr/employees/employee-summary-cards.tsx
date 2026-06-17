"use client";

import { AlertTriangle, BadgeCheck, BriefcaseBusiness, UsersRound } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { HREmployeeRecord } from "@/components/hr/hr-data";

export function EmployeeSummaryCards({
  employees,
  visibleCount,
}: {
  employees: HREmployeeRecord[];
  visibleCount: number;
}) {
  const activeCount = employees.filter((employee) => employee.status === "active").length;
  const expiringDocuments = employees.reduce(
    (total, employee) =>
      total + employee.documents.filter((document) => document.status === "expiring").length,
    0,
  );
  const departments = new Set(employees.map((employee) => employee.department)).size;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Employees"
        value={employees.length}
        description="Profiles in HR records"
        trend={`${visibleCount} visible after filters`}
        icon={UsersRound}
        tone="blue"
      />
      <AdminStatCard
        label="Active"
        value={activeCount}
        description="Available for scheduling or admin work"
        trend={`${employees.length - activeCount} not currently active`}
        icon={BadgeCheck}
        tone="green"
      />
      <AdminStatCard
        label="Departments"
        value={departments}
        description="Role-driven organization groups"
        trend="Manager relationships tracked"
        icon={BriefcaseBusiness}
        tone="neutral"
      />
      <AdminStatCard
        label="Document Alerts"
        value={expiringDocuments}
        description="Expiring or action-needed files"
        trend="Shown in employee profiles"
        icon={AlertTriangle}
        tone={expiringDocuments > 0 ? "amber" : "green"}
      />
    </div>
  );
}
