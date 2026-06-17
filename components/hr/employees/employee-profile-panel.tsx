"use client";

import { CalendarDays, FileText, Phone, ShieldCheck } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { teamRoleLabels } from "@/components/admin/team/team-role-labels";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { HREmployeeRecord } from "@/components/hr/hr-data";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function EmployeeProfilePanel({
  employee,
}: {
  employee?: HREmployeeRecord;
}) {
  if (!employee) {
    return (
      <Card className="border-border/70 bg-card p-5 shadow-sm">
        <h2 className="font-semibold">Employee Profile</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Select an employee to review profile details, documents, emergency contact, permissions, and certifications.
        </p>
      </Card>
    );
  }

  const attendancePercent = Math.min(
    100,
    Math.round((employee.attendanceThisWeekHours / 40) * 100),
  );

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border/70 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{employee.name}</h2>
            <p className="text-sm text-muted-foreground">
              {employee.employeeNumber} - {teamRoleLabels[employee.role]}
            </p>
          </div>
          <AdminStatusBadge status={employee.status} />
        </div>
        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg border border-border/70 bg-background p-3">
            <p className="text-xs text-muted-foreground">Department</p>
            <p className="font-medium">{employee.department}</p>
          </div>
          <div className="rounded-lg border border-border/70 bg-background p-3">
            <p className="text-xs text-muted-foreground">Manager</p>
            <p className="font-medium">{employee.managerName}</p>
          </div>
          <div className="rounded-lg border border-border/70 bg-background p-3">
            <p className="text-xs text-muted-foreground">Hire Date</p>
            <p className="font-medium">{formatDate(employee.hireDate)}</p>
          </div>
          <div className="rounded-lg border border-border/70 bg-background p-3">
            <p className="text-xs text-muted-foreground">Employment</p>
            <p className="font-medium capitalize">
              {employee.employmentType.replace("_", " ")}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <section>
          <div className="mb-2 flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Contact & Emergency</h3>
          </div>
          <div className="space-y-1 text-sm">
            <p>{employee.email}</p>
            <p>{employee.phone}</p>
            <p className="text-muted-foreground">{employee.emergencyContact}</p>
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Role Permissions</h3>
          </div>
          <Badge variant="outline" className="bg-background">
            {employee.permissionSet}
          </Badge>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Attendance Snapshot</h3>
          </div>
          <div className="rounded-lg border border-border/70 bg-background p-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>{employee.attendanceThisWeekHours}h this week</span>
              <span className="text-muted-foreground">
                {employee.overtimeHours}h overtime
              </span>
            </div>
            <Progress value={attendancePercent} />
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Documents</h3>
          </div>
          <div className="space-y-2">
            {employee.documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background p-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium">{document.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {document.type} - Updated {formatDate(document.updatedAt)}
                  </p>
                </div>
                <Badge
                  variant={document.status === "complete" ? "secondary" : "destructive"}
                >
                  {document.status}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Card>
  );
}
