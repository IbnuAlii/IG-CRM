"use client";

import { CheckCircle2, ChevronRight, CreditCard, Download, FileText, Receipt, ShieldCheck, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CustomerActionButton } from "@/components/customer/customer-action-button";
import { customerTones } from "@/components/customer/customer-tones";
import {
  formatCustomerPortalCurrency,
  formatCustomerPortalDate,
  getCustomerPortalData,
} from "@/components/customer/customer-data";

const data = getCustomerPortalData();

export default function CustomerBillingPage() {
  const paidTotal = data.invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const dueTotal = data.invoices
    .filter((invoice) => invoice.status === "due")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className={customerTones.page}>
      <div className="mx-auto w-full max-w-[1760px] space-y-6 px-4 py-8 2xl:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className={`mb-4 px-3 py-1.5 ${customerTones.badge.info}`}>
              Billing center
            </Badge>
            <h1 className="text-4xl font-semibold tracking-normal text-foreground">Billing & Payments</h1>
            <p className="mt-3 max-w-3xl text-base text-muted-foreground">
              View invoices, payment history, receipts, and saved payment methods.
            </p>
          </div>
          <CustomerActionButton variant="outline" feedbackTitle="Billing export prepared">
            <Download className="mr-2 h-4 w-4" />
            Export Billing
          </CustomerActionButton>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Paid total", formatCustomerPortalCurrency(paidTotal), "Paid across completed visits", WalletCards, customerTones.icon.emerald],
            ["Amount due", formatCustomerPortalCurrency(dueTotal), "No outstanding balance", FileText, customerTones.icon.blue],
            ["Payment method", "Visa 4242", "Default saved card", CreditCard, customerTones.icon.violet],
          ].map(([label, value, detail, Icon, tone]) => {
            const IconComponent = Icon as typeof CreditCard;
            return (
              <Card key={label as string} className="border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-5">
                  <div className={`grid h-16 w-16 place-items-center rounded-full ${tone as string}`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-lg text-muted-foreground">{label as string}</p>
                    <p className="mt-1 text-3xl font-semibold text-foreground">{value as string}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{detail as string}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="overflow-hidden border-border bg-card shadow-sm">
            <div className="border-b border-border p-6">
              <h2 className="text-2xl font-semibold text-foreground">Invoices</h2>
              <p className="mt-2 text-muted-foreground">Download receipts or review payment status.</p>
            </div>
            <div className="divide-y divide-border p-6 pt-0">
              {data.invoices.map((invoice) => (
                <div key={invoice.id} className="grid gap-4 py-6 md:grid-cols-[1fr_auto_auto] md:items-center">
                  <div className="flex items-center gap-5">
                    <div className={`grid h-16 w-16 place-items-center rounded-full ${customerTones.icon.blue}`}>
                      <FileText className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">{invoice.service}</p>
                      <p className="mt-1 text-muted-foreground">
                        {invoice.id} / {formatCustomerPortalDate(invoice.date)}
                      </p>
                    </div>
                  </div>
                  <Badge className={`px-3 py-1.5 ${customerTones.badge.success}`}>
                    {invoice.status}
                  </Badge>
                  <div className="flex items-center gap-5">
                    <p className="text-xl font-semibold text-foreground">
                      {formatCustomerPortalCurrency(invoice.amount)}
                    </p>
                    <CustomerActionButton variant="outline" feedbackTitle="Receipt prepared">
                      <Receipt className="mr-2 h-4 w-4" />
                      Receipt
                    </CustomerActionButton>
                  </div>
                </div>
              ))}
            </div>
            <div className={`mx-6 mb-6 ${customerTones.surface.infoBlock}`}>
              <div className="flex items-center gap-4">
                <div className={`grid h-12 w-12 place-items-center rounded-lg ${customerTones.icon.blue}`}>
                  <Receipt className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{data.invoices.length} Invoices</p>
                  <p className="text-sm text-muted-foreground">Total across all time</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`grid h-12 w-12 place-items-center rounded-lg ${customerTones.icon.emerald}`}>
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Last payment received successfully</p>
                  <p className="text-sm text-muted-foreground">Thank you for being a valued customer.</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="border-border bg-card p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Payment Method</h2>
                <CustomerActionButton variant="link" className={`h-auto px-0 ${customerTones.link}`} feedbackTitle="Payment management opened">
                  Manage <ChevronRight className="ml-1 h-4 w-4" />
                </CustomerActionButton>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 p-8 text-white shadow-lg shadow-blue-900/20">
                <p className="text-right text-3xl font-bold italic">VISA</p>
                <p className="mt-8 text-xl tracking-[0.35em]">•••• •••• •••• 4242</p>
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-blue-100">
                  <div><p>Expires</p><p className="font-semibold text-white">•• / ••••</p></div>
                  <div><p>Cardholder</p><p className="font-semibold text-white">Demo User</p></div>
                </div>
              </div>
            </Card>
            <Card className="border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground">Payment activity</h2>
              <div className="mt-4 divide-y divide-border">
                {["Autopay ready", "Receipts available", "No overdue invoices"].map((item) => (
                  <div key={item} className="flex gap-4 py-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-foreground">{item}</p>
                      <p className="text-sm text-muted-foreground">Your billing account is up to date.</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <Card className={`border-emerald-200 p-6 shadow-sm ${customerTones.surface.success}`}>
          <div className="flex items-center gap-5">
            <div className={`grid h-16 w-16 place-items-center rounded-full ${customerTones.icon.emerald}`}>
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Billing protection</h2>
              <p className="mt-1 text-muted-foreground">Your receipts, payment history, and saved method are securely stored in your customer portal.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
