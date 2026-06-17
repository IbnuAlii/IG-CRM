"use client";

import { ShieldCheck, Users, Wrench } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { AdminEmployee } from "@/types";

export function TeamStats({
  employees,
  visibleCount,
}: {
  employees: AdminEmployee[];
  visibleCount: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Users"
        value={employees.length}
        description="Across company roles"
        trend={`${visibleCount} visible`}
        icon={Users}
        tone="blue"
      />
      <AdminStatCard
        label="Technicians"
        value={
          employees.filter((employee) => employee.role === "technician").length
        }
        description="Field service capacity"
        trend="Skills drive assignment"
        icon={Wrench}
        tone="green"
      />
      <AdminStatCard
        label="Active"
        value={employees.filter((employee) => employee.status === "active").length}
        description="Able to receive work"
        trend="No locked accounts"
        icon={ShieldCheck}
        tone="blue"
      />
      <AdminStatCard
        label="Average Rating"
        value={(
          employees.reduce((total, employee) => total + employee.rating, 0) /
          employees.length
        ).toFixed(1)}
        description="Technician and staff quality"
        trend="From completed jobs"
        icon={ShieldCheck}
        tone="neutral"
      />
    </div>
  );
}
