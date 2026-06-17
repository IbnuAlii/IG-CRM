"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  settled: "border-emerald-200 bg-emerald-50 text-emerald-700",
  ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  sent: "border-blue-200 bg-blue-50 text-blue-700",
  processing: "border-blue-200 bg-blue-50 text-blue-700",
  scheduled: "border-blue-200 bg-blue-50 text-blue-700",
  draft: "border-border bg-muted text-foreground",
  void: "border-border bg-muted text-foreground",
  overdue: "border-red-200 bg-red-50 text-red-700",
  failed: "border-red-200 bg-red-50 text-red-700",
  refunded: "border-amber-200 bg-amber-50 text-amber-700",
};

const labels: Record<string, string> = {
  paid: "Paid",
  settled: "Settled",
  ready: "Ready",
  sent: "Sent",
  processing: "Processing",
  scheduled: "Scheduled",
  draft: "Draft",
  void: "Void",
  overdue: "Overdue",
  failed: "Failed",
  refunded: "Refunded",
};

export function AccountantStatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge variant="outline" className={cn(styles[status] ?? styles.draft, className)}>
      {labels[status] ?? status}
    </Badge>
  );
}
