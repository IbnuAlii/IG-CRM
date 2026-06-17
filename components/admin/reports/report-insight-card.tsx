"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReportInsightCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  tone: "blue" | "green" | "amber" | "violet";
}) {
  const toneMap = {
    blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/25 dark:text-blue-300",
    green:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/25 dark:text-green-300",
    amber:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/25 dark:text-amber-300",
    violet:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/25 dark:text-violet-300",
  };

  return (
    <div className="rounded-lg border border-border/70 bg-background/90 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>
        <div className={cn("rounded-md border p-2", toneMap[tone])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
