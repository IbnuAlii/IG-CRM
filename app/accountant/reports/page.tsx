"use client";

import { BarChart3, CalendarClock, Download, FileText, Save } from "lucide-react";
import { useState } from "react";
import { AccountantActionButton } from "@/components/accountant/accountant-action-button";
import { getAccountantData, type AccountantFinancialReport } from "@/components/accountant/accountant-data";
import { AccountantPageHeader } from "@/components/accountant/accountant-page-header";
import { AccountantStatCard } from "@/components/accountant/accountant-stat-card";
import { AccountantStatusBadge } from "@/components/accountant/accountant-status-badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AccountantReportsPage() {
  const { reports } = getAccountantData();
  const [selectedReport, setSelectedReport] = useState<AccountantFinancialReport | null>(null);

  return (
    <div className="space-y-8 py-6">
      <AccountantPageHeader
        badge="Financial reports"
        title="Reports"
        description="Build, schedule, export, and review financial reports for revenue, expenses, payroll, cash flow, and taxes."
        actions={
          <AccountantActionButton variant="outline" feedbackTitle="Report bundle export prepared">
            <Download className="mr-2 h-4 w-4" />
            Export Bundle
          </AccountantActionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AccountantStatCard icon={BarChart3} label="Reports" value={reports.length} detail="Finance templates" />
        <AccountantStatCard icon={FileText} label="Ready" value={reports.filter((report) => report.status === "ready").length} detail="Available for export" tone="green" />
        <AccountantStatCard icon={CalendarClock} label="Scheduled" value={reports.filter((report) => report.status === "scheduled").length} detail="Email delivery enabled" tone="blue" />
        <AccountantStatCard icon={Save} label="Drafts" value={reports.filter((report) => report.status === "draft").length} detail="Needs filters" tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Report Builder</h2>
          <p className="mt-1 text-sm text-muted-foreground">Custom report setup for finance exports.</p>
          <div className="mt-6 grid gap-5">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-foreground">Report name</label>
              <Input defaultValue="Revenue vs Expense by Service Type" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-foreground">Data source</label>
              <Select defaultValue="financial">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">Financial ledger</SelectItem>
                  <SelectItem value="payroll">Payroll ledger</SelectItem>
                  <SelectItem value="invoices">Invoice register</SelectItem>
                  <SelectItem value="payments">Payment history</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              {["PDF export", "Excel export", "CSV export", "Schedule email delivery"].map((item) => (
                <label key={item} className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm">
                  <Checkbox defaultChecked={item !== "Schedule email delivery"} />
                  {item}
                </label>
              ))}
            </div>
            <AccountantActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle="Custom finance report saved">
              <Save className="mr-2 h-4 w-4" />
              Save Report
            </AccountantActionButton>
          </div>
        </Card>

        <Card className="overflow-hidden border-border bg-card shadow-sm">
          <div className="border-b border-border p-6">
            <h2 className="text-xl font-semibold text-foreground">Report Library</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pre-built financial reports and schedules.</p>
          </div>
          <div className="divide-y divide-border">
            {reports.map((report) => (
              <div key={report.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <p className="font-semibold text-foreground">{report.name}</p>
                  <p className="text-sm text-muted-foreground">{report.period} / Owner: {report.owner}</p>
                  <p className="text-xs text-muted-foreground">Last run: {report.lastRunAt}</p>
                </div>
                <AccountantStatusBadge status={report.status} />
                <div className="flex gap-2">
                  <AccountantActionButton
                    size="sm"
                    variant="outline"
                    feedbackTitle="Report preview opened"
                    onClick={() => setSelectedReport(report)}
                  >
                    Preview
                  </AccountantActionButton>
                  <AccountantActionButton size="sm" variant="outline" feedbackTitle="Report exported">Export</AccountantActionButton>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Dialog open={Boolean(selectedReport)} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedReport?.name}</DialogTitle>
            <DialogDescription>
              {selectedReport?.period} / {selectedReport?.owner} / Last run {selectedReport?.lastRunAt}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <ReportMetric label="Rows" value="248" />
              <ReportMetric label="Exports" value="PDF, XLSX, CSV" />
              <ReportMetric label="Schedule" value={selectedReport?.status === "scheduled" ? "Enabled" : "Manual"} />
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold text-foreground">Included sections</p>
              <p className="mt-2 text-sm text-muted-foreground">Revenue, expenses, payroll allocation, tax summary, payment settlement, and accountant notes.</p>
            </div>
          </div>
          <DialogFooter>
            <AccountantActionButton variant="outline" feedbackTitle="Report preview closed" onClick={() => setSelectedReport(null)}>Close</AccountantActionButton>
            <AccountantActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle="Report preview exported">Export Preview</AccountantActionButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReportMetric({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 font-semibold text-foreground">{value}</p>
    </div>
  );
}
