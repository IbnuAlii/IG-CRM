"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CrmSubscription, SubscriptionPlan, SubscriptionStatus } from "@/types";
import { ReceiptText } from "lucide-react";

export type SubscriptionDialogAction = "view" | "update" | "billing";

interface SubscriptionManagementDialogProps {
  subscription: CrmSubscription | null;
  action: SubscriptionDialogAction | null;
  planLabels: Record<SubscriptionPlan, string>;
  statusLabels: Record<SubscriptionStatus, string>;
  statusBadgeClass: (status: string) => string;
  formatDate: (date: Date) => string;
  formatMoney: (value: number) => string;
  onClose: () => void;
}

export function SubscriptionManagementDialog({
  subscription,
  action,
  planLabels,
  statusLabels,
  statusBadgeClass,
  formatDate,
  formatMoney,
  onClose,
}: SubscriptionManagementDialogProps) {
  return (
    <Dialog open={!!subscription && !!action} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {action === "update"
              ? "Update Subscription Plan"
              : action === "billing"
                ? "Billing Provider Details"
                : "Subscription Details"}
          </DialogTitle>
          <DialogDescription>
            Frontend controls for plan changes, billing sync, and Stripe
            subscription metadata.
          </DialogDescription>
        </DialogHeader>

        {subscription ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Card className="p-4">
                <p className="text-xs text-muted-foreground">Tenant</p>
                <p className="font-semibold mt-1">{subscription.tenantName}</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-muted-foreground">Current plan</p>
                <p className="font-semibold mt-1">{planLabels[subscription.plan]}</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant="outline" className={statusBadgeClass(subscription.status)}>
                  {statusLabels[subscription.status]}
                </Badge>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-muted-foreground">MRR</p>
                <p className="font-semibold mt-1">{formatMoney(subscription.monthlyAmount)}</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stripe subscription ID</Label>
                <Input value={`sub_${subscription.id.replace("sub_", "")}_crm`} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Stripe customer ID</Label>
                <Input value={`cus_${subscription.tenantId.replace("tenant_", "")}_crm`} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Current period</Label>
                <Input
                  value={`${formatDate(subscription.currentPeriodStart)} - ${formatDate(
                    subscription.currentPeriodEnd,
                  )}`}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label>Cancel at period end</Label>
                <Input value={subscription.status === "cancelled" ? "Yes" : "No"} readOnly />
              </div>
            </div>

            {action === "update" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>New plan</Label>
                  <Select defaultValue={subscription.plan}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Billing timing</Label>
                  <Select defaultValue="next_cycle">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Apply immediately</SelectItem>
                      <SelectItem value="next_cycle">Apply next billing cycle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : null}

            {action === "billing" ? (
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <ReceiptText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Billing console handoff</p>
                    <p className="text-sm text-muted-foreground">
                      Backend should deep-link to Stripe, sync invoices, retry failed payment,
                      and write an audit event.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="subscription-note">Internal billing note</Label>
              <Textarea
                id="subscription-note"
                placeholder="Reason for plan change, cancellation, payment retry, or billing support handoff."
              />
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant={action === "update" ? "default" : "outline"} onClick={onClose}>
            {action === "update"
              ? "Queue Plan Update"
              : action === "billing"
                ? "Open Billing Console"
                : "Done"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
