"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { AdminTicket } from "@/types";
import { formatTicketDetailDateTime } from "./ticket-detail-formatters";

export function TicketConversation({ ticket }: { ticket: AdminTicket }) {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <h2 className="font-semibold">Conversation</h2>
      <div className="mt-4 space-y-3">
        {[
          ["Customer", `Opened ticket: ${ticket.subject}`],
          [ticket.assignedTo, "Acknowledged issue and requested service context."],
          ["System", `SLA due ${formatTicketDetailDateTime(ticket.slaDueAt)}.`],
        ].map(([author, message], index) => (
          <div
            key={`${author}-${index}`}
            className="rounded-lg border border-border p-4"
          >
            <p className="text-sm font-medium">{author}</p>
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        <Textarea rows={4} placeholder="Add internal note or customer-visible response" />
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline">Save Internal Note</Button>
          <Button>Send Update</Button>
        </div>
      </div>
    </Card>
  );
}
