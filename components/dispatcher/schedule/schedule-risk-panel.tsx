"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { getScheduleRisks } from "./schedule-utils";

type ScheduleRisk = ReturnType<typeof getScheduleRisks>[number];

const toneStyles: Record<ScheduleRisk["tone"], string> = {
  amber: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/25 dark:text-amber-200",
  red: "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/25 dark:text-red-200",
  blue: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/25 dark:text-blue-200",
};

export function ScheduleRiskPanel({ risks }: { risks: ScheduleRisk[] }) {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Conflict Checks</h2>
          <p className="text-sm text-muted-foreground">
            Mock validation for overlaps, leave conflicts, and capacity.
          </p>
        </div>
        <Badge variant="outline" className="bg-background">
          {risks.length} signal{risks.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <div className="space-y-3">
        {risks.map((risk) => {
          const Icon = risk.tone === "blue" ? CheckCircle2 : AlertTriangle;

          return (
            <div
              key={risk.id}
              className={cn("rounded-lg border p-4", toneStyles[risk.tone])}
            >
              <div className="flex gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-medium">{risk.title}</p>
                  <p className="mt-1 text-sm opacity-85">{risk.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
