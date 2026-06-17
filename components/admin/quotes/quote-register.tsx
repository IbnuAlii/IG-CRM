"use client";

import Link from "next/link";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AdminQuote } from "@/types";
import { formatQuoteCurrency, formatQuoteDate } from "./quote-formatters";

export function QuoteRegister({
  quotes,
  onSend,
  onConvert,
}: {
  quotes: AdminQuote[];
  onSend: (quote: AdminQuote) => void;
  onConvert: (quote: AdminQuote) => void;
}) {
  const columns: DataTableColumn<AdminQuote>[] = [
    {
      id: "quote",
      header: "Quote",
      accessorFn: (quote) => `${quote.quoteNumber} ${quote.serviceType}`,
      cell: (quote) => (
        <div>
          <p className="font-medium">{quote.quoteNumber}</p>
          <p className="text-xs text-muted-foreground">{quote.serviceType}</p>
        </div>
      ),
      exportValue: (quote) => `${quote.quoteNumber} - ${quote.serviceType}`,
    },
    {
      id: "customer",
      header: "Customer",
      accessorFn: (quote) => quote.customerName,
      cell: (quote) => quote.customerName,
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (quote) => quote.status,
      cell: (quote) => <AdminStatusBadge status={quote.status} />,
      align: "center",
    },
    {
      id: "owner",
      header: "Owner",
      accessorFn: (quote) => quote.assignedTo,
      cell: (quote) => quote.assignedTo,
    },
    {
      id: "total",
      header: "Total",
      accessorFn: (quote) => quote.total,
      cell: (quote) => formatQuoteCurrency(quote.total),
      exportValue: (quote) => quote.total,
      align: "right",
    },
    {
      id: "validUntil",
      header: "Valid Until",
      accessorFn: (quote) => quote.validUntil.getTime(),
      cell: (quote) => formatQuoteDate(quote.validUntil),
      exportValue: (quote) => formatQuoteDate(quote.validUntil),
      align: "center",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      align: "center",
      cell: (quote) => (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/quotes/${quote.id}`}>View</Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => onSend(quote)}>
            Send
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={quote.status !== "accepted"}
            onClick={() => onConvert(quote)}
          >
            Convert
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Quote Register</h2>
        <p className="text-sm text-muted-foreground">
          Search quotes by number, customer, service type, owner, and status.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={quotes}
        getRowKey={(quote) => quote.id}
        getRowHref={(quote) => `/admin/quotes/${quote.id}`}
        emptyMessage="No quotes match these filters."
        features={{
          sorting: true,
          globalFilter: true,
          pagination: true,
          columnVisibility: true,
          export: true,
          rowSelection: true,
        }}
        searchPlaceholder="Search quotes..."
        exportFileName="admin-quotes.csv"
      />
    </Card>
  );
}
