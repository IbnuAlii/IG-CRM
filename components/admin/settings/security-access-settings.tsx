"use client";

import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SecurityAccessSettings() {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Lock className="h-4 w-4 text-primary" />
        <h2 className="font-semibold">Security and Access</h2>
      </div>
      <div className="space-y-4">
        {[
          ["Require 2FA for Admin and Manager roles", true],
          ["Lock account after 5 failed attempts", true],
          ["Allow custom role creation", true],
          ["Show customer financial data to dispatchers", false],
        ].map(([label, checked]) => (
          <div
            key={String(label)}
            className="flex items-center justify-between rounded-lg border border-border p-4"
          >
            <Label className="text-sm">{label}</Label>
            <Switch defaultChecked={Boolean(checked)} />
          </div>
        ))}
      </div>
    </Card>
  );
}
