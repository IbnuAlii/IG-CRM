"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AdminCustomerRecord, AdminQuote } from "@/types";
import { formatQuoteCurrency } from "./quote-formatters";

export function QuoteDocumentCard({
  quote,
  customer,
}: {
  quote: AdminQuote;
  customer?: AdminCustomerRecord;
}) {
  return (
    <Card className="border-border/70 bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">From</p>
          <h2 className="mt-1 text-xl font-semibold">
            Northstar HVAC Services
          </h2>
          <p className="text-sm text-muted-foreground">
            9 E 40th St, New York, NY
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm text-muted-foreground">To</p>
          <h2 className="mt-1 text-xl font-semibold">{quote.customerName}</h2>
          <p className="text-sm text-muted-foreground">{customer?.email}</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-[1fr_80px_130px_130px] gap-3 border-b border-border bg-muted/30 p-3 text-xs font-medium uppercase text-muted-foreground">
          <span>Description</span>
          <span className="text-center">Qty</span>
          <span className="text-right">Unit</span>
          <span className="text-right">Amount</span>
        </div>
        {quote.lineItems.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[1fr_80px_130px_130px] gap-3 border-b border-border p-3 text-sm last:border-b-0"
          >
            <span>{item.description}</span>
            <span className="text-center">{item.quantity}</span>
            <span className="text-right">
              {formatQuoteCurrency(item.unitPrice)}
            </span>
            <span className="text-right font-medium">
              {formatQuoteCurrency(item.quantity * item.unitPrice)}
            </span>
          </div>
        ))}
      </div>

      <div className="ml-auto mt-6 max-w-sm space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatQuoteCurrency(quote.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>{formatQuoteCurrency(quote.tax)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatQuoteCurrency(quote.total)}</span>
        </div>
      </div>
    </Card>
  );
}
