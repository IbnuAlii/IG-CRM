"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardStatCard } from "@/components/superadmin/dashboard/dashboard-stat-card";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddTenantDialog } from "@/components/superadmin/tenants/add-tenant-dialog";
import { TenantExportDialog } from "@/components/superadmin/tenants/tenant-export-dialog";
import {
  TenantLifecycleDialog,
  type TenantLifecycleAction,
} from "@/components/superadmin/tenants/tenant-lifecycle-dialog";
import { generateSuperAdminDashboardData } from "@/lib/mock-data";
import type { CrmTenant } from "@/types";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Plus,
  RotateCcw,
  XCircle,
} from "lucide-react";

const dashboardData = generateSuperAdminDashboardData();

const planLabels = {
  basic: "Basic",
  professional: "Professional",
  enterprise: "Enterprise",
};

const statusLabels = {
  active: "Active",
  trial: "Trial",
  pending: "Pending",
  suspended: "Suspended",
  cancelled: "Cancelled",
  past_due: "Past Due",
};

function statusBadgeClass(status: string) {
  if (status === "active") {
    return "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900";
  }

  if (status === "trial" || status === "pending" || status === "past_due") {
    return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900";
  }

  if (status === "suspended" || status === "cancelled") {
    return "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900";
  }

  return "";
}

function planBadgeClass(plan: string) {
  if (plan === "Enterprise") {
    return "border-primary/20 bg-primary/10 text-primary";
  }

  if (plan === "Professional") {
    return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-300";
  }

  return "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function SuperAdminTenantsPage() {
  const [tenantStatus, setTenantStatus] = useState("all");
  const [plan, setPlan] = useState("all");
  const [subscriptionStatus, setSubscriptionStatus] = useState("all");
  const [addTenantOpen, setAddTenantOpen] = useState(false);
  const [exportTenant, setExportTenant] = useState<CrmTenant | null>(null);
  const [lifecycleTenant, setLifecycleTenant] = useState<CrmTenant | null>(
    null,
  );
  const [lifecycleAction, setLifecycleAction] =
    useState<TenantLifecycleAction | null>(null);

  const tenants = dashboardData.tenants;

  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const matchesTenantStatus =
        tenantStatus === "all" || tenant.status === tenantStatus;
      const matchesPlan = plan === "all" || tenant.subscriptionPlan === plan;
      const matchesSubscriptionStatus =
        subscriptionStatus === "all" ||
        tenant.subscriptionStatus === subscriptionStatus;

      return matchesTenantStatus && matchesPlan && matchesSubscriptionStatus;
    });
  }, [plan, subscriptionStatus, tenantStatus, tenants]);

  const activeTenants = tenants.filter(
    (tenant) => tenant.status === "active",
  ).length;
  const trialTenants = tenants.filter(
    (tenant) => tenant.status === "trial",
  ).length;
  const suspendedTenants = tenants.filter(
    (tenant) => tenant.status === "suspended",
  ).length;
  const cancelledTenants = tenants.filter(
    (tenant) => tenant.status === "cancelled",
  ).length;

  const tenantColumns: DataTableColumn<CrmTenant>[] = [
    {
      id: "company",
      header: "Company",
      accessorFn: (tenant) => tenant.name,
      cell: (tenant) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{tenant.name}</p>
            <p className="text-xs text-muted-foreground">
              {tenant.subdomain}.crm.example.com
            </p>
          </div>
        </div>
      ),
      exportValue: (tenant) =>
        `${tenant.name} (${tenant.subdomain}.crm.example.com)`,
    },
    {
      id: "admin",
      header: "Admin",
      accessorFn: (tenant) => tenant.adminName,
      cell: (tenant) => (
        <div>
          <p>{tenant.adminName}</p>
          <p className="text-xs text-muted-foreground">{tenant.adminEmail}</p>
        </div>
      ),
      exportValue: (tenant) => `${tenant.adminName} (${tenant.adminEmail})`,
    },
    {
      id: "plan",
      header: "Plan",
      align: "center",
      accessorFn: (tenant) => planLabels[tenant.subscriptionPlan],
      cell: (tenant) => {
        const plan = planLabels[tenant.subscriptionPlan];
        return (
          <Badge variant="outline" className={planBadgeClass(plan)}>
            {plan}
          </Badge>
        );
      },
    },
    {
      id: "subscription",
      header: "Subscription",
      align: "center",
      accessorFn: (tenant) => statusLabels[tenant.subscriptionStatus],
      cell: (tenant) => (
        <Badge
          variant="outline"
          className={statusBadgeClass(tenant.subscriptionStatus)}
        >
          {statusLabels[tenant.subscriptionStatus]}
        </Badge>
      ),
    },
    {
      id: "tenantStatus",
      header: "Tenant Status",
      align: "center",
      accessorFn: (tenant) => statusLabels[tenant.status],
      cell: (tenant) => (
        <Badge variant="outline" className={statusBadgeClass(tenant.status)}>
          {statusLabels[tenant.status]}
        </Badge>
      ),
    },
    {
      id: "users",
      header: "Users",
      align: "center",
      accessorFn: (tenant) => tenant.usersCount,
      cell: (tenant) => tenant.usersCount,
    },
    {
      id: "created",
      header: "Created",
      align: "center",
      accessorFn: (tenant) => tenant.createdAt.getTime(),
      cell: (tenant) => (
        <div className="text-center">
          <p>{formatDate(tenant.createdAt)}</p>
          {tenant.trialEndsAt ? (
            <p className="text-xs text-muted-foreground">
              Trial ends {formatDate(tenant.trialEndsAt)}
            </p>
          ) : null}
        </div>
      ),
      exportValue: (tenant) => formatDate(tenant.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      align: "center",
      enableSorting: false,
      enableHiding: false,
      cell: (tenant) => (
        <div className="flex justify-center gap-2 whitespace-nowrap">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/superadmin/tenants/${tenant.id}`}>View</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportTenant(tenant)}
          >
            Export
          </Button>
          {tenant.status === "suspended" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLifecycleTenant(tenant);
                setLifecycleAction("reactivate");
              }}
            >
              Reactivate
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLifecycleTenant(tenant);
                setLifecycleAction("suspend");
              }}
            >
              Suspend
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLifecycleTenant(tenant);
              setLifecycleAction("terminate");
            }}
          >
            Terminate
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Tenants</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage company workspaces, subscription state, and tenant lifecycle.
          </p>
        </div>
        <Button onClick={() => setAddTenantOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        <DashboardStatCard
          label="Total Tenants"
          value={tenants.length}
          description="Across all plans"
          trend={`${filteredTenants.length} visible`}
          icon={Building2}
          tone="blue"
          presentation="tinted"
        />
        <DashboardStatCard
          label="Active"
          value={activeTenants}
          description="Tenant status active"
          trend="Operational"
          icon={CheckCircle2}
          tone="green"
          presentation="tinted"
        />
        <DashboardStatCard
          label="Trial"
          value={trialTenants}
          description="Trial workspaces"
          trend="Monitor conversion"
          icon={Clock}
          tone="amber"
          presentation="tinted"
        />
        <DashboardStatCard
          label="Suspended"
          value={suspendedTenants}
          description="Need attention"
          trend="Billing review"
          icon={AlertTriangle}
          tone="red"
          presentation="tinted"
        />
        <DashboardStatCard
          label="Cancelled"
          value={cancelledTenants}
          description="Closed workspaces"
          trend="None current"
          icon={XCircle}
          tone="neutral"
          presentation="tinted"
        />
      </div>

      <Card className="border-border/70 bg-card p-4 shadow-sm md:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center md:gap-16">
          <Select value={tenantStatus} onValueChange={setTenantStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tenant status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tenant statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

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

          <Select
            value={subscriptionStatus}
            onValueChange={setSubscriptionStatus}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Subscription status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subscriptions</SelectItem>
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
              setTenantStatus("all");
              setPlan("all");
              setSubscriptionStatus("all");
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
            <h2 className="font-semibold">Tenant Directory</h2>
            <p className="text-sm text-muted-foreground">
              Showing {filteredTenants.length} of {tenants.length} tenant
              workspaces.
            </p>
          </div>
        </div>

        <DataTable
          columns={tenantColumns}
          data={filteredTenants}
          getRowKey={(tenant) => tenant.id}
          emptyMessage="No tenants found. Try changing your search or filters."
          features={{
            sorting: true,
            globalFilter: true,
            pagination: true,
            columnVisibility: true,
            export: true,
            rowSelection: true,
          }}
          pageSize={10}
          searchPlaceholder="Search tenants..."
          exportFileName="super-admin-tenants.csv"
        />
      </Card>

      <AddTenantDialog open={addTenantOpen} onOpenChange={setAddTenantOpen} />
      <TenantExportDialog
        tenant={exportTenant}
        onClose={() => setExportTenant(null)}
      />
      <TenantLifecycleDialog
        tenant={lifecycleTenant}
        action={lifecycleAction}
        statusLabel={
          lifecycleTenant ? statusLabels[lifecycleTenant.status] : ""
        }
        onClose={() => {
          setLifecycleTenant(null);
          setLifecycleAction(null);
        }}
      />
    </div>
  );
}
