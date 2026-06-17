"use client";

import { useMemo, useState } from "react";
import { Download, UserPlus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AddEmployeeDialog } from "@/components/hr/employees/add-employee-dialog";
import { EmployeeDirectory } from "@/components/hr/employees/employee-directory";
import { EmployeeFilters } from "@/components/hr/employees/employee-filters";
import { EmployeeProfileDialog } from "@/components/hr/employees/employee-profile-dialog";
import { EmployeeProfilePanel } from "@/components/hr/employees/employee-profile-panel";
import { EmployeeSummaryCards } from "@/components/hr/employees/employee-summary-cards";
import { HRActionButton } from "@/components/hr/action-button";
import {
  buildHREmployeeRecords,
  type HREmployeeRecord,
} from "@/components/hr/hr-data";
import { Button } from "@/components/ui/button";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();
const employees = buildHREmployeeRecords(data.employees);

export default function HREmployeesPage() {
  const [department, setDepartment] = useState("all");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<HREmployeeRecord | undefined>(
    employees[0],
  );

  const departments = useMemo(
    () => Array.from(new Set(employees.map((employee) => employee.department))).sort(),
    [],
  );

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesDepartment =
        department === "all" || employee.department === department;
      const matchesRole = role === "all" || employee.role === role;
      const matchesStatus = status === "all" || employee.status === status;
      return matchesDepartment && matchesRole && matchesStatus;
    });
  }, [department, role, status]);

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Employees"
        description="Create and manage employee profiles, roles, permissions, documents, emergency contacts, employment history, and payroll setup."
        actions={
          <>
            <HRActionButton
              variant="outline"
              feedbackTitle="Employee export prepared"
              feedbackDescription="The employee CSV export uses the table export controls in this mock frontend."
            >
              <Download className="mr-2 h-4 w-4" />
              Export Employees
            </HRActionButton>
            <Button onClick={() => setCreateOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              New Employee
            </Button>
          </>
        }
      />

      <EmployeeSummaryCards
        employees={employees}
        visibleCount={filteredEmployees.length}
      />
      <EmployeeFilters
        departments={departments}
        department={department}
        setDepartment={setDepartment}
        role={role}
        setRole={setRole}
        status={status}
        setStatus={setStatus}
      />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
        <EmployeeDirectory
          employees={filteredEmployees}
          onSelectEmployee={(employee) => {
            setSelectedEmployee(employee);
            setProfileOpen(true);
          }}
        />
        <EmployeeProfilePanel employee={selectedEmployee} />
      </div>

      <AddEmployeeDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EmployeeProfileDialog
        employee={selectedEmployee}
        open={profileOpen}
        onOpenChange={setProfileOpen}
      />
    </div>
  );
}
