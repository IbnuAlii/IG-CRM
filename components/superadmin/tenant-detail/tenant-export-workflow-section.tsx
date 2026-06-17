"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TenantExportWorkflowSection() {
  return (
    <Card className="border-border/70 bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
          <Download className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">Tenant Export Workflow</h2>
          <p className="text-sm text-muted-foreground">
            Compliance and migration export controls.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Export format</Label>
          <Input value="Excel, CSV archive, JSON archive" readOnly />
        </div>
        <div className="space-y-2">
          <Label>Last export</Label>
          <Input value="Not requested in mock data" readOnly />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Export scope</Label>
          <Input
            value="CRM records, files, audit trail, system metadata"
            readOnly
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Queue Full Export
        </Button>
        <Button variant="outline">Queue Audit Export</Button>
      </div>
    </Card>
  );
}
