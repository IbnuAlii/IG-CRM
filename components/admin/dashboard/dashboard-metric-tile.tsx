"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardMetricTile({
  label,
  value,
  detail,
  icon: Icon,
  tone,
  href,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  tone: "blue" | "green" | "amber" | "red" | "cyan";
  href: string;
}) {
  const toneMap = {
    blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/25 dark:text-blue-300",
    green:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/25 dark:text-green-300",
    amber:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/25 dark:text-amber-300",
    red: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/25 dark:text-red-300",
    cyan: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/25 dark:text-cyan-300",
  };

  return (
    <Link
      href={href}
      className="group min-w-0 rounded-lg border border-border/70 bg-background/92 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 break-words text-2xl font-semibold text-foreground">
            {value}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {detail}
          </p>
        </div>
        <div className={cn("shrink-0 rounded-md border p-2", toneMap[tone])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">
        Open workspace
        <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
      </div>
    </Link>
  );
}
