'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TwoFactorSettingsCard } from '@/components/superadmin/settings/two-factor-settings-card';
import { CreditCard, KeyRound, Mail, Map, Save, ShieldCheck, SlidersHorizontal, Users } from 'lucide-react';

const integrations = [
  {
    name: 'Stripe',
    description: 'Subscription billing and invoice payments',
    status: 'Connected',
    icon: CreditCard,
  },
  {
    name: 'AWS SES',
    description: 'Verification, welcome, and notification emails',
    status: 'Connected',
    icon: Mail,
  },
  {
    name: 'Twilio',
    description: 'SMS alerts and future mobile workforce notifications',
    status: 'Not configured',
    icon: KeyRound,
  },
  {
    name: 'Mapbox',
    description: 'Maps, route planning, and location services',
    status: 'Connected',
    icon: Map,
  },
] as const;

function integrationBadgeClass(status: string) {
  if (status === 'Connected') {
    return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900';
  }

  return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900';
}

export default function SuperAdminSettingsPage() {
  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage platform-wide defaults, security controls, and integrations.
          </p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <TwoFactorSettingsCard />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        <Card className="border-border/70 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">Platform Profile</h2>
              <p className="text-sm text-muted-foreground">Global identity and support defaults.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform-name">Platform name</Label>
              <Input id="platform-name" defaultValue="CRM Enterprise SaaS" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="support-email">Support email</Label>
              <Input id="support-email" type="email" defaultValue="support@crm.example.com" />
            </div>

            <div className="space-y-2">
              <Label>Default timezone</Label>
              <Select defaultValue="america-new-york">
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america-new-york">America/New York</SelectItem>
                  <SelectItem value="america-chicago">America/Chicago</SelectItem>
                  <SelectItem value="america-los-angeles">America/Los Angeles</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Default language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="border-border/70 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">Tenant Defaults</h2>
              <p className="text-sm text-muted-foreground">Defaults applied to new company workspaces.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default subscription plan</Label>
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
              <Label htmlFor="trial-length">Trial length</Label>
              <Input id="trial-length" defaultValue="14 days" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="basic-users">Basic max users</Label>
              <Input id="basic-users" defaultValue="10" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pro-users">Professional max users</Label>
              <Input id="pro-users" defaultValue="50" />
            </div>
          </div>

          <div className="rounded-lg bg-muted/70 p-3 mt-4">
            <p className="text-sm font-medium">Enterprise plan</p>
            <p className="text-sm text-muted-foreground">Enterprise tenants are treated as unlimited by default.</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        <Card className="border-border/70 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">Security Defaults</h2>
              <p className="text-sm text-muted-foreground">Baseline policies for platform and tenant admins.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-background p-4 shadow-xs">
              <div>
                <p className="text-sm font-medium">Require 2FA for admins</p>
                <p className="text-sm text-muted-foreground">Enforce two-factor authentication for privileged users.</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-background p-4 shadow-xs">
              <div>
                <p className="text-sm font-medium">Require Super Admin approval</p>
                <p className="text-sm text-muted-foreground">New registrations wait for manual review before provisioning.</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session timeout</Label>
                <Input id="session-timeout" defaultValue="30 minutes" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-policy">Password policy</Label>
                <Input id="password-policy" defaultValue="12 chars, mixed case, number" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-border/70 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">Integrations</h2>
              <p className="text-sm text-muted-foreground">Platform-level external services.</p>
            </div>
          </div>

          <div className="space-y-3">
            {integrations.map((integration) => {
              const Icon = integration.icon;

              return (
                <div key={integration.name} className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-background p-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted/70 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={integrationBadgeClass(integration.status)}>
                      {integration.status}
                    </Badge>
                    <Button variant="outline" size="sm">Test</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="border-border/70 bg-card p-6 shadow-sm">
        <h2 className="font-semibold mb-1">System Controls</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Platform-wide controls that affect tenant access and onboarding.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-background p-4 shadow-xs">
            <div>
              <p className="text-sm font-medium">Maintenance mode</p>
              <p className="text-sm text-muted-foreground">Temporarily restrict platform access.</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-background p-4 shadow-xs">
            <div>
              <p className="text-sm font-medium">Allow new registrations</p>
              <p className="text-sm text-muted-foreground">Keep public company signup enabled.</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-background p-4 shadow-xs">
            <div>
              <p className="text-sm font-medium">Enable audit logging</p>
              <p className="text-sm text-muted-foreground">Capture platform and tenant admin activity.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>
    </div>
  );
}
