'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable, type DataTableColumn } from '@/components/common/data-table';
import {
  DashboardControls,
  type DashboardDateRange,
  type DashboardWidgetKey,
  dateRangeLabels,
} from '@/components/superadmin/dashboard/dashboard-controls';
import { DashboardStatCard } from '@/components/superadmin/dashboard/dashboard-stat-card';
import { generateSuperAdminDashboardData } from '@/lib/mock-data';
import type { CrmTenant, TenantRegistration } from '@/types';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  Database,
  Server,
  ShieldCheck,
  TrendingUp,
  Wifi,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const dashboardData = generateSuperAdminDashboardData();

const defaultVisibleWidgets: DashboardWidgetKey[] = [
  'overview',
  'registrations',
  'systemHealth',
  'revenue',
  'planMix',
  'tenantOverview',
  'alerts',
];

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
  approved: 'Approved',
  rejected: 'Rejected',
  operational: 'Operational',
  degraded: 'Degraded',
  down: 'Down',
};

const uptimeHistory = [
  { day: '1', uptime: 100 },
  { day: '4', uptime: 99.65 },
  { day: '7', uptime: 99.78 },
  { day: '10', uptime: 99.52 },
  { day: '13', uptime: 99.84 },
  { day: '16', uptime: 99.71 },
  { day: '19', uptime: 99.9 },
  { day: '22', uptime: 99.63 },
  { day: '25', uptime: 99.72 },
  { day: '28', uptime: 99.98 },
];

const planChartColors = {
  Enterprise: '#2563eb',
  Professional: '#8b5cf6',
  Basic: '#10b981',
};

function statusBadgeClass(status: string) {
  if (['active', 'operational', 'approved'].includes(status)) {
    return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900';
  }

  if (['trial', 'pending', 'degraded', 'past_due'].includes(status)) {
    return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900';
  }

  if (['suspended', 'cancelled', 'down', 'rejected'].includes(status)) {
    return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900';
  }

  return '';
}

function planBadgeClass(plan: string) {
  if (plan === 'Enterprise') {
    return 'border-primary/20 bg-primary/10 text-primary';
  }

  if (plan === 'Professional') {
    return 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-300';
  }

  return 'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300';
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function escapeCsvValue(value: unknown) {
  const text = value == null ? '' : String(value);
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function downloadCsv(filename: string, rows: Array<Array<string | number>>) {
  const csv = rows.map((row) => row.map(escapeCsvValue).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function SuperAdminDashboardPage() {
  const { tenants, registrations, subscriptions, systemHealth, alerts, revenueTrend } = dashboardData;
  const [dateRange, setDateRange] = useState<DashboardDateRange>('30d');
  const [visibleWidgets, setVisibleWidgets] = useState<DashboardWidgetKey[]>(defaultVisibleWidgets);

  const activeTenants = tenants.filter((tenant) => tenant.status === 'active').length;
  const trialTenants = tenants.filter((tenant) => tenant.status === 'trial').length;
  const suspendedTenants = tenants.filter((tenant) => tenant.status === 'suspended').length;
  const pendingRegistrations = registrations.filter((registration) => registration.status === 'pending').length;
  const monthlyRecurringRevenue = subscriptions
    .filter((subscription) => subscription.status === 'active' || subscription.status === 'trial')
    .reduce((total, subscription) => total + subscription.monthlyAmount, 0);

  const tenantsByPlan = Object.entries(
    tenants.reduce<Record<string, number>>((acc, tenant) => {
      acc[planLabels[tenant.subscriptionPlan]] = (acc[planLabels[tenant.subscriptionPlan]] || 0) + 1;
      return acc;
    }, {}),
  ).map(([plan, count]) => ({
    plan,
    count,
    percent: Math.round((count / tenants.length) * 100),
    color: planChartColors[plan as keyof typeof planChartColors],
  }));

  const healthItems = [
    { label: 'API', status: systemHealth.apiStatus, icon: Server },
    { label: 'Database', status: systemHealth.databaseStatus, icon: Database },
    { label: 'WebSocket', status: systemHealth.websocketStatus, icon: Wifi },
  ];
  const openAlerts = alerts.filter((alert) => !alert.resolved).length;

  const isWidgetVisible = (widget: DashboardWidgetKey) => visibleWidgets.includes(widget);

  const handleWidgetToggle = (widget: DashboardWidgetKey) => {
    setVisibleWidgets((current) => {
      if (current.includes(widget)) {
        return current.length === 1 ? current : current.filter((item) => item !== widget);
      }

      return [...current, widget];
    });
  };

  const handleDashboardExport = () => {
    downloadCsv(`super-admin-dashboard-${dateRange}.csv`, [
      ['Metric', 'Value', 'Date Range'],
      ['Total tenants', tenants.length, dateRangeLabels[dateRange]],
      ['Active tenants', activeTenants, dateRangeLabels[dateRange]],
      ['Trial tenants', trialTenants, dateRangeLabels[dateRange]],
      ['Suspended tenants', suspendedTenants, dateRangeLabels[dateRange]],
      ['Pending registrations', pendingRegistrations, dateRangeLabels[dateRange]],
      ['Monthly recurring revenue', monthlyRecurringRevenue, dateRangeLabels[dateRange]],
      ['API status', statusLabels[systemHealth.apiStatus], dateRangeLabels[dateRange]],
      ['Database status', statusLabels[systemHealth.databaseStatus], dateRangeLabels[dateRange]],
      ['WebSocket status', statusLabels[systemHealth.websocketStatus], dateRangeLabels[dateRange]],
      ['Average response time', `${systemHealth.avgResponseTimeMs}ms`, dateRangeLabels[dateRange]],
      ['Error rate', `${systemHealth.errorRate}%`, dateRangeLabels[dateRange]],
      ['Uptime', `${systemHealth.uptime}%`, dateRangeLabels[dateRange]],
    ]);
  };

  const registrationColumns: DataTableColumn<TenantRegistration>[] = [
    {
      id: 'company',
      header: 'Company',
      accessorFn: (registration) => registration.companyName,
      cell: (registration) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{registration.companyName}</p>
            <p className="text-xs text-muted-foreground">{registration.adminEmail}</p>
          </div>
        </div>
      ),
      exportValue: (registration) => `${registration.companyName} (${registration.adminEmail})`,
    },
    {
      id: 'admin',
      header: 'Admin',
      accessorFn: (registration) => registration.adminName,
      cell: (registration) => registration.adminName,
    },
    {
      id: 'plan',
      header: 'Plan',
      align: 'center',
      accessorFn: (registration) => planLabels[registration.requestedPlan],
      cell: (registration) => {
        const plan = planLabels[registration.requestedPlan];
        return <Badge variant="outline" className={planBadgeClass(plan)}>{plan}</Badge>;
      },
    },
    {
      id: 'submitted',
      header: 'Submitted',
      align: 'center',
      accessorFn: (registration) => registration.submittedAt.getTime(),
      cell: (registration) => formatDateTime(registration.submittedAt),
      exportValue: (registration) => formatDateTime(registration.submittedAt),
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'center',
      enableSorting: false,
      enableHiding: false,
      cell: () => (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm">Review</Button>
          <Button size="sm">Approve</Button>
        </div>
      ),
    },
  ];

  const tenantColumns: DataTableColumn<CrmTenant>[] = [
    {
      id: 'tenant',
      header: 'Tenant',
      accessorFn: (tenant) => tenant.name,
      cell: (tenant) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{tenant.name}</p>
            <p className="text-xs text-muted-foreground">{tenant.subdomain}.crm.example.com</p>
          </div>
        </div>
      ),
      exportValue: (tenant) => `${tenant.name} (${tenant.subdomain}.crm.example.com)`,
    },
    {
      id: 'plan',
      header: 'Plan',
      align: 'center',
      accessorFn: (tenant) => planLabels[tenant.subscriptionPlan],
      cell: (tenant) => {
        const plan = planLabels[tenant.subscriptionPlan];
        return <Badge variant="outline" className={planBadgeClass(plan)}>{plan}</Badge>;
      },
    },
    {
      id: 'subscription',
      header: 'Subscription',
      align: 'center',
      accessorFn: (tenant) => statusLabels[tenant.subscriptionStatus],
      cell: (tenant) => (
        <Badge variant="outline" className={statusBadgeClass(tenant.subscriptionStatus)}>
          {statusLabels[tenant.subscriptionStatus]}
        </Badge>
      ),
    },
    {
      id: 'users',
      header: 'Users',
      align: 'center',
      accessorFn: (tenant) => tenant.usersCount,
      cell: (tenant) => tenant.usersCount,
    },
    {
      id: 'created',
      header: 'Created',
      align: 'center',
      accessorFn: (tenant) => tenant.createdAt.getTime(),
      cell: (tenant) => formatDate(tenant.createdAt),
      exportValue: (tenant) => formatDate(tenant.createdAt),
    },
    {
      id: 'action',
      header: 'Action',
      align: 'center',
      enableSorting: false,
      enableHiding: false,
      cell: () => <Button variant="outline" size="sm">View</Button>,
    },
  ];

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <Card className="relative min-h-[280px] overflow-hidden border-border/70 bg-card shadow-sm">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/super-admin/hero.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/72 to-background/50" />
        <div className="pointer-events-none absolute left-[42%] top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
          <Image
            src="/images/super-admin/superAdminShell%20icon.png"
            alt=""
            width={250}
            height={250}
            priority
            className="drop-shadow-xl"
          />
        </div>

        <div className="relative z-10 grid min-h-[280px] gap-6 p-6 2xl:grid-cols-[1fr_420px] 2xl:items-start">
          <div className="flex h-full max-w-xl flex-col justify-center">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary shadow-xs">
                <ShieldCheck className="w-3 h-3" />
                Platform command center
              </Badge>
              <Badge variant="outline" className={`${statusBadgeClass(systemHealth.apiStatus)} shadow-xs`}>
                <CheckCircle2 className="w-3 h-3" />
                {statusLabels[systemHealth.apiStatus]}
              </Badge>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Super Admin Dashboard</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
              Platform-level view for tenant onboarding, subscriptions, and system health for {dateRangeLabels[dateRange].toLowerCase()}.
            </p>
          </div>

          <div className="flex flex-col gap-7 2xl:items-end">
            <DashboardControls
              dateRange={dateRange}
              visibleWidgets={visibleWidgets}
              onDateRangeChange={setDateRange}
              onWidgetToggle={handleWidgetToggle}
              onExport={handleDashboardExport}
            />
            <div className="grid w-full grid-cols-3 overflow-hidden rounded-lg border border-border/70 bg-background/80 text-center shadow-sm backdrop-blur 2xl:max-w-[390px]">
              <div className="p-5">
                <p className="text-2xl font-semibold tracking-tight">{pendingRegistrations}</p>
                <p className="mt-1 text-xs text-muted-foreground">Pending</p>
              </div>
              <div className="border-x border-border/70 p-5">
                <p className="text-2xl font-semibold tracking-tight">{systemHealth.uptime}%</p>
                <p className="mt-1 text-xs text-muted-foreground">Uptime</p>
              </div>
              <div className="p-5">
                <p className="text-2xl font-semibold tracking-tight">{openAlerts}</p>
                <p className="mt-1 text-xs text-muted-foreground">Open alerts</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {isWidgetVisible('overview') && (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <DashboardStatCard
          label="Total Tenants"
          value={tenants.length}
          description="Across all plans"
          trend="+2 this period"
          icon={Building2}
          tone="blue"
        />
        <DashboardStatCard
          label="Active"
          value={activeTenants}
          description="Paying tenants"
          trend="Healthy"
          icon={CheckCircle2}
          tone="green"
        />
        <DashboardStatCard
          label="Trials"
          value={trialTenants}
          description="Trial workspaces"
          trend="1 ending soon"
          icon={Clock}
          tone="amber"
        />
        <DashboardStatCard
          label="Suspended"
          value={suspendedTenants}
          description="Need attention"
          trend="Billing risk"
          icon={AlertTriangle}
          tone="red"
        />
        <DashboardStatCard
          label="Pending"
          value={pendingRegistrations}
          description="New registrations"
          trend="Review queue"
          icon={Activity}
          tone="blue"
        />
        <DashboardStatCard
          label="MRR"
          value={`$${monthlyRecurringRevenue.toLocaleString()}`}
          description="Monthly recurring"
          trend="+8.4%"
          icon={CreditCard}
          tone="blue"
        />
      </div>
      )}

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
        {isWidgetVisible('registrations') && (
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm 2xl:col-span-2">
          <div className="flex items-start justify-between gap-4 border-b border-border/70 bg-muted/20 p-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">Pending Tenant Registrations</h2>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900">
                  {pendingRegistrations} waiting
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Review new company signups before provisioning.</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              View All
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="p-6">
            <DataTable
              columns={registrationColumns}
              data={registrations}
              getRowKey={(registration) => registration.id}
              emptyMessage="No pending registrations found"
              features={{ sorting: false, globalFilter: false, pagination: false, columnVisibility: false, export: false }}
            />
          </div>
        </Card>
        )}

        {isWidgetVisible('systemHealth') && (
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
          <div className="border-b border-border/70 bg-muted/20 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold">System Health</h2>
                <p className="text-sm text-muted-foreground">Last checked {formatDateTime(systemHealth.checkedAt)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-950/30 dark:text-green-300 dark:ring-green-900">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-green-200 bg-green-50/70 p-4 dark:border-green-900 dark:bg-green-950/20">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Platform uptime</p>
                <p className="text-xl font-semibold text-green-800 dark:text-green-200">{systemHealth.uptime}%</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-green-100 dark:bg-green-950">
                <div className="h-full rounded-full bg-green-500" style={{ width: `${systemHealth.uptime}%` }} />
              </div>
            </div>
          </div>

          <div className="space-y-3 p-6">
            <div>
              <p className="mb-3 text-xs font-medium text-muted-foreground">Uptime history (30 days)</p>
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={uptimeHistory} margin={{ left: 0, right: 0, top: 6, bottom: 0 }}>
                    <defs>
                      <linearGradient id="uptimeFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(34 197 94)" stopOpacity={0.28} />
                        <stop offset="100%" stopColor="rgb(34 197 94)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                        boxShadow: 'var(--shadow-md)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="uptime"
                      stroke="rgb(34 197 94)"
                      strokeWidth={2}
                      fill="url(#uptimeFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <p className="pt-2 text-xs font-medium text-muted-foreground">Services</p>
            {healthItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between rounded-lg border border-border/70 bg-background p-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <Badge variant="outline" className={statusBadgeClass(item.status)}>
                    {statusLabels[item.status]}
                  </Badge>
                </div>
              );
            })}

            <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="rounded-lg bg-muted/70 p-3">
              <p className="text-xs text-muted-foreground">Response</p>
              <p className="font-semibold">{systemHealth.avgResponseTimeMs}ms</p>
            </div>
            <div className="rounded-lg bg-muted/70 p-3">
              <p className="text-xs text-muted-foreground">Error Rate</p>
              <p className="font-semibold">{systemHealth.errorRate}%</p>
            </div>
            <div className="rounded-lg bg-muted/70 p-3">
              <p className="text-xs text-muted-foreground">Uptime</p>
              <p className="font-semibold">{systemHealth.uptime}%</p>
            </div>
            </div>
          </div>
        </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isWidgetVisible('revenue') && (
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-border/70 bg-muted/20 p-6">
            <div>
              <h2 className="font-semibold">Revenue Trend</h2>
              <p className="text-sm text-muted-foreground">{dateRangeLabels[dateRange]}</p>
            </div>
            <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
              <TrendingUp className="h-3 w-3" />
              +8.4%
            </Badge>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.24} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/70" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
                <YAxis axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                    boxShadow: 'var(--shadow-md)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fill="url(#revenueFill)"
                  dot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        )}

        {isWidgetVisible('planMix') && (
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-border/70 bg-muted/20 p-6">
            <div>
              <h2 className="font-semibold">Tenants by Plan</h2>
              <p className="text-sm text-muted-foreground">Subscription mix across current workspaces.</p>
            </div>
          </div>
          <div className="grid gap-6 p-6 md:grid-cols-[280px_1fr] md:items-center">
            <div className="relative h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  />
                  <Pie
                    data={tenantsByPlan}
                    dataKey="count"
                    nameKey="plan"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={2}
                    stroke="hsl(var(--background))"
                    strokeWidth={4}
                  >
                    {tenantsByPlan.map((entry) => (
                      <Cell key={entry.plan} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-semibold">{tenants.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>

            <div className="space-y-4">
              {tenantsByPlan.map((item) => (
                <div key={item.plan} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium">{item.plan}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{item.percent}%</p>
                    <p className="text-xs text-muted-foreground">({item.count})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
        {isWidgetVisible('tenantOverview') && (
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm 2xl:col-span-2">
          <div className="flex items-start justify-between gap-4 border-b border-border/70 bg-muted/20 p-6">
            <div>
              <h2 className="font-semibold">Tenant Overview</h2>
              <p className="text-sm text-muted-foreground">Current company workspaces and subscription state.</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              Manage Tenants
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="p-6">
            <DataTable
              columns={tenantColumns}
              data={tenants}
              getRowKey={(tenant) => tenant.id}
              emptyMessage="No tenants found"
              features={{ sorting: false, globalFilter: false, pagination: false, columnVisibility: false, export: false }}
            />
          </div>
        </Card>
        )}

        {isWidgetVisible('alerts') && (
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-border/70 bg-muted/20 p-6">
            <div>
              <h2 className="font-semibold">Alerts and Logs</h2>
              <p className="text-sm text-muted-foreground">{openAlerts} open platform events.</p>
            </div>
            <Badge variant="outline">{alerts.length} total</Badge>
          </div>
          <div className="space-y-3 p-6">
            {alerts.map((alert) => (
              <div key={alert.id} className="rounded-lg border border-border/70 bg-background p-3 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      alert.severity === 'critical'
                        ? statusBadgeClass('down')
                        : alert.severity === 'warning'
                          ? statusBadgeClass('pending')
                          : ''
                    }
                  >
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-3">{formatDateTime(alert.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
        )}
      </div>
    </div>
  );
}
