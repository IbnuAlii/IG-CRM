"use client";

import { Globe, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function EnterpriseIpWhitelistSection({
  canWhiteLabel,
  statusBadgeClass,
}: {
  canWhiteLabel: boolean;
  statusBadgeClass: (status: string) => string;
}) {
  return (
    <Card className="border-border/70 bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">Enterprise IP Whitelist</h2>
          <p className="text-sm text-muted-foreground">
            Restrict tenant admin access by trusted networks.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { cidr: "203.0.113.0/24", label: "Corporate office" },
          { cidr: "198.51.100.42/32", label: "Finance VPN" },
        ].map((rule) => (
          <div
            key={rule.cidr}
            className="flex items-center justify-between rounded-lg border border-border/70 bg-background p-3 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{rule.cidr}</p>
                <p className="text-xs text-muted-foreground">{rule.label}</p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={canWhiteLabel ? statusBadgeClass("active") : ""}
            >
              {canWhiteLabel ? "Allowed" : "Enterprise only"}
            </Badge>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          placeholder="Add CIDR range, e.g. 192.0.2.0/24"
          disabled={!canWhiteLabel}
        />
        <Button variant="outline" disabled={!canWhiteLabel}>
          Add
        </Button>
      </div>
    </Card>
  );
}
