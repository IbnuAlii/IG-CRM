"use client";

import { FileText, Mail } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { AdminQuote } from "@/types";
import { formatQuoteCurrency } from "./quote-formatters";

export function QuoteStats({ quotes }: { quotes: AdminQuote[] }) {
  const quoteValue = quotes.reduce((total, quote) => total + quote.total, 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Quote Pipeline"
        value={formatQuoteCurrency(quoteValue)}
        description="Total value across quotes"
        trend={`${quotes.length} active records`}
        icon={FileText}
        tone="blue"
      />
      <AdminStatCard
        label="Accepted"
        value={quotes.filter((quote) => quote.status === "accepted").length}
        description="Ready for job conversion"
        trend="High-priority follow-up"
        icon={FileText}
        tone="green"
      />
      <AdminStatCard
        label="Awaiting Response"
        value={
          quotes.filter((quote) => ["sent", "viewed"].includes(quote.status))
            .length
        }
        description="Sent or viewed by customers"
        trend="Track email and SMS activity"
        icon={Mail}
        tone="amber"
      />
      <AdminStatCard
        label="Expired"
        value={quotes.filter((quote) => quote.status === "expired").length}
        description="Needs renewal or close-out"
        trend="Keep pipeline clean"
        icon={FileText}
        tone="red"
      />
    </div>
  );
}
