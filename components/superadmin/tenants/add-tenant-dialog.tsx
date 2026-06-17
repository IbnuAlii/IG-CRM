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
import { CheckCircle2, Database, Mail } from "lucide-react";

interface AddTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTenantDialog({ open, onOpenChange }: AddTenantDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Tenant</DialogTitle>
          <DialogDescription>
            Create a company workspace and prepare the provisioning request.
            Backend will later create the Frappe site, database, subscription,
            and welcome email.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="new-company">Company name</Label>
            <Input id="new-company" placeholder="Acme Field Services" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-subdomain">Subdomain</Label>
            <Input id="new-subdomain" placeholder="acme" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-admin">Admin name</Label>
            <Input id="new-admin" placeholder="Alex Morgan" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-admin-email">Admin email</Label>
            <Input id="new-admin-email" type="email" placeholder="alex@acme.example" />
          </div>
          <div className="space-y-2">
            <Label>Subscription plan</Label>
            <Select defaultValue="professional">
              <SelectTrigger>
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-billing-email">Billing email</Label>
            <Input id="new-billing-email" type="email" placeholder="billing@acme.example" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="new-notes">Internal provisioning notes</Label>
            <Textarea
              id="new-notes"
              placeholder="Any special onboarding, data residency, or billing notes."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: "Create tenant database / Frappe site", icon: Database },
            { label: "Provision trial or paid subscription", icon: CheckCircle2 },
            { label: "Send welcome email to admin", icon: Mail },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-lg border border-border p-3">
                <Icon className="w-4 h-4 text-primary mb-2" />
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Queued after approval/API connection.
                </p>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Create Tenant Draft</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
