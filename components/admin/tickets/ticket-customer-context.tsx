"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AdminCustomerRecord, AdminJob, AdminTicket } from "@/types";

export function TicketCustomerContext({
  ticket,
  customer,
  relatedJobs,
}: {
  ticket: AdminTicket;
  customer?: AdminCustomerRecord;
  relatedJobs: AdminJob[];
}) {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <h2 className="font-semibold">Customer Context</h2>
      <div className="mt-4 space-y-4 text-sm">
        <div>
          <p className="font-medium">Customer</p>
          <Button variant="link" asChild className="h-auto p-0">
            <Link href={`/admin/customers/${ticket.customerId}`}>
              {ticket.customerName}
            </Link>
          </Button>
        </div>
        <div>
          <p className="font-medium">Email</p>
          <p className="mt-1 text-muted-foreground">{customer?.email}</p>
        </div>
        <div>
          <p className="font-medium">Phone</p>
          <p className="mt-1 text-muted-foreground">{customer?.phone}</p>
        </div>
        <Separator />
        <div>
          <p className="font-medium">Recent jobs</p>
          <div className="mt-2 space-y-2">
            {relatedJobs.slice(0, 3).map((job) => (
              <Link
                key={job.id}
                href={`/admin/jobs/${job.id}`}
                className="block rounded-lg border border-border p-3 text-sm hover:bg-accent"
              >
                <span className="font-medium">{job.jobNumber}</span>
                <span className="text-muted-foreground">
                  {" "}
                  - {job.serviceType}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
