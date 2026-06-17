"use client";

import { CalendarClock, Clock, FileText, UserCheck } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { AdminEmployee, AdminJob, AdminQuote, AdminTicket } from "@/types";
import { formatJobDetailDateTime } from "./job-detail-formatters";

export function JobDetailStats({
  job,
  technician,
  quote,
  relatedTickets,
}: {
  job: AdminJob;
  technician?: AdminEmployee;
  quote?: AdminQuote;
  relatedTickets: AdminTicket[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard label="Scheduled" value={formatJobDetailDateTime(job.scheduledStart)} description="Customer appointment" trend={`${job.estimatedDurationMinutes} min estimate`} icon={CalendarClock} tone="blue" />
      <AdminStatCard label="Technician" value={job.technicianName ?? "Unassigned"} description="Primary assignee" trend={technician?.currentLocation ?? "Dispatch required"} icon={UserCheck} tone={technician ? "green" : "amber"} />
      <AdminStatCard label="Quote Link" value={quote?.quoteNumber ?? "None"} description="Original pricing source" trend={quote ? "Pre-filled from quote" : "Created manually"} icon={FileText} tone={quote ? "green" : "neutral"} />
      <AdminStatCard label="Related Tickets" value={relatedTickets.length} description="Same customer support records" trend="Customer context" icon={Clock} tone={relatedTickets.length ? "amber" : "neutral"} />
    </div>
  );
}
