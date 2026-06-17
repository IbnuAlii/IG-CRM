"use client";

import { CreditCard, Download, RefreshCw, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AccountantActionButton } from "@/components/accountant/accountant-action-button";
import { formatAccountantDecimalCurrency, getAccountantData, type AccountantPayment } from "@/components/accountant/accountant-data";
import { AccountantPageHeader } from "@/components/accountant/accountant-page-header";
import { AccountantStatCard } from "@/components/accountant/accountant-stat-card";
import { AccountantStatusBadge } from "@/components/accountant/accountant-status-badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AccountantPaymentsPage() {
  const { payments } = getAccountantData();
  const [selectedPayment, setSelectedPayment] = useState<AccountantPayment | null>(null);
  const [paymentStatuses, setPaymentStatuses] = useState<Record<string, AccountantPayment["status"]>>(
    Object.fromEntries(payments.map((payment) => [payment.id, payment.status])),
  );
  const settled = payments.filter((payment) => payment.status === "settled");
  const failed = payments.filter((payment) => paymentStatuses[payment.id] === "failed");
  const settledTotal = settled.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-8 py-6">
      <AccountantPageHeader
        badge="Payment history"
        title="Payments"
        description="Review card, ACH, check, and wire payment events, settlement references, failed retries, and receipt export workflows."
        actions={
          <AccountantActionButton variant="outline" feedbackTitle="Payment history export prepared">
            <Download className="mr-2 h-4 w-4" />
            Export Payments
          </AccountantActionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AccountantStatCard icon={CreditCard} label="Payment events" value={payments.length} detail="Current register" />
        <AccountantStatCard icon={ShieldCheck} label="Settled" value={settled.length} detail={formatAccountantDecimalCurrency(settledTotal)} tone="green" />
        <AccountantStatCard icon={RefreshCw} label="Failed / retry" value={failed.length} detail="Requires follow-up" tone="red" />
        <AccountantStatCard icon={CreditCard} label="Methods" value="4" detail="Card, ACH, check, wire" tone="purple" />
      </div>

      <Card className="border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Gateway Reconciliation</h2>
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">Stripe and manual payment activity is reconciled against invoices, deposits, refunds, retry attempts, and receipt delivery.</p>
            </div>
          </div>
          <AccountantActionButton variant="outline" feedbackTitle="Gateway sync started">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Gateway
          </AccountantActionButton>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <GatewayMetric label="Stripe settlement" value="Current" detail="Last sync 4 minutes ago" tone="text-green-600" />
          <GatewayMetric label="Failed retries" value={failed.length.toString()} detail="Retry queue monitored" tone="text-red-600" />
          <GatewayMetric label="Receipt delivery" value="100%" detail="Customer portal and email" tone="text-blue-600" />
          <GatewayMetric label="PCI posture" value="Tokenized" detail="No card details stored locally" tone="text-purple-600" />
        </div>
      </Card>

      <Card className="overflow-hidden border-border bg-card shadow-sm">
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-semibold text-foreground">Payment Register</h2>
          <p className="mt-1 text-sm text-muted-foreground">Stripe and manual payment history with references.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-muted text-left text-muted-foreground">
              <tr>
                {["Payment", "Invoice", "Customer", "Paid at", "Method", "Reference", "Amount", "Status", "Actions"].map((header) => (
                  <th key={header} className="px-4 py-3 font-medium">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-4 py-4 font-semibold text-foreground">{payment.id}</td>
                  <td className="px-4 py-4">{payment.invoiceId}</td>
                  <td className="px-4 py-4">{payment.customerName}</td>
                  <td className="px-4 py-4">{payment.paidAt}</td>
                  <td className="px-4 py-4 uppercase">{payment.method}</td>
                  <td className="px-4 py-4">{payment.reference}</td>
                  <td className="px-4 py-4 font-semibold">{formatAccountantDecimalCurrency(payment.amount)}</td>
                  <td className="px-4 py-4"><AccountantStatusBadge status={paymentStatuses[payment.id]} /></td>
                  <td className="px-4 py-4">
                    <AccountantActionButton
                      size="sm"
                      variant="outline"
                      feedbackTitle={paymentStatuses[payment.id] === "failed" ? "Payment retry queued" : "Receipt opened"}
                      onClick={() => {
                        setSelectedPayment(payment);
                        if (paymentStatuses[payment.id] === "failed") {
                          setPaymentStatuses((current) => ({ ...current, [payment.id]: "processing" }));
                        }
                      }}
                    >
                      {paymentStatuses[payment.id] === "failed" ? "Retry" : "Receipt"}
                    </AccountantActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={Boolean(selectedPayment)} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{paymentStatuses[selectedPayment?.id ?? ""] === "processing" ? "Retry Queued" : "Payment Receipt"}</DialogTitle>
            <DialogDescription>
              {selectedPayment?.id} / {selectedPayment?.invoiceId} / {selectedPayment?.customerName}
            </DialogDescription>
          </DialogHeader>
          {selectedPayment ? (
            <div className="grid gap-3">
              <ReceiptLine label="Amount" value={formatAccountantDecimalCurrency(selectedPayment.amount)} />
              <ReceiptLine label="Method" value={selectedPayment.method.toUpperCase()} />
              <ReceiptLine label="Reference" value={selectedPayment.reference} />
              <ReceiptLine label="Status" value={paymentStatuses[selectedPayment.id]} />
            </div>
          ) : null}
          <DialogFooter>
            <AccountantActionButton variant="outline" feedbackTitle="Payment detail closed" onClick={() => setSelectedPayment(null)}>Close</AccountantActionButton>
            <AccountantActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle="Receipt exported">Export Receipt</AccountantActionButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReceiptLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold capitalize text-foreground">{value}</span>
    </div>
  );
}

function GatewayMetric({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}
