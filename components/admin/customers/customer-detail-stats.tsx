"use client";

import { BriefcaseBusiness, FileText, Ticket, Users } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type {
  AdminCustomerRecord,
  AdminJob,
  AdminQuote,
  AdminTicket,
} from "@/types";
import { formatCustomerCurrency } from "./customer-formatters";

export function CustomerDetailStats({
  customer,
  jobs,
  quotes,
  tickets,
}: {
  customer: AdminCustomerRecord;
  jobs: AdminJob[];
  quotes: AdminQuote[];
  tickets: AdminTicket[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard label="Lifetime Value" value={formatCustomerCurrency(customer.lifetimeValue)} description="Total account value" trend="Mock rollup" icon={Users} tone="green" />
      <AdminStatCard label="Open Jobs" value={customer.openJobs} description="Active service work" trend={`${jobs.length} linked total`} icon={BriefcaseBusiness} tone="blue" />
      <AdminStatCard label="Quotes" value={quotes.length} description="Pricing history" trend={`${quotes.filter((quote) => quote.status === "accepted").length} accepted`} icon={FileText} tone="amber" />
      <AdminStatCard label="Tickets" value={tickets.length} description="Support history" trend={`${tickets.filter((ticket) => ticket.status !== "resolved").length} active`} icon={Ticket} tone="red" />
    </div>
  );
}
