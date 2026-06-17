"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Paperclip } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Button } from "@/components/ui/button";
import type { AdminTicket } from "@/types";

export function TicketDetailHeader({
  ticket,
  isSlaAtRisk,
}: {
  ticket: AdminTicket;
  isSlaAtRisk: boolean;
}) {
  return (
    <div>
      <Button variant="ghost" asChild className="mb-3 -ml-3">
        <Link href="/admin/tickets">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tickets
        </Link>
      </Button>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {ticket.ticketNumber}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {ticket.subject} - {ticket.customerName}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <AdminStatusBadge status={ticket.status} />
            <AdminStatusBadge status={ticket.priority} />
            {isSlaAtRisk ? <AdminStatusBadge status="urgent" /> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Email Customer
          </Button>
          <Button variant="outline">
            <Paperclip className="mr-2 h-4 w-4" />
            Attach
          </Button>
          <Button>Mark Resolved</Button>
        </div>
      </div>
    </div>
  );
}
