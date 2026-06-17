"use client";

import { CheckCircle2, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DatabaseIsolationSection({
  tenantId,
  tenantDatabaseName,
  tenantDatabaseHost,
}: {
  tenantId: string;
  tenantDatabaseName: string;
  tenantDatabaseHost: string;
}) {
  return (
    <Card className="border-border/70 bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
          <Database className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">Database and Isolation</h2>
          <p className="text-sm text-muted-foreground">
            Database-per-tenant routing metadata.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Frappe site / database</Label>
          <Input value={tenantDatabaseName} readOnly />
        </div>
        <div className="space-y-2">
          <Label>Database host</Label>
          <Input value={tenantDatabaseHost} readOnly />
        </div>
        <div className="space-y-2">
          <Label>Tenant routing key</Label>
          <Input value={tenantId} readOnly />
        </div>
        <div className="space-y-2">
          <Label>Isolation model</Label>
          <Input value="Dedicated Frappe site / MariaDB database" readOnly />
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-muted/70 p-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <p className="text-sm font-medium">
            Cross-tenant access blocked by routing context
          </p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Backend enforcement still belongs in the API permission layer and
          tenant database router.
        </p>
      </div>
    </Card>
  );
}
