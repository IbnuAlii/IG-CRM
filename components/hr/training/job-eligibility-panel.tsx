"use client";

import { ShieldCheck, ShieldX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { HRJobEligibilityRecord } from "@/components/hr/hr-data";

export function JobEligibilityPanel({
  records,
}: {
  records: HRJobEligibilityRecord[];
}) {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Job Eligibility</h2>
        <p className="text-sm text-muted-foreground">
          Certification requirements linked to job assignment eligibility.
        </p>
      </div>
      <div className="space-y-4">
        {records.map((record) => (
          <div
            key={record.id}
            className="rounded-lg border border-border/70 bg-background p-4"
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{record.jobType}</p>
                <p className="text-xs text-muted-foreground">
                  Requires {record.requiredCertification}
                </p>
              </div>
              <Badge variant={record.blockedEmployees.length > 0 ? "default" : "secondary"}>
                {record.eligibleEmployees.length} eligible
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-emerald-200">
                <div className="mb-2 flex items-center gap-2 font-medium">
                  <ShieldCheck className="h-4 w-4" />
                  Eligible
                </div>
                <p>{record.eligibleEmployees.join(", ") || "None"}</p>
              </div>
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/25 dark:text-red-200">
                <div className="mb-2 flex items-center gap-2 font-medium">
                  <ShieldX className="h-4 w-4" />
                  Blocked
                </div>
                <p>{record.blockedEmployees.join(", ") || "None"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
