"use client";

import Link from "next/link";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AdminTicket } from "@/types";
import { formatTicketDateTime } from "./ticket-formatters";

export function TicketQueue({
  tickets,
  onUpdate,
}: {
  tickets: AdminTicket[];
  onUpdate: (ticket: AdminTicket) => void;
}) {
  const columns: DataTableColumn<AdminTicket>[] = [
    {
      id: "ticket",
      header: "Ticket",
      accessorFn: (ticket) => `${ticket.ticketNumber} ${ticket.subject}`,
      cell: (ticket) => (
        <div>
          <p className="font-medium">{ticket.ticketNumber}</p>
          <p className="text-xs text-muted-foreground">{ticket.subject}</p>
        </div>
      ),
      exportValue: (ticket) => `${ticket.ticketNumber} - ${ticket.subject}`,
    },
    {
      id: "customer",
      header: "Customer",
      accessorFn: (ticket) => ticket.customerName,
      cell: (ticket) => ticket.customerName,
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (ticket) => ticket.status,
      cell: (ticket) => <AdminStatusBadge status={ticket.status} />,
      align: "center",
    },
    {
      id: "priority",
      header: "Priority",
      accessorFn: (ticket) => ticket.priority,
      cell: (ticket) => <AdminStatusBadge status={ticket.priority} />,
      align: "center",
    },
    {
      id: "assignedTo",
      header: "Assigned",
      accessorFn: (ticket) => ticket.assignedTo,
      cell: (ticket) => ticket.assignedTo,
    },
    {
      id: "sla",
      header: "SLA Due",
      accessorFn: (ticket) => ticket.slaDueAt.getTime(),
      cell: (ticket) => formatTicketDateTime(ticket.slaDueAt),
      exportValue: (ticket) => formatTicketDateTime(ticket.slaDueAt),
      align: "center",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      align: "center",
      cell: (ticket) => (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/tickets/${ticket.id}`}>View</Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => onUpdate(ticket)}>
            Update
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Ticket Queue</h2>
        <p className="text-sm text-muted-foreground">
          Search ticket number, subject, customer, assignee, status, and
          priority.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={tickets}
        getRowKey={(ticket) => ticket.id}
        getRowHref={(ticket) => `/admin/tickets/${ticket.id}`}
        emptyMessage="No tickets match these filters."
        features={{
          sorting: true,
          globalFilter: true,
          pagination: true,
          columnVisibility: true,
          export: true,
          rowSelection: true,
        }}
        searchPlaceholder="Search tickets..."
        exportFileName="admin-tickets.csv"
      />
    </Card>
  );
}
