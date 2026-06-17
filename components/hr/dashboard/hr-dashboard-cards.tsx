"use client";

import { AlertTriangle, CalendarCheck, ReceiptText, UsersRound } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { HREmployeeRecord } from "@/components/hr/hr-data";

export function HRDashboardCards({
  employees,
}: {
  employees: HREmployeeRecord[];
}) {
  const onLeave = employees.filter((employee) => employee.status === "on_leave").length;
  const overtime = employees.reduce((total, employee) => total + employee.overtimeHours, 0);
  const payrollReady = employees.filter(
    (employee) => employee.documents.every((document) => document.status !== "missing"),
  ).length;
  const documentAlerts = employees.reduce(
    (total, employee) =>
      total + employee.documents.filter((document) => document.status === "expiring").length,
    0,
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Employees"
        value={employees.length}
        description="HR profiles tracked"
        trend="Employee CRUD slice started"
        icon={UsersRound}
        tone="blue"
      />
      <AdminStatCard
        label="On Leave"
        value={onLeave}
        description="Current employee status"
        trend="Leave workflow in next slice"
        icon={CalendarCheck}
        tone="amber"
      />
      <AdminStatCard
        label="Overtime"
        value={`${overtime.toFixed(1)}h`}
        description="This week from attendance"
        trend="Attendance reports pending"
        icon={AlertTriangle}
        tone={overtime > 0 ? "amber" : "green"}
      />
      <AdminStatCard
        label="Payroll Ready"
        value={payrollReady}
        description="Profiles with required documents"
        trend={`${documentAlerts} document alerts`}
        icon={ReceiptText}
        tone="green"
      />
    </div>
  );
}
