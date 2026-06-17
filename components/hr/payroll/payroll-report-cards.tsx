"use client";

import { Building2, FileText, Landmark, PieChart } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { HRPayrollRecord } from "@/components/hr/hr-data";
import { formatCurrency } from "./payroll-formatters";

export function PayrollReportCards({
  records,
}: {
  records: HRPayrollRecord[];
}) {
  const departments = Array.from(new Set(records.map((record) => record.department)));
  const totalTax = records.reduce((total, record) => total + record.taxWithholding, 0);
  const totalDeductions = records.reduce((total, record) => total + record.deductions, 0);

  const reports = [
    {
      title: "Payroll Summary",
      description: "Gross, tax, deductions, and net payroll totals.",
      value: `${records.length} rows`,
      icon: FileText,
    },
    {
      title: "Tax Report",
      description: "Federal, state, and local withholding export preview.",
      value: formatCurrency(totalTax),
      icon: Landmark,
    },
    {
      title: "Deduction Report",
      description: "Benefits, retirement, insurance, and custom deductions.",
      value: formatCurrency(totalDeductions),
      icon: PieChart,
    },
    {
      title: "Labor Cost",
      description: "Department and employee payroll cost summary.",
      value: `${departments.length} depts`,
      icon: Building2,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {reports.map((report) => {
        const Icon = report.icon;

        return (
          <Card key={report.title} className="border-border/70 bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{report.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {report.description}
                </p>
              </div>
              <div className="rounded-lg border border-border/70 bg-muted/40 p-2">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-semibold">{report.value}</p>
          </Card>
        );
      })}
    </div>
  );
}
