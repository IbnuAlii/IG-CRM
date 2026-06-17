'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DashboardStatCard } from '@/components/superadmin/dashboard/dashboard-stat-card';
import { DataTable, type DataTableColumn } from '@/components/common/data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  SubscriptionManagementDialog,
  type SubscriptionDialogAction,
} from '@/components/superadmin/subscriptions/subscription-management-dialog';
import { generateSuperAdminDashboardData } from '@/lib/mock-data';
import type { CrmSubscription } from '@/types';
import { AlertTriangle, Building2, CheckCircle2, Clock, CreditCard, DollarSign, RotateCcw, XCircle } from 'lucide-react';

const dashboardData = generateSuperAdminDashboardData();

const planLabels = {
  basic: 'Basic',
  professional: 'Professional',
  enterprise: 'Enterprise',
};

const statusLabels = {
  active: 'Active',
  trial: 'Trial',
  past_due: 'Past Due',
  suspended: 'Suspended',
  cancelled: 'Cancelled',
};

function statusBadgeClass(status: string) {
  if (status === 'active') {
    return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900';
  }

  if (status === 'trial' || status === 'past_due') {
    return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900';
  }

  if (status === 'suspended' || status === 'cancelled') {
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

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SuperAdminSubscriptionsPage() {
  const [plan, setPlan] = useState('all');
  const [status, setStatus] = useState('all');
  const [selectedSubscription, setSelectedSubscription] = useState<CrmSubscription | null>(null);
  const [subscriptionAction, setSubscriptionAction] = useState<SubscriptionDialogAction | null>(null);

  const { subscriptions, tenants } = dashboardData;
  const tenantById = useMemo(() => new Map(tenants.map((tenant) => [tenant.id, tenant])), [tenants]);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((subscription) => {
      const matchesPlan = plan === 'all' || subscription.plan === plan;
      const matchesStatus = status === 'all' || subscription.status === status;

      return matchesPlan && matchesStatus;
    });
  }, [plan, status, subscriptions]);

  const monthlyRecurringRevenue = subscriptions
    .filter((subscription) => subscription.status === 'active' || subscription.status === 'trial')
    .reduce((total, subscription) => total + subscription.monthlyAmount, 0);
  const activeSubscriptions = subscriptions.filter((subscription) => subscription.status === 'active').length;
  const trialSubscriptions = subscriptions.filter((subscription) => subscription.status === 'trial').length;
  const pastDueSubscriptions = subscriptions.filter((subscription) => subscription.status === 'past_due').length;
  const inactiveSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === 'suspended' || subscription.status === 'cancelled',
  ).length;

  const subscriptionColumns: DataTableColumn<CrmSubscription>[] = [
    {
      id: 'tenant',
      header: 'Tenant',
      accessorFn: (subscription) => subscription.tenantName,
      cell: (subscription) => {
        const tenant = tenantById.get(subscription.tenantId);

        return (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">{subscription.tenantName}</p>
                <p className="text-xs text-muted-foreground">{tenant?.subdomain}.crm.example.com</p>
              </div>
            </div>
          </div>
        );
      },
      exportValue: (subscription) => {
        const tenant = tenantById.get(subscription.tenantId);
        return `${subscription.tenantName} (${tenant?.subdomain}.crm.example.com)`;
      },
    },
    {
      id: 'plan',
      header: 'Plan',
      align: 'center',
      accessorFn: (subscription) => planLabels[subscription.plan],
      cell: (subscription) => {
        const plan = planLabels[subscription.plan];
        return <Badge variant="outline" className={planBadgeClass(plan)}>{plan}</Badge>;
      },
    },
    {
      id: 'status',
      header: 'Status',
      align: 'center',
      accessorFn: (subscription) => statusLabels[subscription.status],
      cell: (subscription) => (
        <Badge variant="outline" className={statusBadgeClass(subscription.status)}>
          {statusLabels[subscription.status]}
        </Badge>
      ),
    },
    {
      id: 'monthlyAmount',
      header: 'Monthly Amount',
      align: 'center',
      accessorFn: (subscription) => subscription.monthlyAmount,
      cell: (subscription) => <span className="font-medium">{formatMoney(subscription.monthlyAmount)}</span>,
      exportValue: (subscription) => formatMoney(subscription.monthlyAmount),
    },
    {
      id: 'currentPeriod',
      header: 'Current Period',
      align: 'center',
      accessorFn: (subscription) => subscription.currentPeriodEnd.getTime(),
      cell: (subscription) => `${formatDate(subscription.currentPeriodStart)} - ${formatDate(subscription.currentPeriodEnd)}`,
      exportValue: (subscription) => `${formatDate(subscription.currentPeriodStart)} - ${formatDate(subscription.currentPeriodEnd)}`,
    },
    {
      id: 'billingEmail',
      header: 'Billing Email',
      align: 'center',
      accessorFn: (subscription) => tenantById.get(subscription.tenantId)?.billingEmail,
      cell: (subscription) => tenantById.get(subscription.tenantId)?.billingEmail || '-',
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'center',
      enableSorting: false,
      enableHiding: false,
      cell: (subscription) => (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedSubscription(subscription);
              setSubscriptionAction('view');
            }}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedSubscription(subscription);
              setSubscriptionAction('update');
            }}
          >
            Update Plan
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedSubscription(subscription);
              setSubscriptionAction('billing');
            }}
          >
            Open Billing
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Subscriptions</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Monitor plans, billing status, and recurring revenue across tenant workspaces.
          </p>
        </div>
        <Button variant="outline">
          <CreditCard className="w-4 h-4 mr-2" />
          Open Billing Console
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        <DashboardStatCard label="MRR" value={formatMoney(monthlyRecurringRevenue)} description="Active and trial plans" trend="+8.4%" icon={DollarSign} tone="blue" presentation="tinted" />
        <DashboardStatCard label="Active" value={activeSubscriptions} description="Paid accounts" trend="Healthy" icon={CheckCircle2} tone="green" presentation="tinted" />
        <DashboardStatCard label="Trial" value={trialSubscriptions} description="Evaluation accounts" trend="Conversion watch" icon={Clock} tone="amber" presentation="tinted" />
        <DashboardStatCard label="Past Due" value={pastDueSubscriptions} description="Payment attention" trend="Needs follow-up" icon={AlertTriangle} tone="amber" presentation="tinted" />
        <DashboardStatCard label="Inactive" value={inactiveSubscriptions} description="Suspended/cancelled" trend="Lifecycle review" icon={XCircle} tone="red" presentation="tinted" />
      </div>

      <Card className="border-border/70 bg-card p-4 shadow-sm md:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto] md:items-center md:gap-16">
          <Select value={plan} onValueChange={setPlan}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All plans</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Billing status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All billing statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="past_due">Past Due</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setPlan('all');
              setStatus('all');
            }}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset filters
          </Button>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden border-border/70 bg-card shadow-sm">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border/70 bg-muted/20">
          <div>
            <h2 className="font-semibold">Subscription Directory</h2>
            <p className="text-sm text-muted-foreground">
              Showing {filteredSubscriptions.length} of {subscriptions.length} tenant subscriptions.
            </p>
          </div>
        </div>

        <DataTable
          columns={subscriptionColumns}
          data={filteredSubscriptions}
          getRowKey={(subscription) => subscription.id}
          emptyMessage="No subscriptions found. Try changing your search or filters."
          features={{ sorting: true, globalFilter: true, pagination: true, columnVisibility: true, export: true }}
          pageSize={10}
          searchPlaceholder="Search subscriptions..."
          exportFileName="super-admin-subscriptions.csv"
        />
      </Card>

      <SubscriptionManagementDialog
        subscription={selectedSubscription}
        action={subscriptionAction}
        planLabels={planLabels}
        statusLabels={statusLabels}
        statusBadgeClass={statusBadgeClass}
        formatDate={formatDate}
        formatMoney={formatMoney}
        onClose={() => {
          setSelectedSubscription(null);
          setSubscriptionAction(null);
        }}
      />
    </div>
  );
}
