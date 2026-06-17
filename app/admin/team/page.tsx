"use client";

import { useMemo, useState } from "react";
import { UserPlus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TeamDirectory } from "@/components/admin/team/team-directory";
import { TeamFilters } from "@/components/admin/team/team-filters";
import { TeamStats } from "@/components/admin/team/team-stats";
import { Button } from "@/components/ui/button";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();

export default function AdminTeamPage() {
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const employees = data.employees;

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesRole = role === "all" || employee.role === role;
      const matchesStatus = status === "all" || employee.status === status;
      return matchesRole && matchesStatus;
    });
  }, [employees, role, status]);

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Team"
        description="Manage company users, role-based permissions, technician skills, workload, capacity, and performance signals."
        actions={
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        }
      />

      <TeamStats employees={employees} visibleCount={filteredEmployees.length} />
      <TeamFilters
        role={role}
        setRole={setRole}
        status={status}
        setStatus={setStatus}
      />
      <TeamDirectory employees={filteredEmployees} />
    </div>
  );
}
