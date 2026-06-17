"use client";

import { Clock, MessageSquare, UserCheck } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { AdminJob, AdminTicket } from "@/types";
import { formatTicketDetailDateTime } from "./ticket-detail-formatters";

export function TicketDetailStats({
  ticket,
  relatedJobs,
  isSlaAtRisk,
}: {
  ticket: AdminTicket;
  relatedJobs: AdminJob[];
  isSlaAtRisk: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard label="Priority" value={ticket.priority.toUpperCase()} description="Customer impact level" trend="Controls SLA urgency" icon={Clock} tone={ticket.priority === "urgent" ? "red" : "amber"} />
      <AdminStatCard label="SLA Due" value={formatTicketDetailDateTime(ticket.slaDueAt)} description="Resolution target" trend={isSlaAtRisk ? "At risk" : "On track"} icon={Clock} tone={isSlaAtRisk ? "red" : "green"} />
      <AdminStatCard label="Assigned" value={ticket.assignedTo} description="Internal owner" trend="Responsible for next update" icon={UserCheck} tone="blue" />
      <AdminStatCard label="Related Jobs" value={relatedJobs.length} description="Same customer jobs" trend="Useful support context" icon={MessageSquare} tone="neutral" />
    </div>
  );
}
