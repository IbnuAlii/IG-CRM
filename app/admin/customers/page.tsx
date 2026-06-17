"use client";

import { useEffect, useMemo, useState } from "react";
import { Users } from "lucide-react";
import { RouteEmptyState } from "@/components/common/route-empty-state";
import { RouteLoadingSkeleton } from "@/components/common/route-loading-skeleton";
import { Download, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AddCustomerDialog } from "@/components/admin/customers/add-customer-dialog";
import { CustomerDirectory } from "@/components/admin/customers/customer-directory";
import { CustomerFilters } from "@/components/admin/customers/customer-filters";
import { CustomerStats } from "@/components/admin/customers/customer-stats";
import { RecentCustomerActivity } from "@/components/admin/customers/recent-customer-activity";
import { Button } from "@/components/ui/button";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();

export default function AdminCustomersPage() {
  const [status, setStatus] = useState("all");
  const [tag, setTag] = useState("all");
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 350);
    return () => window.clearTimeout(timer);
  }, []);

  const customers = data.customers;
  const tags = Array.from(new Set(customers.flatMap((customer) => customer.tags)));

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesStatus = status === "all" || customer.status === status;
      const matchesTag = tag === "all" || customer.tags.includes(tag);
      return matchesStatus && matchesTag;
    });
  }, [customers, status, tag]);

  if (!ready) {
    return <RouteLoadingSkeleton variant="table" />;
  }

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Customers"
        description="Create profiles, manage statuses and tags, track service history, and prepare jobs or quotes from customer records."
        actions={
          <>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
            <Button onClick={() => setAddCustomerOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Customer
            </Button>
          </>
        }
      />

      <CustomerStats customers={customers} visibleCount={filteredCustomers.length} />
      <CustomerFilters
        status={status}
        setStatus={setStatus}
        tag={tag}
        setTag={setTag}
        tags={tags}
      />
      {filteredCustomers.length === 0 ? (
        <RouteEmptyState
          icon={Users}
          title="No customers found"
          description="Adjust filters or create a new customer to get started."
          actionLabel="New Customer"
          onAction={() => setAddCustomerOpen(true)}
        />
      ) : (
        <CustomerDirectory customers={filteredCustomers} />
      )}
      <RecentCustomerActivity customers={customers} />

      <AddCustomerDialog
        open={addCustomerOpen}
        onOpenChange={setAddCustomerOpen}
      />
    </div>
  );
}
