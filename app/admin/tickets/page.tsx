"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TicketFilters } from "@/components/admin/tickets/ticket-filters";
import { TicketQueue } from "@/components/admin/tickets/ticket-queue";
import { TicketStats } from "@/components/admin/tickets/ticket-stats";
import { TicketWorkflowDialog } from "@/components/admin/tickets/ticket-workflow-dialog";
import { Button } from "@/components/ui/button";
import { generateAdminDashboardData } from "@/lib/mock-data";
import type { AdminTicket } from "@/types";

const data = generateAdminDashboardData();

export default function AdminTicketsPage() {
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(null);

  const tickets = data.tickets;
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesStatus = status === "all" || ticket.status === status;
      const matchesPriority = priority === "all" || ticket.priority === priority;
      return matchesStatus && matchesPriority;
    });
  }, [priority, status, tickets]);

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Tickets"
        description="Track customer complaints, SLA risk, priority, assignment, comments, and resolution time."
        actions={
          <Button
            onClick={() => {
              setSelectedTicket(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Ticket
          </Button>
        }
      />

      <TicketStats tickets={tickets} visibleCount={filteredTickets.length} />
      <TicketFilters
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
      />
      <TicketQueue
        tickets={filteredTickets}
        onUpdate={(ticket) => {
          setSelectedTicket(ticket);
          setDialogOpen(true);
        }}
      />

      <TicketWorkflowDialog
        ticket={selectedTicket}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
