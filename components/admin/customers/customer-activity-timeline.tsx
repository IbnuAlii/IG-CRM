"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { AdminCustomerRecord } from "@/types";
import { formatCustomerDate } from "./customer-formatters";

export function CustomerActivityTimeline({
  customer,
}: {
  customer: AdminCustomerRecord;
}) {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <h2 className="font-semibold">Activity Timeline</h2>
      <div className="mt-4 space-y-3">
        {customer.activity.length > 0 ? (
          customer.activity.map((activity) => (
            <div key={activity.id} className="rounded-lg border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                <Badge variant="outline">{activity.type}</Badge>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {formatCustomerDate(activity.happenedAt)}
              </p>
            </div>
          ))
        ) : (
          <p className="rounded-lg border border-border p-6 text-sm text-muted-foreground">
            No activity has been recorded for this customer yet.
          </p>
        )}
      </div>
    </Card>
  );
}
