"use client";

import { BarChart3, CalendarCheck, FileSpreadsheet, GraduationCap, ReceiptText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const reports = [
  {
    title: "Attendance & Overtime",
    description: "Clock records, GPS locations, exception counts, and overtime hours.",
    schedule: "Weekly",
    icon: CalendarCheck,
  },
  {
    title: "Leave Balance",
    description: "Vacation, sick, personal, approved leave, and pending requests.",
    schedule: "Weekly",
    icon: FileSpreadsheet,
  },
  {
    title: "Payroll Summary",
    description: "Gross pay, taxes, deductions, net pay, and accounting export.",
    schedule: "Bi-weekly",
    icon: ReceiptText,
  },
  {
    title: "Training Compliance",
    description: "Course completion, overdue training, certifications, and reminders.",
    schedule: "Monthly",
    icon: GraduationCap,
  },
  {
    title: "Labor Cost",
    description: "Payroll cost by department and employee for workforce planning.",
    schedule: "Monthly",
    icon: BarChart3,
  },
];

export function HRReportLibrary() {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Report Library</h2>
        <p className="text-sm text-muted-foreground">
          HR report templates for scheduled exports and operational review.
        </p>
      </div>
      <div className="space-y-3">
        {reports.map((report) => {
          const Icon = report.icon;

          return (
            <div
              key={report.title}
              className="rounded-lg border border-border/70 bg-background p-3"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <div className="rounded-lg border border-border/70 bg-muted/40 p-2">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium">{report.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.description}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="shrink-0 bg-background">
                  {report.schedule}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
