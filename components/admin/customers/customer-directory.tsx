"use client";

import Link from "next/link";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AdminCustomerRecord } from "@/types";
import {
  formatCustomerCurrency,
  formatCustomerDate,
} from "./customer-formatters";

export function CustomerDirectory({
  customers,
}: {
  customers: AdminCustomerRecord[];
}) {
  const columns: DataTableColumn<AdminCustomerRecord>[] = [
    {
      id: "customer",
      header: "Customer",
      accessorFn: (customer) => customer.name,
      cell: (customer) => (
        <div>
          <p className="font-medium">{customer.name}</p>
          <p className="text-xs text-muted-foreground">
            {customer.company ?? "Individual"}
          </p>
        </div>
      ),
      exportValue: (customer) =>
        `${customer.name}${customer.company ? ` (${customer.company})` : ""}`,
    },
    {
      id: "contact",
      header: "Contact",
      accessorFn: (customer) => `${customer.email} ${customer.phone}`,
      cell: (customer) => (
        <div>
          <p>{customer.email}</p>
          <p className="text-xs text-muted-foreground">{customer.phone}</p>
        </div>
      ),
      exportValue: (customer) => `${customer.email} / ${customer.phone}`,
    },
    {
      id: "status",
      header: "Status",
      align: "center",
      accessorFn: (customer) => customer.status,
      cell: (customer) => <AdminStatusBadge status={customer.status} />,
    },
    {
      id: "tags",
      header: "Tags",
      accessorFn: (customer) => customer.tags.join(" "),
      cell: (customer) => (
        <div className="flex flex-wrap justify-center gap-1">
          {customer.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      ),
      align: "center",
    },
    {
      id: "openJobs",
      header: "Open Jobs",
      accessorFn: (customer) => customer.openJobs,
      cell: (customer) => customer.openJobs,
      align: "center",
    },
    {
      id: "lifetimeValue",
      header: "Lifetime Value",
      accessorFn: (customer) => customer.lifetimeValue,
      cell: (customer) => formatCustomerCurrency(customer.lifetimeValue),
      exportValue: (customer) => customer.lifetimeValue,
      align: "right",
    },
    {
      id: "lastService",
      header: "Last Service",
      accessorFn: (customer) => customer.lastServiceAt?.getTime() ?? 0,
      cell: (customer) => formatCustomerDate(customer.lastServiceAt),
      exportValue: (customer) => formatCustomerDate(customer.lastServiceAt),
      align: "center",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      align: "center",
      cell: (customer) => (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/customers/${customer.id}`}>View</Link>
          </Button>
          <Button variant="outline" size="sm">
            Quote
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Customer Directory</h2>
        <p className="text-sm text-muted-foreground">
          Search name, email, phone, company, status, and tags.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={customers}
        getRowKey={(customer) => customer.id}
        getRowHref={(customer) => `/admin/customers/${customer.id}`}
        emptyMessage="No customers match these filters."
        features={{
          sorting: true,
          globalFilter: true,
          pagination: true,
          columnVisibility: true,
          export: true,
          rowSelection: true,
        }}
        searchPlaceholder="Search customers..."
        exportFileName="admin-customers.csv"
      />
    </Card>
  );
}
