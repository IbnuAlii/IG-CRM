"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function HRPagePlaceholder({
  title,
  description,
  icon: Icon,
  requirements,
  phase,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  requirements: string[];
  phase: string;
}) {
  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader title={title} description={description} />

      <Card className="border-border/70 bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h2 className="font-semibold">Planned Workflow</h2>
                <Badge variant="outline" className="bg-background">
                  {phase}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                This route is scaffolded for the next HR implementation slice and will reuse the employee records, attendance, leave, and payroll data shapes.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {requirements.map((requirement) => (
            <div
              key={requirement}
              className="flex items-start gap-3 rounded-lg border border-border/70 bg-background p-3 text-sm"
            >
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{requirement}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
