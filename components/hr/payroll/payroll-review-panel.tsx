"use client";

import { CheckCircle2, FileSpreadsheet, Mail, ReceiptText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { HRActionButton } from "@/components/hr/action-button";
import type { HRPayrollPeriod, HRPayrollRecord } from "@/components/hr/hr-data";
import { formatCurrency, formatDate } from "./payroll-formatters";

export function PayrollReviewPanel({
  period,
  records,
}: {
  period: HRPayrollPeriod;
  records: HRPayrollRecord[];
}) {
  const gross = records.reduce((total, record) => total + record.grossPay, 0);
  const taxes = records.reduce((total, record) => total + record.taxWithholding, 0);
  const deductions = records.reduce((total, record) => total + record.deductions, 0);
  const net = records.reduce((total, record) => total + record.netPay, 0);

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Payroll Approval</h2>
          <p className="text-sm text-muted-foreground">
            Review totals, approve payroll, generate payslips, and queue delivery.
          </p>
        </div>
        <Badge variant="outline" className="bg-background capitalize">
          {period.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-border/70 bg-background p-3">
          <p className="text-xs text-muted-foreground">Pay Period</p>
          <p className="font-medium">{period.label}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-background p-3">
          <p className="text-xs text-muted-foreground">Pay Date</p>
          <p className="font-medium">{formatDate(period.payDate)}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-background p-3">
          <p className="text-xs text-muted-foreground">Gross</p>
          <p className="font-medium">{formatCurrency(gross)}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-background p-3">
          <p className="text-xs text-muted-foreground">Net</p>
          <p className="font-medium">{formatCurrency(net)}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-background p-3">
          <p className="text-xs text-muted-foreground">Taxes</p>
          <p className="font-medium">{formatCurrency(taxes)}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-background p-3">
          <p className="text-xs text-muted-foreground">Deductions</p>
          <p className="font-medium">{formatCurrency(deductions)}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-sm font-medium">Approval note</p>
        <Textarea
          className="min-h-24"
          defaultValue="Attendance records reviewed. Overtime and deductions ready for payroll approval."
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <HRActionButton
          feedbackTitle="Payroll approved"
          feedbackDescription={`${period.label} was marked approved in the mock workflow.`}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Approve Payroll
        </HRActionButton>
        <HRActionButton
          variant="outline"
          feedbackTitle="Payslips generated"
          feedbackDescription="Payslip records were prepared for the selected payroll period."
        >
          <ReceiptText className="mr-2 h-4 w-4" />
          Generate Payslips
        </HRActionButton>
        <HRActionButton
          variant="outline"
          feedbackTitle="Payslips queued for email"
          feedbackDescription="Employee payslip delivery states were queued in the mock workflow."
        >
          <Mail className="mr-2 h-4 w-4" />
          Email Payslips
        </HRActionButton>
        <HRActionButton
          variant="outline"
          feedbackTitle="Accounting export prepared"
          feedbackDescription="Payroll totals are ready for accounting-system export."
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export to Accounting
        </HRActionButton>
      </div>
    </Card>
  );
}
