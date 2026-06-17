'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DashboardStatCard } from '@/components/superadmin/dashboard/dashboard-stat-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DatabaseIsolationSection } from '@/components/superadmin/tenant-detail/database-isolation-section';
import { EnterpriseIpWhitelistSection } from '@/components/superadmin/tenant-detail/enterprise-ip-whitelist-section';
import { PlanLimitsSection } from '@/components/superadmin/tenant-detail/plan-limits-section';
import { TenantExportWorkflowSection } from '@/components/superadmin/tenant-detail/tenant-export-workflow-section';
import { generateSuperAdminDashboardData } from '@/lib/mock-data';
import {
  ArrowLeft,
  Calendar,
  Download,
  Eye,
  Mail,
  Palette,
  ShieldAlert,
  Upload,
  Users,
  UserCheck,
} from 'lucide-react';

const dashboardData = generateSuperAdminDashboardData();

const planLabels = {
  basic: 'Basic',
  professional: 'Professional',
  enterprise: 'Enterprise',
};

const statusLabels = {
  active: 'Active',
  trial: 'Trial',
  pending: 'Pending',
  suspended: 'Suspended',
  cancelled: 'Cancelled',
  past_due: 'Past Due',
};

function statusBadgeClass(status: string) {
  if (status === 'active') {
    return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900';
  }

  if (status === 'trial' || status === 'pending' || status === 'past_due') {
    return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900';
  }

  if (status === 'suspended' || status === 'cancelled') {
    return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900';
  }

  return '';
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export default function SuperAdminTenantDetailPage() {
  const params = useParams<{ id: string }>();
  const tenantId = params.id;
  const tenant = dashboardData.tenants.find((item) => item.id === tenantId);
  const subscription = dashboardData.subscriptions.find((item) => item.tenantId === tenantId);

  if (!tenant) {
    return (
      <div className="w-full py-4 md:py-6">
        <Button variant="ghost" asChild className="mb-3 -ml-3">
          <Link href="/superadmin/tenants">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tenants
          </Link>
        </Button>
        <Card className="p-10 text-center">
          <p className="font-medium">Tenant not found</p>
          <p className="text-sm text-muted-foreground mt-1">The selected tenant does not exist in the mock data.</p>
        </Card>
      </div>
    );
  }

  const canWhiteLabel = tenant.subscriptionPlan === 'enterprise';
  const maxUsers =
    tenant.subscriptionPlan === 'enterprise' ? 'Unlimited' : tenant.subscriptionPlan === 'professional' ? '50' : '10';
  const maxStorage =
    tenant.subscriptionPlan === 'enterprise' ? '1 TB' : tenant.subscriptionPlan === 'professional' ? '250 GB' : '25 GB';
  const tenantDatabaseName = `crm_${tenant.subdomain}_site`;
  const tenantDatabaseHost = `${tenant.subdomain}.rds.crm.internal`;

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <div>
        <Button variant="ghost" asChild className="mb-3 -ml-3">
          <Link href="/superadmin/tenants">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tenants
          </Link>
        </Button>

        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">{tenant.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{tenant.subdomain}.crm.example.com</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className={statusBadgeClass(tenant.status)}>
                {statusLabels[tenant.status]}
              </Badge>
              <Badge variant="outline">{planLabels[tenant.subscriptionPlan]}</Badge>
              <Badge variant="outline" className={statusBadgeClass(tenant.subscriptionStatus)}>
                {statusLabels[tenant.subscriptionStatus]}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Access Tenant Data
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            {tenant.status === 'suspended' ? (
              <Button variant="outline">Reactivate</Button>
            ) : (
              <Button variant="outline">Suspend</Button>
            )}
            <Button variant="destructive">Terminate</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardStatCard label="Users" value={tenant.usersCount} description="Current workspace users" trend={`${maxUsers} limit`} icon={Users} tone="blue" />
        <DashboardStatCard label="Created" value={formatDate(tenant.createdAt)} description="Workspace created" trend="Tenant age" icon={Calendar} tone="neutral" />
        <DashboardStatCard label="Billing" value={subscription ? `$${subscription.monthlyAmount}/mo` : '-'} description="Current subscription" trend={statusLabels[tenant.subscriptionStatus]} icon={Download} tone="green" />
        <DashboardStatCard label="Trial Ends" value={tenant.trialEndsAt ? formatDate(tenant.trialEndsAt) : '-'} description="Trial status" trend={tenant.trialEndsAt ? 'Trial active' : 'Not in trial'} icon={UserCheck} tone="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        <Card className="border-border/70 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">Tenant Profile</h2>
              <p className="text-sm text-muted-foreground">Company and primary admin information.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company name</Label>
              <Input value={tenant.name} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Subdomain</Label>
              <Input value={tenant.subdomain} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Admin name</Label>
              <Input value={tenant.adminName} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Admin email</Label>
              <Input value={tenant.adminEmail} readOnly />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Billing email</Label>
              <Input value={tenant.billingEmail} readOnly />
            </div>
          </div>
        </Card>

        <Card className="border-border/70 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">White-Label Branding</h2>
              <p className="text-sm text-muted-foreground">Enterprise-only tenant branding controls.</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-background p-4 mb-4 shadow-xs">
            <div>
              <p className="text-sm font-medium">Enable custom branding</p>
              <p className="text-sm text-muted-foreground">
                Available for Enterprise tenants according to the requirements.
              </p>
            </div>
            <Switch defaultChecked={canWhiteLabel} disabled={!canWhiteLabel} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Brand color</Label>
              <Input value={canWhiteLabel ? '#2563EB' : 'Upgrade required'} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Custom domain</Label>
              <Input value={canWhiteLabel ? `${tenant.subdomain}.example.com` : 'Enterprise only'} readOnly />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Logo asset</Label>
              <div className="flex items-center justify-between gap-4 rounded-md border border-dashed border-border/70 bg-background p-4">
                <div>
                  <p className="text-sm font-medium">
                    {canWhiteLabel ? 'tenant-logo.svg' : 'Enterprise plan required'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Upload should later validate image type, dimensions, and storage location.
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled={!canWhiteLabel}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Domain verification</Label>
                <div className="rounded-md bg-muted/70 p-3 text-sm">
                {canWhiteLabel
                  ? `CNAME ${tenant.subdomain}.example.com -> tenants.crm.example.com`
                  : 'Custom domain verification is available for Enterprise tenants.'}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        <DatabaseIsolationSection
          tenantId={tenant.id}
          tenantDatabaseName={tenantDatabaseName}
          tenantDatabaseHost={tenantDatabaseHost}
        />
        <PlanLimitsSection
          tenant={tenant}
          maxUsers={maxUsers}
          maxStorage={maxStorage}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        <TenantExportWorkflowSection />
        <EnterpriseIpWhitelistSection
          canWhiteLabel={canWhiteLabel}
          statusBadgeClass={statusBadgeClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        <Card className="border-border/70 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">Onboarding and Provisioning</h2>
              <p className="text-sm text-muted-foreground">Backend actions that will be wired later.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background p-4 shadow-xs">
              <span className="text-sm">Tenant database / Frappe site provisioned</span>
              <Badge variant="outline" className={statusBadgeClass('active')}>Ready</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background p-4 shadow-xs">
              <span className="text-sm">Tenant routing metadata registered</span>
              <Badge variant="outline" className={statusBadgeClass('active')}>Ready</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background p-4 shadow-xs">
              <span className="text-sm">Subscription provisioned</span>
              <Badge variant="outline" className={statusBadgeClass(tenant.subscriptionStatus)}>
                {statusLabels[tenant.subscriptionStatus]}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background p-4 shadow-xs">
              <span className="text-sm">Welcome email to company admin</span>
              <Button variant="outline" size="sm">Resend</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-red-950 dark:text-red-200">Lifecycle Controls Are UI-Only</h2>
              <p className="text-sm text-red-900 dark:text-red-200 mt-1">
                Suspend, terminate, export, and access tenant data are frontend placeholders until backend permission,
                audit, and tenant-routing APIs are connected.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
