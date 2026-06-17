"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Mail, Plus, Tag } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminCustomerRecord } from "@/types";
import { formatCustomerDate } from "./customer-formatters";

export function CustomerDetailHeader({
  customer,
}: {
  customer: AdminCustomerRecord;
}) {
  return (
    <div>
      <Button variant="ghost" asChild className="mb-3 -ml-3">
        <Link href="/admin/customers">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Link>
      </Button>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {customer.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {customer.company ?? "Individual customer"} - Created{" "}
            {formatCustomerDate(customer.createdAt)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <AdminStatusBadge status={customer.status} />
            {customer.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                <Tag className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/quotes">
              <FileText className="mr-2 h-4 w-4" />
              New Quote
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/jobs">
              <Plus className="mr-2 h-4 w-4" />
              New Job
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
