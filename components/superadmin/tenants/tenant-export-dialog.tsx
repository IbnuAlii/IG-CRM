"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CrmTenant } from "@/types";
import { Download } from "lucide-react";

interface TenantExportDialogProps {
  tenant: CrmTenant | null;
  onClose: () => void;
}

export function TenantExportDialog({ tenant, onClose }: TenantExportDialogProps) {
  return (
    <Dialog open={!!tenant} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Tenant Data</DialogTitle>
          <DialogDescription>
            Prepare a scoped tenant export for compliance or migration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border p-4">
            <p className="font-medium">{tenant?.name}</p>
            <p className="text-sm text-muted-foreground">
              {tenant?.subdomain}.crm.example.com
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Export format</Label>
              <Select defaultValue="xlsx">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xlsx">Excel workbook</SelectItem>
                  <SelectItem value="csv">CSV archive</SelectItem>
                  <SelectItem value="json">JSON archive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Data scope</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tenant data</SelectItem>
                  <SelectItem value="crm">CRM records only</SelectItem>
                  <SelectItem value="audit">Audit and access logs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            The backend export job should write an audit event, generate a
            signed download URL, and expire access automatically.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>
            <Download className="w-4 h-4 mr-2" />
            Queue Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
