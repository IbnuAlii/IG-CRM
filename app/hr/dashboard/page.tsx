"use client";

import Link from "next/link";
import { UserPlus, UsersRound } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { HRActionQueue } from "@/components/hr/dashboard/hr-action-queue";
import { HRDashboardCards } from "@/components/hr/dashboard/hr-dashboard-cards";
import { HRWorkforceOverview } from "@/components/hr/dashboard/hr-workforce-overview";
import { buildHREmployeeRecords } from "@/components/hr/hr-data";
import { Button } from "@/components/ui/button";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();
const employees = buildHREmployeeRecords(data.employees);

export default function HRDashboardPage() {
  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="HR Dashboard"
        description="Monitor employee profiles, document readiness, attendance signals, leave status, and payroll preparation from one people-operations workspace."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/hr/employees">
                <UsersRound className="mr-2 h-4 w-4" />
                Employees
              </Link>
            </Button>
            <Button asChild>
              <Link href="/hr/employees">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Employee
              </Link>
            </Button>
          </>
        }
      />

      <HRDashboardCards employees={employees} />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.25fr_0.75fr]">
        <HRWorkforceOverview employees={employees} />
        <HRActionQueue employees={employees} />
      </div>
    </div>
  );
}
