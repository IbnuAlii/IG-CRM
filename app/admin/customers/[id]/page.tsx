"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CustomerActivityTimeline } from "@/components/admin/customers/customer-activity-timeline";
import { CustomerDetailHeader } from "@/components/admin/customers/customer-detail-header";
import { CustomerDetailStats } from "@/components/admin/customers/customer-detail-stats";
import { CustomerProfileCard } from "@/components/admin/customers/customer-profile-card";
import { CustomerRelatedTabs } from "@/components/admin/customers/customer-related-tabs";
import { RouteEmptyState } from "@/components/common/route-empty-state";
import { Button } from "@/components/ui/button";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();

export default function AdminCustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const customer = data.customers.find((item) => item.id === params.id);

  if (!customer) {
    return (
      <div className="w-full py-4 md:py-6">
        <Button variant="ghost" asChild className="mb-3 -ml-3">
          <Link href="/admin/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Link>
        </Button>
        <RouteEmptyState
          title="Customer not found"
          description="The selected customer does not exist in the mock Admin data."
        />
      </div>
    );
  }

  const jobs = data.jobs.filter((job) => job.customerId === customer.id);
  const quotes = data.quotes.filter((quote) => quote.customerId === customer.id);
  const tickets = data.tickets.filter(
    (ticket) => ticket.customerId === customer.id,
  );

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <CustomerDetailHeader customer={customer} />
      <CustomerDetailStats
        customer={customer}
        jobs={jobs}
        quotes={quotes}
        tickets={tickets}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <CustomerProfileCard customer={customer} />
        <CustomerActivityTimeline customer={customer} />
      </div>
      <CustomerRelatedTabs
        customer={customer}
        jobs={jobs}
        quotes={quotes}
        tickets={tickets}
      />
    </div>
  );
}
