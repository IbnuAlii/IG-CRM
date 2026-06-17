"use client";

import { Card } from "@/components/ui/card";
import type { AdminCustomerRecord } from "@/types";

export function RecentCustomerActivity({
  customers,
}: {
  customers: AdminCustomerRecord[];
}) {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <h2 className="font-semibold">Recent Customer Activity</h2>
      <div className="mt-4 grid gap-3">
        {customers
          .flatMap((customer) =>
            customer.activity.map((activity) => ({ customer, activity })),
          )
          .slice(0, 4)
          .map(({ customer, activity }) => (
            <div key={activity.id} className="rounded-lg border border-border p-4">
              <p className="font-medium">{activity.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {customer.name}: {activity.description}
              </p>
            </div>
          ))}
      </div>
    </Card>
  );
}
