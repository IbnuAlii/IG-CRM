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
import { Textarea } from "@/components/ui/textarea";
import type { CrmTenant } from "@/types";

export type TenantLifecycleAction = "suspend" | "reactivate" | "terminate";

interface TenantLifecycleDialogProps {
  tenant: CrmTenant | null;
  action: TenantLifecycleAction | null;
  statusLabel: string;
  onClose: () => void;
}

export function TenantLifecycleDialog({
  tenant,
  action,
  statusLabel,
  onClose,
}: TenantLifecycleDialogProps) {
  return (
    <Dialog open={!!tenant && !!action} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "terminate"
              ? "Terminate Tenant"
              : action === "reactivate"
                ? "Reactivate Tenant"
                : "Suspend Tenant"}
          </DialogTitle>
          <DialogDescription>
            This confirms the frontend lifecycle workflow required before the
            backend tenant-routing, permission, and audit APIs are connected.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border p-4">
            <p className="font-medium">{tenant?.name}</p>
            <p className="text-sm text-muted-foreground">
              Current status: {statusLabel || "-"}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lifecycle-reason">Reason / audit note</Label>
            <Textarea
              id="lifecycle-reason"
              placeholder="Billing issue, customer request, compliance hold, or reactivation note."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={action === "terminate" ? "destructive" : "default"} onClick={onClose}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
