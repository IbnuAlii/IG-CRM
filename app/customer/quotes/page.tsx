"use client";

import { CheckCircle2, Clock, Download, FileText, Heart, ShieldCheck, Wrench, Zap } from "lucide-react";
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

export default function CustomerQuotesPage() {
  const pending = data.quotes.filter((quote) => quote.status === "pending").length;
  const approved = data.quotes.filter((quote) => quote.status === "approved").length;
  const total = data.quotes.reduce((sum, quote) => sum + quote.amount, 0);

  return (
    <div className={customerTones.page}>
      <div className="mx-auto w-full max-w-[1760px] space-y-6 px-4 py-8 2xl:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className={`mb-4 px-3 py-1.5 ${customerTones.badge.info}`}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Customer approvals
            </Badge>
            <h1 className="text-4xl font-semibold tracking-normal text-foreground">Quotes</h1>
            <p className="mt-3 max-w-3xl text-base text-muted-foreground">
              Review branded estimates, line items, expiration dates, and approve work before scheduling.
            </p>
          </div>
          <CustomerActionButton variant="outline" feedbackTitle="Quote package export prepared">
            <Download className="mr-2 h-4 w-4" />
            Export Quotes
          </CustomerActionButton>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Pending approval", pending, "Quotes awaiting your approval", Clock, customerTones.icon.blue],
            ["Approved", approved, "Quotes you&apos;ve approved", CheckCircle2, customerTones.icon.emerald],
            ["Total quoted", formatCustomerPortalCurrency(total), "Total value of all quotes", Zap, customerTones.icon.violet],
          ].map(([label, value, detail, Icon, tone]) => {
            const IconComponent = Icon as typeof Clock;
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

        <div className="grid gap-6 xl:grid-cols-2">
          {data.quotes.map((quote) => {
            const pendingQuote = quote.status === "pending";
            const Icon = pendingQuote ? Zap : ShieldCheck;

            return (
              <Card key={quote.id} className="border-border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-5">
                    <div
                      className={
                        pendingQuote
                          ? `grid h-14 w-14 place-items-center rounded-full ${customerTones.icon.blue}`
                          : `grid h-14 w-14 place-items-center rounded-full ${customerTones.icon.emerald}`
                      }
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-semibold text-foreground">{quote.title}</h2>
                        <Badge className={pendingQuote ? customerTones.badge.info : customerTones.badge.success}>
                          {quote.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-muted-foreground">
                        {quote.id} / valid until {formatCustomerPortalDate(quote.validUntil)}
                      </p>
                    </div>
                  </div>
                  <p className="text-3xl font-semibold text-foreground">{formatCustomerPortalCurrency(quote.amount)}</p>
                </div>
                <p className="mt-6 text-sm leading-6 text-muted-foreground">{quote.summary}</p>
                <div className="mt-5 overflow-hidden rounded-lg border border-border">
                  {quote.lineItems.map((item) => (
                    <div key={item.name} className="flex items-center justify-between border-b border-border px-4 py-3 text-sm last:border-b-0">
                      <span>{item.name}</span>
                      <span className="font-medium">{item.quantity} x {formatCustomerPortalCurrency(item.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
                  <p className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    Est. duration<br />{pendingQuote ? "1 day" : "2 visits"}
                  </p>
                  <p className="flex items-center gap-3 text-sm text-muted-foreground">
                    {pendingQuote ? <Wrench className="h-5 w-5 text-muted-foreground" /> : <Heart className="h-5 w-5 text-muted-foreground" />}
                    Category<br />{pendingQuote ? "Electrical" : "Maintenance Plan"}
                  </p>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <CustomerActionButton
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!pendingQuote}
                    feedbackTitle="Quote approval prepared"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve Quote
                  </CustomerActionButton>
                  <CustomerActionButton variant="outline" feedbackTitle="Quote PDF prepared">
                    <FileText className="mr-2 h-4 w-4" />
                    View PDF
                  </CustomerActionButton>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className={`border-emerald-200 p-6 shadow-sm ${customerTones.surface.success}`}>
          <div className="flex items-center gap-5">
            <div className={`grid h-16 w-16 place-items-center rounded-full ${customerTones.icon.emerald}`}>
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Approval protection</h2>
              <p className="mt-1 text-muted-foreground">
                Technicians cannot start quoted extra work until you approve the estimate.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
