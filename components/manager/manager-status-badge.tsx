"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  in_progress: "border-blue-200 bg-blue-50 text-blue-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  at_risk: "border-amber-200 bg-amber-50 text-amber-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  overdue: "border-red-200 bg-red-50 text-red-700",
  inactive: "border-border bg-muted text-foreground",
};

const labels: Record<string, string> = {
  active: "Active",
  approved: "Approved",
  completed: "Completed",
  ready: "Ready",
  in_progress: "In progress",
  pending: "Pending",
  at_risk: "At risk",
  rejected: "Rejected",
  overdue: "Overdue",
  inactive: "Inactive",
};

export function ManagerStatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge variant="outline" className={cn(styles[status] ?? styles.pending, className)}>
      {labels[status] ?? status}
    </Badge>
  );
}
