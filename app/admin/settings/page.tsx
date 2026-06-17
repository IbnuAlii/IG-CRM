"use client";

import { Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CompanyProfileSettings } from "@/components/admin/settings/company-profile-settings";
import { CustomerCommunicationSettings } from "@/components/admin/settings/customer-communication-settings";
import { DispatchDefaultsSettings } from "@/components/admin/settings/dispatch-defaults-settings";
import { SecurityAccessSettings } from "@/components/admin/settings/security-access-settings";
import { SettingsStats } from "@/components/admin/settings/settings-stats";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Settings"
        description="Configure company profile, working rules, RBAC defaults, security requirements, customer communications, and integrations."
        actions={
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        }
      />

      <SettingsStats />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <CompanyProfileSettings />
        <SecurityAccessSettings />
        <CustomerCommunicationSettings />
        <DispatchDefaultsSettings />
      </div>
    </div>
  );
}
