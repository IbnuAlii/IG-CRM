"use client";

import Link from "next/link";
import { ArrowLeft, Download, Mail, Printer } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Button } from "@/components/ui/button";
import type { AdminQuote } from "@/types";

export function QuoteDetailHeader({ quote }: { quote: AdminQuote }) {
  return (
    <div>
      <Button variant="ghost" asChild className="mb-3 -ml-3">
        <Link href="/admin/quotes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Quotes
        </Link>
      </Button>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {quote.quoteNumber}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {quote.serviceType} for {quote.customerName}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <AdminStatusBadge status={quote.status} />
            <AdminStatusBadge
              status={quote.validUntil < new Date() ? "expired" : "active"}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
