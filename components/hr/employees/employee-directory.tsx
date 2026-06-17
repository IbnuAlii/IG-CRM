"use client";

import { FileText, ShieldCheck } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { teamRoleLabels } from "@/components/admin/team/team-role-labels";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { HREmployeeRecord } from "@/components/hr/hr-data";

function formatPay(employee: HREmployeeRecord) {
  if (employee.salaryType === "hourly") {
    return `$${employee.payRate}/hr`;
  }

  return `$${employee.payRate.toLocaleString()}/yr`;
}

export function EmployeeDirectory({
  employees,
  onSelectEmployee,
}: {
  employees: HREmployeeRecord[];
  onSelectEmployee: (employee: HREmployeeRecord) => void;
}) {
  const columns: DataTableColumn<HREmployeeRecord>[] = [
    {
      id: "employee",
      header: "Employee",
      accessorFn: (employee) =>
        `${employee.name} ${employee.email} ${employee.employeeNumber}`,
      cell: (employee) => (
        <div>
          <p className="font-medium">{employee.name}</p>
          <p className="text-xs text-muted-foreground">
            {employee.employeeNumber} - {employee.email}
          </p>
        </div>
      ),
      exportValue: (employee) =>
        `${employee.employeeNumber} ${employee.name} (${employee.email})`,
    },
    {
      id: "department",
      header: "Department",
      accessorFn: (employee) => employee.department,
      cell: (employee) => (
        <div>
          <p>{employee.department}</p>
          <p className="text-xs text-muted-foreground">{employee.workLocation}</p>
        </div>
      ),
    },
    {
      id: "role",
      header: "Role",
      accessorFn: (employee) => teamRoleLabels[employee.role],
      cell: (employee) => teamRoleLabels[employee.role],
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (employee) => employee.status,
      cell: (employee) => <AdminStatusBadge status={employee.status} />,
      align: "center",
    },
    {
      id: "documents",
      header: "Documents",
      accessorFn: (employee) =>
        employee.documents.map((document) => document.status).join(" "),
      cell: (employee) => {
        const alertCount = employee.documents.filter(
          (document) => document.status !== "complete",
        ).length;

        return (
          <Badge variant={alertCount > 0 ? "destructive" : "secondary"} className="gap-1">
            <FileText className="h-3.5 w-3.5" />
            {alertCount > 0 ? `${alertCount} alert` : "Complete"}
          </Badge>
        );
      },
      align: "center",
    },
    {
      id: "permissions",
      header: "Permissions",
      accessorFn: (employee) => employee.permissionSet,
      cell: (employee) => (
        <Badge variant="outline" className="gap-1 bg-background">
          <ShieldCheck className="h-3.5 w-3.5" />
          {employee.permissionSet}
        </Badge>
      ),
      align: "center",
    },
    {
      id: "leave",
      header: "Leave",
      accessorFn: (employee) => employee.leaveBalanceHours,
      cell: (employee) => `${employee.leaveBalanceHours}h`,
      align: "center",
    },
    {
      id: "pay",
      header: "Pay",
      accessorFn: (employee) => employee.payRate,
      cell: (employee) => formatPay(employee),
      align: "center",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: (employee) => (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onSelectEmployee(employee)}>
            Profile
          </Button>
        </div>
      ),
      align: "center",
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Employee Directory</h2>
        <p className="text-sm text-muted-foreground">
          Search profiles, roles, permissions, documents, leave balances, and payroll setup.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={employees}
        getRowKey={(employee) => employee.id}
        emptyMessage="No employees match these filters."
        features={{
          sorting: true,
          globalFilter: true,
          pagination: true,
          columnVisibility: true,
          export: true,
          rowSelection: true,
        }}
        searchPlaceholder="Search employees..."
        exportFileName="hr-employees.csv"
      />
    </Card>
  );
}
