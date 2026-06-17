"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TicketConversation } from "@/components/admin/tickets/ticket-conversation";
import { TicketCustomerContext } from "@/components/admin/tickets/ticket-customer-context";
import { TicketDetailHeader } from "@/components/admin/tickets/ticket-detail-header";
import { TicketDetailStats } from "@/components/admin/tickets/ticket-detail-stats";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();

export default function AdminTicketDetailPage() {
  const params = useParams<{ id: string }>();
  const ticket = data.tickets.find((item) => item.id === params.id);

  if (!ticket) {
    return (
      <div className="w-full py-4 md:py-6">
        <Button variant="ghost" asChild className="mb-3 -ml-3">
          <Link href="/admin/tickets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tickets
          </Link>
        </Button>
        <Card className="p-10 text-center">
          <p className="font-medium">Ticket not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The selected ticket does not exist in the mock Admin data.
          </p>
        </Card>
      </div>
    );
  }

  const customer = data.customers.find((item) => item.id === ticket.customerId);
  const relatedJobs = data.jobs.filter(
    (job) => job.customerId === ticket.customerId,
  );
  const isSlaAtRisk =
    ticket.status !== "resolved" &&
    ticket.slaDueAt <= new Date("2026-05-21T00:00:00");

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <TicketDetailHeader ticket={ticket} isSlaAtRisk={isSlaAtRisk} />
      <TicketDetailStats
        ticket={ticket}
        relatedJobs={relatedJobs}
        isSlaAtRisk={isSlaAtRisk}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <TicketCustomerContext
          ticket={ticket}
          customer={customer}
          relatedJobs={relatedJobs}
        />
        <TicketConversation ticket={ticket} />
      </div>
    </div>
  );
}
