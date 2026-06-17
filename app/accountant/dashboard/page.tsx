"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, ArrowRight, CreditCard, Download, FileText, ReceiptText, WalletCards } from "lucide-react";
import Link from "next/link";
import { AccountantActionButton } from "@/components/accountant/accountant-action-button";
import { getAccountantData, formatAccountantCurrency } from "@/components/accountant/accountant-data";
import { AccountantPageHeader } from "@/components/accountant/accountant-page-header";
import { AccountantStatCard } from "@/components/accountant/accountant-stat-card";
import { AccountantStatusBadge } from "@/components/accountant/accountant-status-badge";
import { Card } from "@/components/ui/card";

const cashFlowData = [
  { month: "Jan", revenue: 42000, expense: 28500 },
  { month: "Feb", revenue: 46500, expense: 30100 },
  { month: "Mar", revenue: 51800, expense: 32800 },
  { month: "Apr", revenue: 48900, expense: 31900 },
  { month: "May", revenue: 56300, expense: 34400 },
];

const forecastData = [
  { week: "W1", cash: 18500 },
  { week: "W2", cash: 22600 },
  { week: "W3", cash: 24900 },
  { week: "W4", cash: 28300 },
];

export default function AccountantDashboardPage() {
  const { invoices, payments, payrollRecords, reports } = getAccountantData();
  const receivables = invoices
    .filter((invoice) => invoice.status === "sent" || invoice.status === "overdue")
    .reduce((sum, invoice) => sum + invoice.total, 0);
  const revenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const payrollNet = payrollRecords.reduce((sum, record) => sum + record.netPay, 0);
  const settled = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-8 py-6">
      <AccountantPageHeader
        badge="Finance operations"
        title="Accounting Dashboard"
        description="Monitor receivables, invoice status, payment settlement, payroll exposure, and financial report readiness."
        actions={
          <AccountantActionButton variant="outline" feedbackTitle="Finance package export prepared">
            <Download className="mr-2 h-4 w-4" />
            Export Finance Pack
          </AccountantActionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AccountantStatCard icon={ReceiptText} label="Total invoiced" value={formatAccountantCurrency(revenue)} detail={`${invoices.length} invoices this cycle`} />
        <AccountantStatCard icon={AlertTriangle} label="Open receivables" value={formatAccountantCurrency(receivables)} detail="Sent and overdue invoices" tone="amber" />
        <AccountantStatCard icon={CreditCard} label="Payments settled" value={formatAccountantCurrency(settled)} detail={`${payments.length} payment events`} tone="green" />
        <AccountantStatCard icon={WalletCards} label="Net payroll" value={formatAccountantCurrency(payrollNet)} detail="Current review period" tone="purple" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Revenue vs Expense</h2>
          <p className="mt-1 text-sm text-muted-foreground">Financial report preview for margin review.</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Cash Flow Forecast</h2>
          <p className="mt-1 text-sm text-muted-foreground">Expected cash position over the next 30 days.</p>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cash" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Invoice Watchlist</h2>
            <Link href="/accountant/invoices" className="flex items-center gap-1 text-sm font-medium text-blue-700">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {invoices.slice(0, 5).map((invoice) => (
              <div key={invoice.id} className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <p className="font-semibold text-foreground">{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">{invoice.customerName} / {invoice.service}</p>
                </div>
                <AccountantStatusBadge status={invoice.status} />
                <p className="font-semibold text-foreground">{formatAccountantCurrency(invoice.total)}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Report Readiness</h2>
            <FileText className="h-5 w-5 text-blue-700" />
          </div>
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="font-semibold text-foreground">{report.name}</p>
                  <p className="text-sm text-muted-foreground">{report.period} / {report.lastRunAt}</p>
                </div>
                <AccountantStatusBadge status={report.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
