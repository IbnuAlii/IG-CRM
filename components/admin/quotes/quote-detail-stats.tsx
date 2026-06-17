"use client";

import { BriefcaseBusiness, Download, Mail } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { AdminJob, AdminQuote } from "@/types";
import { formatQuoteCurrency, formatQuoteDate } from "./quote-formatters";

export function QuoteDetailStats({
  quote,
  linkedJob,
}: {
  quote: AdminQuote;
  linkedJob?: AdminJob;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard label="Total" value={formatQuoteCurrency(quote.total)} description="Including tax" trend={`${formatQuoteCurrency(quote.subtotal)} subtotal`} icon={Download} tone="green" />
      <AdminStatCard label="Valid Until" value={formatQuoteDate(quote.validUntil)} description="Quote expiration date" trend="Customer-facing deadline" icon={Mail} tone="amber" />
      <AdminStatCard label="Owner" value={quote.assignedTo} description="Internal sales owner" trend="Receives view/accept alerts" icon={Mail} tone="blue" />
      <AdminStatCard label="Linked Job" value={linkedJob ? linkedJob.jobNumber : "None"} description="Conversion status" trend={linkedJob ? "Converted to dispatch" : "Awaiting conversion"} icon={BriefcaseBusiness} tone={linkedJob ? "green" : "neutral"} />
    </div>
  );
}
