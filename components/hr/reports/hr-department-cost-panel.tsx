"use client";

import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { HRPayrollRecord } from "@/components/hr/hr-data";
import { formatCurrency } from "./hr-report-formatters";

export function HRDepartmentCostPanel({
  payrollRecords,
}: {
  payrollRecords: HRPayrollRecord[];
}) {
  const departments = Array.from(new Set(payrollRecords.map((record) => record.department)));
  const totalCost = payrollRecords.reduce((total, record) => total + record.grossPay, 0);

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Labor Cost By Department</h2>
          <p className="text-sm text-muted-foreground">
            Gross payroll distribution for HR and accounting exports.
          </p>
        </div>
        <Building2 className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-4">
        {departments.map((department) => {
          const departmentCost = payrollRecords
            .filter((record) => record.department === department)
            .reduce((total, record) => total + record.grossPay, 0);
          const percent = totalCost > 0 ? (departmentCost / totalCost) * 100 : 0;

          return (
            <div key={department}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{department}</span>
                <span className="text-muted-foreground">
                  {formatCurrency(departmentCost)}
                </span>
              </div>
              <Progress value={percent} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
