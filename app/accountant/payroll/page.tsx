"use client";

import { Download, FileText, ShieldCheck, WalletCards } from "lucide-react";
import { AccountantActionButton } from "@/components/accountant/accountant-action-button";
import { formatAccountantDecimalCurrency, getAccountantData } from "@/components/accountant/accountant-data";
import { AccountantPageHeader } from "@/components/accountant/accountant-page-header";
import { AccountantStatCard } from "@/components/accountant/accountant-stat-card";
import { AccountantStatusBadge } from "@/components/accountant/accountant-status-badge";
import { Card } from "@/components/ui/card";

export default function AccountantPayrollPage() {
  const { payrollPeriod, payrollRecords } = getAccountantData();
  const gross = payrollRecords.reduce((sum, record) => sum + record.grossPay, 0);
  const taxes = payrollRecords.reduce((sum, record) => sum + record.taxWithholding, 0);
  const deductions = payrollRecords.reduce((sum, record) => sum + record.deductions, 0);
  const net = payrollRecords.reduce((sum, record) => sum + record.netPay, 0);

  return (
    <div className="space-y-8 py-6">
      <AccountantPageHeader
        badge="Payroll data"
        title="Payroll Review"
        description="Accountant view of payroll totals, tax withholding, deductions, net pay, and export readiness."
        actions={
          <>
            <AccountantActionButton variant="outline" feedbackTitle="Payroll export prepared">
              <Download className="mr-2 h-4 w-4" />
              Export Payroll
            </AccountantActionButton>
            <AccountantActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle="Accounting system export queued">
              <FileText className="mr-2 h-4 w-4" />
              Export to Accounting
            </AccountantActionButton>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AccountantStatCard icon={WalletCards} label="Gross payroll" value={formatAccountantDecimalCurrency(gross)} detail={payrollPeriod.label} />
        <AccountantStatCard icon={ShieldCheck} label="Tax withholding" value={formatAccountantDecimalCurrency(taxes)} detail="Federal/state estimate" tone="amber" />
        <AccountantStatCard icon={FileText} label="Deductions" value={formatAccountantDecimalCurrency(deductions)} detail="Benefits and custom deductions" tone="purple" />
        <AccountantStatCard icon={WalletCards} label="Net pay" value={formatAccountantDecimalCurrency(net)} detail="Ready for payment" tone="green" />
      </div>

      <Card className="border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Tax & Accounting Export</h2>
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">Payroll data is grouped for accountant review before general ledger export, withholding reports, and audit archive generation.</p>
            </div>
          </div>
          <AccountantActionButton variant="outline" feedbackTitle="Payroll compliance package prepared">
            <Download className="mr-2 h-4 w-4" />
            Download Package
          </AccountantActionButton>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <PayrollExportTile label="GL mapping" value="Ready" detail="Labor, tax, benefits, reimbursements" />
          <PayrollExportTile label="Withholding report" value={formatAccountantDecimalCurrency(taxes)} detail="Federal and state estimate" />
          <PayrollExportTile label="Approval lock" value="Enabled" detail="Records protected after export" />
          <PayrollExportTile label="Audit archive" value="Queued" detail="CSV, PDF, and summary packet" />
        </div>
      </Card>

      <Card className="overflow-hidden border-border bg-card shadow-sm">
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-semibold text-foreground">Payroll Ledger</h2>
          <p className="mt-1 text-sm text-muted-foreground">{payrollPeriod.label} / Pay date {payrollPeriod.payDate}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-muted text-left text-muted-foreground">
              <tr>
                {["Employee", "Department", "Type", "Regular", "OT", "Gross", "Tax", "Deductions", "Net", "Status"].map((header) => (
                  <th key={header} className="px-4 py-3 font-medium">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payrollRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-foreground">{record.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{record.employeeNumber}</p>
                  </td>
                  <td className="px-4 py-4">{record.department}</td>
                  <td className="px-4 py-4">{record.salaryType}</td>
                  <td className="px-4 py-4">{record.regularHours.toFixed(1)}</td>
                  <td className="px-4 py-4">{record.overtimeHours.toFixed(1)}</td>
                  <td className="px-4 py-4">{formatAccountantDecimalCurrency(record.grossPay)}</td>
                  <td className="px-4 py-4">{formatAccountantDecimalCurrency(record.taxWithholding)}</td>
                  <td className="px-4 py-4">{formatAccountantDecimalCurrency(record.deductions)}</td>
                  <td className="px-4 py-4 font-semibold">{formatAccountantDecimalCurrency(record.netPay)}</td>
                  <td className="px-4 py-4"><AccountantStatusBadge status={record.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function PayrollExportTile({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}
