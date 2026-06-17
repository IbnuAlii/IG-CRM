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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TenantRegistration } from "@/types";
import { Database, Mail, ShieldCheck } from "lucide-react";

type RegistrationDialogAction = "review" | "approve" | "reject";

interface RegistrationReviewDialogProps {
  registration: TenantRegistration | null;
  action: RegistrationDialogAction | null;
  planLabel?: string;
  onClose: () => void;
}

export function RegistrationReviewDialog({
  registration,
  action,
  planLabel,
  onClose,
}: RegistrationReviewDialogProps) {
  return (
    <Dialog open={!!registration && !!action} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {action === "approve"
              ? "Approve Registration"
              : action === "reject"
                ? "Reject Registration"
                : "Review Registration"}
          </DialogTitle>
          <DialogDescription>
            Review company details, approval notes, and the required
            provisioning steps from the Super Admin onboarding flow.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Company Request</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Company</span>
                <span className="font-medium">{registration?.companyName}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Admin</span>
                <span>{registration?.adminName}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Email</span>
                <span>{registration?.adminEmail}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Requested plan</span>
                {planLabel ? <Badge variant="outline">{planLabel}</Badge> : null}
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Provisioning Checklist</h3>
            <div className="space-y-3">
              {[
                {
                  label: "Create tenant database / Frappe site",
                  detail: "Reserve subdomain, site name, and DB connection.",
                  icon: Database,
                },
                {
                  label: "Provision subscription",
                  detail: "Create trial or paid Stripe subscription.",
                  icon: ShieldCheck,
                },
                {
                  label: "Send welcome email",
                  detail: "Deliver onboarding steps to company admin.",
                  icon: Mail,
                },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex gap-3 rounded-lg border border-border p-3">
                    <Icon className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-2">
          <Label htmlFor="registration-note">
            {action === "reject" ? "Reject reason" : "Approval / review note"}
          </Label>
          <Textarea
            id="registration-note"
            placeholder={
              action === "reject"
                ? "Explain why this registration cannot be approved yet."
                : "Optional notes for provisioning, billing, or onboarding."
            }
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {action === "reject" ? (
            <Button variant="destructive" onClick={onClose}>
              Reject Registration
            </Button>
          ) : (
            <Button onClick={onClose}>
              {action === "approve" ? "Approve and Queue Provisioning" : "Save Review"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { RegistrationDialogAction };
