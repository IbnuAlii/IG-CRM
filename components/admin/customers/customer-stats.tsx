"use client";

import { Users } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { AdminCustomerRecord } from "@/types";
import { formatCustomerCurrency } from "./customer-formatters";

export function CustomerStats({
  customers,
  visibleCount,
}: {
  customers: AdminCustomerRecord[];
  visibleCount: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Total Customers"
        value={customers.length}
        description="Profiles in this workspace"
        trend={`${visibleCount} visible after filters`}
        icon={Users}
        tone="blue"
      />
      <AdminStatCard
        label="VIP Accounts"
        value={customers.filter((customer) => customer.status === "vip").length}
        description="High-value customers"
        trend="Prioritize response time"
        icon={Users}
        tone="green"
      />
      <AdminStatCard
        label="Open Customer Jobs"
        value={customers.reduce(
          (total, customer) => total + customer.openJobs,
          0,
        )}
        description="Linked service workload"
        trend="Shown in service history"
        icon={Users}
        tone="amber"
      />
      <AdminStatCard
        label="Lifetime Value"
        value={formatCustomerCurrency(
          customers.reduce(
            (total, customer) => total + customer.lifetimeValue,
            0,
          ),
        )}
        description="Across listed customers"
        trend="Mock frontend calculation"
        icon={Users}
        tone="neutral"
      />
    </div>
  );
}
