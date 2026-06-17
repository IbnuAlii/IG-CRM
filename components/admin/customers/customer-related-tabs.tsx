"use client";

import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  AdminCustomerRecord,
  AdminJob,
  AdminQuote,
  AdminTicket,
} from "@/types";
import {
  formatCustomerCurrency,
  formatCustomerDate,
} from "./customer-formatters";

export function CustomerRelatedTabs({
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
  const jobColumns: DataTableColumn<AdminJob>[] = [
    {
      id: "job",
      header: "Job",
      accessorFn: (job) => `${job.jobNumber} ${job.serviceType}`,
      cell: (job) => (
        <div>
          <p className="font-medium">{job.jobNumber}</p>
          <p className="text-xs text-muted-foreground">{job.serviceType}</p>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (job) => job.status,
      cell: (job) => <AdminStatusBadge status={job.status} />,
      align: "center",
    },
    {
      id: "technician",
      header: "Technician",
      accessorFn: (job) => job.technicianName ?? "Unassigned",
      cell: (job) => job.technicianName ?? "Unassigned",
    },
    {
      id: "scheduled",
      header: "Scheduled",
      accessorFn: (job) => job.scheduledStart.getTime(),
      cell: (job) => formatCustomerDate(job.scheduledStart),
      align: "center",
    },
  ];

  const quoteColumns: DataTableColumn<AdminQuote>[] = [
    {
      id: "quote",
      header: "Quote",
      accessorFn: (quote) => quote.quoteNumber,
      cell: (quote) => quote.quoteNumber,
    },
    {
      id: "service",
      header: "Service",
      accessorFn: (quote) => quote.serviceType,
      cell: (quote) => quote.serviceType,
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (quote) => quote.status,
      cell: (quote) => <AdminStatusBadge status={quote.status} />,
      align: "center",
    },
    {
      id: "total",
      header: "Total",
      accessorFn: (quote) => quote.total,
      cell: (quote) => formatCustomerCurrency(quote.total),
      align: "right",
    },
  ];

  const ticketColumns: DataTableColumn<AdminTicket>[] = [
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
  ];

  return (
    <Tabs defaultValue="jobs" className="space-y-4">
      <TabsList>
        <TabsTrigger value="jobs">Service History</TabsTrigger>
        <TabsTrigger value="quotes">Quotes</TabsTrigger>
        <TabsTrigger value="tickets">Tickets</TabsTrigger>
      </TabsList>
      <TabsContent value="jobs">
        <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
          <DataTable
            columns={jobColumns}
            data={jobs}
            getRowKey={(job) => job.id}
            getRowHref={(job) => `/admin/jobs/${job.id}`}
            emptyMessage="No jobs are linked to this customer."
            features={{ sorting: true, globalFilter: true, pagination: true, columnVisibility: true, export: true }}
            searchPlaceholder="Search service history..."
            exportFileName={`${customer.id}-jobs.csv`}
          />
        </Card>
      </TabsContent>
      <TabsContent value="quotes">
        <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
          <DataTable
            columns={quoteColumns}
            data={quotes}
            getRowKey={(quote) => quote.id}
            getRowHref={(quote) => `/admin/quotes/${quote.id}`}
            emptyMessage="No quotes are linked to this customer."
            features={{ sorting: true, globalFilter: true, pagination: true, columnVisibility: true, export: true }}
            searchPlaceholder="Search quotes..."
            exportFileName={`${customer.id}-quotes.csv`}
          />
        </Card>
      </TabsContent>
      <TabsContent value="tickets">
        <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
          <DataTable
            columns={ticketColumns}
            data={tickets}
            getRowKey={(ticket) => ticket.id}
            getRowHref={(ticket) => `/admin/tickets/${ticket.id}`}
            emptyMessage="No tickets are linked to this customer."
            features={{ sorting: true, globalFilter: true, pagination: true, columnVisibility: true, export: true }}
            searchPlaceholder="Search tickets..."
            exportFileName={`${customer.id}-tickets.csv`}
          />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
