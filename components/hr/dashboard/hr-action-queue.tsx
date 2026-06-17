"use client";

import { AlertTriangle, CalendarClock, FileText, ReceiptText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { HREmployeeRecord } from "@/components/hr/hr-data";

export function HRActionQueue({ employees }: { employees: HREmployeeRecord[] }) {
  const expiringDocs = employees.flatMap((employee) =>
    employee.documents
      .filter((document) => document.status === "expiring")
      .map((document) => ({
        id: document.id,
        employee: employee.name,
        label: document.name,
        type: "Document",
      })),
  );

  const actions = [
    ...expiringDocs,
    {
      id: "leave-approvals",
      employee: "Caleb Reed",
      label: "Leave extension needs review",
      type: "Leave",
    },
    {
      id: "payroll-period",
      employee: "All employees",
      label: "Bi-weekly payroll preview due",
      type: "Payroll",
    },
  ];

  const iconByType = {
    Document: FileText,
    Leave: CalendarClock,
    Payroll: ReceiptText,
  };

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">HR Action Queue</h2>
          <p className="text-sm text-muted-foreground">
            Mock approvals, document alerts, and payroll readiness items.
          </p>
        </div>
        <AlertTriangle className="h-5 w-5 text-amber-600" />
      </div>
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = iconByType[action.type as keyof typeof iconByType];

          return (
            <div
              key={action.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-lg border border-border/70 bg-muted/40 p-2">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{action.label}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {action.employee}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="shrink-0 bg-background">
                {action.type}
              </Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
