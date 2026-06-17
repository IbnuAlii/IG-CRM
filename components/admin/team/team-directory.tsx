"use client";

import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AdminEmployee } from "@/types";
import { teamRoleLabels } from "./team-role-labels";

export function TeamDirectory({ employees }: { employees: AdminEmployee[] }) {
  const columns: DataTableColumn<AdminEmployee>[] = [
    {
      id: "employee",
      header: "Employee",
      accessorFn: (employee) => `${employee.name} ${employee.email}`,
      cell: (employee) => (
        <div>
          <p className="font-medium">{employee.name}</p>
          <p className="text-xs text-muted-foreground">{employee.email}</p>
        </div>
      ),
      exportValue: (employee) => `${employee.name} (${employee.email})`,
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
      id: "skills",
      header: "Skills",
      accessorFn: (employee) => employee.skills.join(" "),
      cell: (employee) => (
        <div className="flex flex-wrap justify-center gap-1">
          {employee.skills.slice(0, 2).map((skill) => (
            <Badge key={skill} variant="secondary" className="font-normal">
              {skill}
            </Badge>
          ))}
        </div>
      ),
      align: "center",
    },
    {
      id: "utilization",
      header: "Utilization",
      accessorFn: (employee) => employee.scheduledHours / employee.capacityHours,
      cell: (employee) => {
        const utilization = Math.round(
          (employee.scheduledHours / employee.capacityHours) * 100,
        );

        return (
          <div className="min-w-36">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span>{utilization}%</span>
              <span className="text-muted-foreground">
                {employee.scheduledHours}/{employee.capacityHours}h
              </span>
            </div>
            <Progress value={utilization} />
          </div>
        );
      },
      align: "center",
    },
    {
      id: "performance",
      header: "Performance",
      accessorFn: (employee) => employee.jobsCompleted,
      cell: (employee) => (
        <div className="text-center">
          <p>{employee.jobsCompleted} jobs</p>
          <p className="text-xs text-muted-foreground">
            {employee.rating.toFixed(1)} rating
          </p>
        </div>
      ),
      align: "center",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: () => (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm">
            Profile
          </Button>
          <Button variant="outline" size="sm">
            Permissions
          </Button>
        </div>
      ),
      align: "center",
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">User Directory</h2>
        <p className="text-sm text-muted-foreground">
          Search users by name, role, email, phone, skill, status, and capacity.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={employees}
        getRowKey={(employee) => employee.id}
        emptyMessage="No team members match these filters."
        features={{
          sorting: true,
          globalFilter: true,
          pagination: true,
          columnVisibility: true,
          export: true,
          rowSelection: true,
        }}
        searchPlaceholder="Search team..."
        exportFileName="admin-team.csv"
      />
    </Card>
  );
}
