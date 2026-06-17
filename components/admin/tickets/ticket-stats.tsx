"use client";

import { Headphones, TimerReset } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { AdminTicket } from "@/types";

export function TicketStats({
  tickets,
  visibleCount,
}: {
  tickets: AdminTicket[];
  visibleCount: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Total Tickets"
        value={tickets.length}
        description="Customer support records"
        trend={`${visibleCount} visible`}
        icon={Headphones}
        tone="blue"
      />
      <AdminStatCard
        label="Open"
        value={tickets.filter((ticket) => ticket.status === "open").length}
        description="Need first response"
        trend="Monitor SLA"
        icon={Headphones}
        tone="amber"
      />
      <AdminStatCard
        label="Urgent"
        value={tickets.filter((ticket) => ticket.priority === "urgent").length}
        description="Escalation queue"
        trend="Immediate customer follow-up"
        icon={TimerReset}
        tone="red"
      />
      <AdminStatCard
        label="Resolved"
        value={tickets.filter((ticket) => ticket.status === "resolved").length}
        description="Closed out or ready to close"
        trend="Resolution time tracked"
        icon={Headphones}
        tone="green"
      />
    </div>
  );
}
