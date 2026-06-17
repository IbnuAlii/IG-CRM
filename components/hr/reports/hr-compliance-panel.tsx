"use client";

import { AlertTriangle, BadgeCheck, GraduationCap, ReceiptText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type {
  HRCertificationRecord,
  HRPayrollRecord,
  HRTrainingRecord,
} from "@/components/hr/hr-data";
import { formatCurrency } from "./hr-report-formatters";

export function HRCompliancePanel({
  trainingRecords,
  certifications,
  payrollRecords,
}: {
  trainingRecords: HRTrainingRecord[];
  certifications: HRCertificationRecord[];
  payrollRecords: HRPayrollRecord[];
}) {
  const overdueTraining = trainingRecords.filter((record) => record.status === "overdue");
  const certificationAlerts = certifications.filter((certification) =>
    ["expiring", "expired", "missing"].includes(certification.status),
  );
  const taxTotal = payrollRecords.reduce(
    (total, record) => total + record.taxWithholding,
    0,
  );

  const items = [
    {
      title: "Overdue Training",
      value: overdueTraining.length,
      description: "Courses past due date",
      icon: GraduationCap,
      tone: overdueTraining.length > 0 ? "destructive" : "secondary",
    },
    {
      title: "Certification Alerts",
      value: certificationAlerts.length,
      description: "Expiring, expired, or missing",
      icon: BadgeCheck,
      tone: certificationAlerts.length > 0 ? "destructive" : "secondary",
    },
    {
      title: "Tax Withholding",
      value: formatCurrency(taxTotal),
      description: "Payroll tax report total",
      icon: ReceiptText,
      tone: "secondary",
    },
  ] as const;

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Compliance Snapshot</h2>
          <p className="text-sm text-muted-foreground">
            Training, certification, and payroll tax reporting signals.
          </p>
        </div>
        <AlertTriangle className="h-5 w-5 text-amber-600" />
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-lg border border-border/70 bg-muted/40 p-2">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <Badge variant={item.tone}>{item.value}</Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
