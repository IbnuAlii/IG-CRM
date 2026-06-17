"use client";

import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const toneStyles = {
  blue: "border-blue-200 bg-blue-50/70 text-blue-700 dark:border-blue-900 dark:bg-blue-950/20 dark:text-blue-300",
  green:
    "border-green-200 bg-green-50/70 text-green-700 dark:border-green-900 dark:bg-green-950/20 dark:text-green-300",
  amber:
    "border-amber-200 bg-amber-50/70 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300",
  red: "border-red-200 bg-red-50/70 text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300",
  neutral:
    "border-slate-200 bg-slate-50/70 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300",
};

interface AdminStatCardProps {
  label: string;
  value: string | number;
  description: string;
  trend?: string;
  icon: LucideIcon;
  tone?: keyof typeof toneStyles;
}

export function AdminStatCard({
  label,
  value,
  description,
  trend,
  icon: Icon,
  tone = "blue",
}: AdminStatCardProps) {
  return (
    <Card className="min-w-0 border-border/70 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm leading-5 text-muted-foreground">{label}</p>
          <p className="mt-2 break-words text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
        <div className={cn("shrink-0 rounded-lg border p-2", toneStyles[tone])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {trend ? (
        <p className="mt-4 break-words text-xs font-medium leading-5 text-foreground">
          {trend}
        </p>
      ) : null}
    </Card>
  );
}
