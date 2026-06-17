"use client";

import { HardDrive } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CrmTenant } from "@/types";

export function PlanLimitsSection({
  tenant,
  maxUsers,
  maxStorage,
}: {
  tenant: CrmTenant;
  maxUsers: string;
  maxStorage: string;
}) {
  return (
    <Card className="border-border/70 bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
          <HardDrive className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">Plan Limits</h2>
          <p className="text-sm text-muted-foreground">
            Plan-based quota controls from tenant metadata.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-border/70 bg-background p-4 shadow-xs">
          <p className="text-xs text-muted-foreground">Max users</p>
          <p className="mt-1 text-xl font-semibold">{maxUsers}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-background p-4 shadow-xs">
          <p className="text-xs text-muted-foreground">Storage</p>
          <p className="mt-1 text-xl font-semibold">{maxStorage}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-background p-4 shadow-xs">
          <p className="text-xs text-muted-foreground">Current users</p>
          <p className="mt-1 text-xl font-semibold">{tenant.usersCount}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Data residency</Label>
          <Input value="US-East / AWS RDS" readOnly />
        </div>
        <div className="space-y-2">
          <Label>Backup policy</Label>
          <Input value="Daily snapshots, 30-day retention" readOnly />
        </div>
      </div>
    </Card>
  );
}
