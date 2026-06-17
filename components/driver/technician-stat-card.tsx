"use client";

import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tones = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  purple: "bg-violet-50 text-violet-700",
  red: "bg-red-50 text-red-700",
};

interface TechnicianStatCardProps {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  tone?: keyof typeof tones;
}

export function TechnicianStatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "blue",
}: TechnicianStatCardProps) {
  return (
    <Card className="border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-lg", tones[tone])}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>
      </div>
    </Card>
  );
}
