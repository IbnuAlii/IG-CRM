"use client";

import { Bell, Lock, Settings, ShieldCheck } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";

export function SettingsStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Security"
        value="2FA"
        description="Required for admin roles"
        trend="Matches security document"
        icon={ShieldCheck}
        tone="green"
      />
      <AdminStatCard
        label="Notifications"
        value="4"
        description="Email, SMS, app, SLA"
        trend="Twilio and SES mocked"
        icon={Bell}
        tone="blue"
      />
      <AdminStatCard
        label="Roles"
        value="7"
        description="Predefined role templates"
        trend="Custom roles ready"
        icon={Lock}
        tone="neutral"
      />
      <AdminStatCard
        label="Work Rules"
        value="NY"
        description="Timezone and dispatch defaults"
        trend="America/New_York"
        icon={Settings}
        tone="amber"
      />
    </div>
  );
}
