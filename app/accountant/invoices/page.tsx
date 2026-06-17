"use client";

import { Download, FilePlus2, Mail, ReceiptText, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AccountantActionButton } from "@/components/accountant/accountant-action-button";
import { formatAccountantDecimalCurrency, getAccountantData, type AccountantInvoice } from "@/components/accountant/accountant-data";
import { AccountantPageHeader } from "@/components/accountant/accountant-page-header";
import { AccountantStatCard } from "@/components/accountant/accountant-stat-card";
import { AccountantStatusBadge } from "@/components/accountant/accountant-status-badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AccountantInvoicesPage() {
  const { invoices } = getAccountantData();
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<AccountantInvoice | null>(null);
  const [invoiceDialogMode, setInvoiceDialogMode] = useState<"view" | "email">("view");

  const visibleInvoices = useMemo(
    () =>
      invoices.filter((invoice) => {
        const matchesStatus = status === "all" || invoice.status === status;
        const matchesQuery =
          !query ||
          [invoice.id, invoice.customerName, invoice.jobNumber, invoice.service, invoice.status]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase());

        return matchesStatus && matchesQuery;
      }),
    [invoices, query, status],
  );

  const openTotal = invoices
    .filter((invoice) => invoice.status === "sent" || invoice.status === "overdue")
    .reduce((sum, invoice) => sum + invoice.total, 0);

  return (
    <div className="space-y-8 py-6">
      <AccountantPageHeader
        badge="Invoice management"
        title="Invoices"
        description="Generate invoices, review tax totals, email customers, retry collections, and export invoice registers."
        actions={
          <>
            <AccountantActionButton variant="outline" feedbackTitle="Invoice register export prepared">
              <Download className="mr-2 h-4 w-4" />
              Export
            </AccountantActionButton>
            <AccountantActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle="Invoice generator opened">
              <FilePlus2 className="mr-2 h-4 w-4" />
              Generate Invoice
            </AccountantActionButton>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AccountantStatCard icon={ReceiptText} label="Invoices" value={invoices.length} detail="Current finance cycle" />
        <AccountantStatCard icon={Mail} label="Sent" value={invoices.filter((invoice) => invoice.status === "sent").length} detail="Awaiting payment" tone="blue" />
        <AccountantStatCard icon={ReceiptText} label="Overdue" value={invoices.filter((invoice) => invoice.status === "overdue").length} detail="Needs collection action" tone="red" />
        <AccountantStatCard icon={ReceiptText} label="Open amount" value={formatAccountantDecimalCurrency(openTotal)} detail="Sent plus overdue" tone="amber" />
      </div>

      <Card className="border-border bg-card p-5 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search invoice, customer, job, service..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="border-border bg-card p-6 shadow-sm">
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FilePlus2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Invoice Generation Workflow</h2>
                <p className="mt-1 text-sm text-muted-foreground">Create branded invoices from completed jobs with taxes, payment links, PDFs, and customer email delivery.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              <InvoiceWorkflowStep label="1. Select completed job" detail="Pull customer, technician, quote, service notes, and approved labor/material lines." />
              <InvoiceWorkflowStep label="2. Review taxes and terms" detail="Apply local tax, due date, gateway fee handling, and collection notes." />
              <InvoiceWorkflowStep label="3. Generate and send" detail="Create the PDF, email the customer, and sync the payment link to the customer portal." />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <InvoiceDraftField label="Customer" value="Olivia Martin" />
            <InvoiceDraftField label="Completed job" value="JOB-1104 / HVAC diagnostic visit" />
            <InvoiceDraftField label="Tax rate" value="8.875%" />
            <InvoiceDraftField label="Payment terms" value="Due on receipt" />
            <div className="rounded-lg border border-border p-4 sm:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Draft total</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">$185.00</p>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <AccountantActionButton size="sm" variant="outline" feedbackTitle="Draft PDF generated">Preview PDF</AccountantActionButton>
                  <AccountantActionButton size="sm" className="bg-blue-600 hover:bg-blue-700" feedbackTitle="Invoice generated and queued">Generate</AccountantActionButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="border-b border-border bg-muted text-left text-muted-foreground">
              <tr>
                {["Invoice", "Customer", "Job", "Issued", "Due", "Subtotal", "Tax", "Total", "Status", "Actions"].map((header) => (
                  <th key={header} className="px-4 py-3 font-medium">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibleInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-4 py-4 font-semibold text-foreground">{invoice.id}</td>
                  <td className="px-4 py-4">{invoice.customerName}</td>
                  <td className="px-4 py-4">{invoice.jobNumber}</td>
                  <td className="px-4 py-4">{invoice.issueDate}</td>
                  <td className="px-4 py-4">{invoice.dueDate}</td>
                  <td className="px-4 py-4">{formatAccountantDecimalCurrency(invoice.amount)}</td>
                  <td className="px-4 py-4">{formatAccountantDecimalCurrency(invoice.tax)}</td>
                  <td className="px-4 py-4 font-semibold">{formatAccountantDecimalCurrency(invoice.total)}</td>
                  <td className="px-4 py-4"><AccountantStatusBadge status={invoice.status} /></td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <AccountantActionButton
                        size="sm"
                        variant="outline"
                        feedbackTitle="Invoice preview opened"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setInvoiceDialogMode("view");
                        }}
                      >
                        View
                      </AccountantActionButton>
                      <AccountantActionButton
                        size="sm"
                        variant="outline"
                        feedbackTitle="Invoice email composer opened"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setInvoiceDialogMode("email");
                        }}
                      >
                        Email
                      </AccountantActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={Boolean(selectedInvoice)} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{invoiceDialogMode === "email" ? "Email Invoice" : "Invoice Preview"}</DialogTitle>
            <DialogDescription>
              {selectedInvoice?.id} / {selectedInvoice?.customerName} / {selectedInvoice?.jobNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice ? (
            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <InvoicePreviewMetric label="Subtotal" value={formatAccountantDecimalCurrency(selectedInvoice.amount)} />
                <InvoicePreviewMetric label="Tax" value={formatAccountantDecimalCurrency(selectedInvoice.tax)} />
                <InvoicePreviewMetric label="Total" value={formatAccountantDecimalCurrency(selectedInvoice.total)} />
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="font-semibold text-foreground">{selectedInvoice.service}</p>
                <p className="mt-1 text-sm text-muted-foreground">Issued {selectedInvoice.issueDate} / Due {selectedInvoice.dueDate} / Payment method {selectedInvoice.method.toUpperCase()}</p>
              </div>
              {invoiceDialogMode === "email" ? (
                <Input defaultValue={`${selectedInvoice.customerName} invoice ${selectedInvoice.id} is ready`} aria-label="Invoice email subject" />
              ) : null}
            </div>
          ) : null}
          <DialogFooter>
            <AccountantActionButton variant="outline" feedbackTitle="Invoice dialog closed" onClick={() => setSelectedInvoice(null)}>Close</AccountantActionButton>
            <AccountantActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle={invoiceDialogMode === "email" ? "Invoice email sent" : "Invoice PDF exported"}>
              {invoiceDialogMode === "email" ? "Send Email" : "Export PDF"}
            </AccountantActionButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InvoicePreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 font-semibold text-foreground">{value}</p>
    </div>
  );
}

function InvoiceWorkflowStep({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted p-4">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

function InvoiceDraftField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 font-semibold text-foreground">{value}</p>
    </div>
  );
}
