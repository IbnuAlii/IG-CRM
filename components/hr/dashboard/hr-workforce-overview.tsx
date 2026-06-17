"use client";

import { teamRoleLabels } from "@/components/admin/team/team-role-labels";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { HREmployeeRecord } from "@/components/hr/hr-data";

export function HRWorkforceOverview({
  employees,
}: {
  employees: HREmployeeRecord[];
}) {
  const departments = Array.from(new Set(employees.map((employee) => employee.department)));

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Workforce Overview</h2>
        <p className="text-sm text-muted-foreground">
          Department mix, role coverage, and weekly attendance load.
        </p>
      </div>
      <div className="space-y-4">
        {departments.map((department) => {
          const departmentEmployees = employees.filter(
            (employee) => employee.department === department,
          );
          const averageAttendance = Math.round(
            departmentEmployees.reduce(
              (total, employee) => total + employee.attendanceThisWeekHours,
              0,
            ) / Math.max(departmentEmployees.length, 1),
          );

          return (
            <div
              key={department}
              className="rounded-lg border border-border/70 bg-background p-4"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{department}</p>
                  <p className="text-xs text-muted-foreground">
                    {departmentEmployees.length} employees
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {departmentEmployees.map((employee) => (
                    <Badge key={employee.id} variant="secondary">
                      {teamRoleLabels[employee.role]}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Average weekly attendance</span>
                <span>{averageAttendance}h</span>
              </div>
              <Progress value={Math.min(100, (averageAttendance / 40) * 100)} className="mt-2" />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
