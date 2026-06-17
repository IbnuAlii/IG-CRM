"use client";

import { DollarSign, Download, FileText, TrendingUp } from "lucide-react";
import { useState } from "react";
import { ManagerActionButton } from "@/components/manager/manager-action-button";
import { formatManagerCurrency, getManagerData } from "@/components/manager/manager-data";
import { ManagerPageHeader } from "@/components/manager/manager-page-header";
import { ManagerStatCard } from "@/components/manager/manager-stat-card";
import { ManagerStatusBadge } from "@/components/manager/manager-status-badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import type { AdminQuote } from "@/types";

export default function ManagerFinancePage() {
  const { adminData, revenue, openPipeline } = getManagerData();
  const [selectedQuote, setSelectedQuote] = useState<AdminQuote | null>(null);
  const acceptedQuotes = adminData.quotes.filter((quote) => quote.status === "accepted" || quote.status === "converted");
  const openQuotes = adminData.quotes.filter((quote) => ["sent", "viewed"].includes(quote.status));
  const targetProgress = Math.min(100, Math.round((revenue / 65000) * 100));

  return (
    <div className="space-y-8 py-6">
      <ManagerPageHeader
        badge="Limited financial reports"
        title="Limited Finance"
        description="Manager-safe financial visibility for department revenue, open pipeline, approved quotes, and exportable summary reports."
        actions={
          <ManagerActionButton variant="outline" feedbackTitle="Limited finance export prepared">
            <Download className="mr-2 h-4 w-4" />
            Export Summary
          </ManagerActionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ManagerStatCard icon={DollarSign} label="Recognized revenue" value={formatManagerCurrency(revenue)} detail="Accepted and converted quotes" tone="green" />
        <ManagerStatCard icon={TrendingUp} label="Open pipeline" value={formatManagerCurrency(openPipeline)} detail={`${openQuotes.length} customer approvals`} tone="blue" />
        <ManagerStatCard icon={FileText} label="Approved quotes" value={acceptedQuotes.length} detail="Department-visible work" tone="purple" />
        <ManagerStatCard icon={DollarSign} label="Target progress" value={`${targetProgress}%`} detail="Monthly department target" tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Department Target</h2>
          <p className="mt-1 text-sm text-muted-foreground">Limited financial view for manager planning.</p>
          <div className="mt-6 rounded-xl border border-border bg-muted p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">May 2026 progress</p>
                <p className="mt-1 text-3xl font-semibold text-foreground">{targetProgress}%</p>
              </div>
              <p className="font-semibold text-foreground">{formatManagerCurrency(revenue)} / $65,000</p>
            </div>
            <Progress value={targetProgress} className="mt-5 h-3" />
          </div>
          <div className="mt-5 grid gap-3">
            <FinanceNote label="Margin guardrails" value="Visible as pass/fail only" />
            <FinanceNote label="Payroll details" value="Hidden from manager finance view" />
            <FinanceNote label="Export scope" value="Department summary, not company ledger" />
          </div>
        </Card>

        <Card className="overflow-hidden border-border bg-card shadow-sm">
          <div className="border-b border-border p-6">
            <h2 className="text-xl font-semibold text-foreground">Quote Revenue View</h2>
            <p className="mt-1 text-sm text-muted-foreground">Approved and pending work relevant to department operations.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-muted text-left text-muted-foreground">
                <tr>
                  {["Quote", "Customer", "Service", "Owner", "Total", "Status", "Action"].map((header) => (
                    <th key={header} className="px-4 py-3 font-medium">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {adminData.quotes.slice(0, 8).map((quote) => (
                  <tr key={quote.id}>
                    <td className="px-4 py-4 font-semibold text-foreground">{quote.quoteNumber}</td>
                    <td className="px-4 py-4">{quote.customerName}</td>
                    <td className="px-4 py-4">{quote.serviceType}</td>
                    <td className="px-4 py-4">{quote.assignedTo}</td>
                    <td className="px-4 py-4 font-semibold">{formatManagerCurrency(quote.total)}</td>
                    <td className="px-4 py-4"><ManagerStatusBadge status={quote.status === "accepted" || quote.status === "converted" ? "approved" : "pending"} /></td>
                    <td className="px-4 py-4">
                      <ManagerActionButton
                        size="sm"
                        variant="outline"
                        feedbackTitle="Quote finance detail opened"
                        onClick={() => setSelectedQuote(quote)}
                      >
                        View
                      </ManagerActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Dialog open={Boolean(selectedQuote)} onOpenChange={(open) => !open && setSelectedQuote(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Limited Finance Detail</DialogTitle>
            <DialogDescription>
              {selectedQuote?.quoteNumber} / {selectedQuote?.customerName}
            </DialogDescription>
          </DialogHeader>
          {selectedQuote ? (
            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <FinanceDetail label="Subtotal" value={formatManagerCurrency(selectedQuote.subtotal)} />
                <FinanceDetail label="Tax" value={formatManagerCurrency(selectedQuote.tax)} />
                <FinanceDetail label="Total" value={formatManagerCurrency(selectedQuote.total)} />
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="font-semibold text-foreground">Manager visibility</p>
                <p className="mt-2 text-sm text-muted-foreground">This view shows quote value, customer, service type, and approval status. Company ledger, payroll, and margin details remain hidden.</p>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <ManagerActionButton variant="outline" feedbackTitle="Finance detail closed" onClick={() => setSelectedQuote(null)}>Close</ManagerActionButton>
            <ManagerActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle="Finance detail exported">Export Detail</ManagerActionButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FinanceDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function FinanceNote({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}
