"use client";

import { BadgeDollarSign, CheckCircle2, ReceiptText, ShieldAlert } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { HRPayrollRecord } from "@/components/hr/hr-data";
import { formatCurrency, formatDecimal } from "./payroll-formatters";

export function PayrollSummaryCards({
  records,
}: {
  records: HRPayrollRecord[];
}) {
  const gross = records.reduce((total, record) => total + record.grossPay, 0);
  const net = records.reduce((total, record) => total + record.netPay, 0);
  const overtime = records.reduce((total, record) => total + record.overtimeHours, 0);
  const approved = records.filter((record) => record.status === "approved").length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Gross Payroll"
        value={formatCurrency(gross)}
        description="Before taxes and deductions"
        trend={`${records.length} employees included`}
        icon={BadgeDollarSign}
        tone="blue"
      />
      <AdminStatCard
        label="Net Payroll"
        value={formatCurrency(net)}
        description="Estimated employee payouts"
        trend="Payslip source amount"
        icon={ReceiptText}
        tone="green"
      />
      <AdminStatCard
        label="Overtime"
        value={`${formatDecimal(overtime)}h`}
        description="From attendance records"
        trend="Review before approval"
        icon={ShieldAlert}
        tone={overtime > 0 ? "amber" : "green"}
      />
      <AdminStatCard
        label="Approved Rows"
        value={approved}
        description="Ready for payment"
        trend="Audit trail retained"
        icon={CheckCircle2}
        tone={approved > 0 ? "green" : "neutral"}
      />
    </div>
  );
}
