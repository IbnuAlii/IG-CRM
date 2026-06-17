"use client";

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
import {
  RegistrationReviewDialog,
  type RegistrationDialogAction,
} from "@/components/superadmin/registrations/registration-review-dialog";
import { generateSuperAdminDashboardData } from "@/lib/mock-data";
import type { TenantRegistration } from "@/types";
import {
  Building2,
  CheckCircle2,
  Clock,
  FileClock,
  RefreshCw,
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
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

function statusBadgeClass(status: string) {
  if (status === "approved") {
    return "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900";
  }

  if (status === "pending") {
    return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900";
  }

  if (status === "rejected") {
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

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function hoursSince(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const hours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${Math.round(hours / 24)}d ago`;
}

export default function SuperAdminRegistrationsPage() {
  const [status, setStatus] = useState("all");
  const [plan, setPlan] = useState("all");
  const [selectedRegistration, setSelectedRegistration] =
    useState<TenantRegistration | null>(null);
  const [registrationAction, setRegistrationAction] =
    useState<RegistrationDialogAction | null>(null);

  const registrations = dashboardData.registrations;

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((registration) => {
      const matchesStatus = status === "all" || registration.status === status;
      const matchesPlan = plan === "all" || registration.requestedPlan === plan;

      return matchesStatus && matchesPlan;
    });
  }, [plan, registrations, status]);

  const pendingCount = registrations.filter(
    (registration) => registration.status === "pending",
  ).length;
  const approvedCount = registrations.filter(
    (registration) => registration.status === "approved",
  ).length;
  const rejectedCount = registrations.filter(
    (registration) => registration.status === "rejected",
  ).length;

  const registrationColumns: DataTableColumn<TenantRegistration>[] = [
    {
      id: "company",
      header: "Company",
      accessorFn: (registration) => registration.companyName,
      cell: (registration) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{registration.companyName}</p>
            <p className="text-xs text-muted-foreground">New tenant request</p>
          </div>
        </div>
      ),
    },
    {
      id: "adminContact",
      header: "Admin Contact",
      accessorFn: (registration) => registration.adminName,
      cell: (registration) => (
        <div>
          <p>{registration.adminName}</p>
          <p className="text-xs text-muted-foreground">
            {registration.adminEmail}
          </p>
        </div>
      ),
      exportValue: (registration) =>
        `${registration.adminName} (${registration.adminEmail})`,
    },
    {
      id: "requestedPlan",
      header: "Requested Plan",
      align: "center",
      accessorFn: (registration) => planLabels[registration.requestedPlan],
      cell: (registration) => {
        const plan = planLabels[registration.requestedPlan];
        return <Badge variant="outline" className={planBadgeClass(plan)}>{plan}</Badge>;
      },
    },
    {
      id: "submitted",
      header: "Submitted",
      align: "center",
      accessorFn: (registration) => registration.submittedAt.getTime(),
      cell: (registration) => (
        <div className="text-center">
          <p>{formatDateTime(registration.submittedAt)}</p>
          <p className="text-xs text-muted-foreground">
            {hoursSince(registration.submittedAt)}
          </p>
        </div>
      ),
      exportValue: (registration) => formatDateTime(registration.submittedAt),
    },
    {
      id: "status",
      header: "Status",
      align: "center",
      accessorFn: (registration) => statusLabels[registration.status],
      cell: (registration) => (
        <Badge
          variant="outline"
          className={statusBadgeClass(registration.status)}
        >
          {statusLabels[registration.status]}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      align: "center",
      enableSorting: false,
      enableHiding: false,
      cell: (registration) => (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedRegistration(registration);
              setRegistrationAction("review");
            }}
          >
            Review
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedRegistration(registration);
              setRegistrationAction("approve");
            }}
          >
            Approve
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setSelectedRegistration(registration);
              setRegistrationAction("reject");
            }}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Pending Registrations
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review company signups before tenant provisioning and subscription
            activation.
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Queue
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <DashboardStatCard label="Pending Review" value={pendingCount} description="Waiting for approval" trend="Provisioning queue" icon={FileClock} tone="amber" presentation="tinted" />
        <DashboardStatCard label="Approved" value={approvedCount} description="This queue snapshot" trend="Ready to provision" icon={CheckCircle2} tone="green" presentation="tinted" />
        <DashboardStatCard label="Rejected" value={rejectedCount} description="This queue snapshot" trend="No active rejects" icon={XCircle} tone="red" presentation="tinted" />
        <DashboardStatCard
          label="Oldest Request"
          value={registrations.length ? hoursSince(registrations[registrations.length - 1].submittedAt) : "-"}
          description="Approval queue age"
          trend="Review SLA"
          icon={Clock}
          tone="blue"
          presentation="tinted"
        />
      </div>

      <Card className="border-border/70 bg-card p-4 shadow-sm md:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto] md:items-center md:gap-16">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Registration status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={plan} onValueChange={setPlan}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Requested plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All requested plans</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setStatus("all");
              setPlan("all");
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
            <h2 className="font-semibold">Registration Queue</h2>
            <p className="text-sm text-muted-foreground">
              Showing {filteredRegistrations.length} of {registrations.length}{" "}
              company signup requests.
            </p>
          </div>
        </div>

        <DataTable
          columns={registrationColumns}
          data={filteredRegistrations}
          getRowKey={(registration) => registration.id}
          emptyMessage="No registrations found. Try changing your search or filters."
          features={{
            sorting: true,
            globalFilter: true,
            pagination: true,
            columnVisibility: true,
            export: true,
            rowSelection: true,
          }}
          pageSize={10}
          searchPlaceholder="Search registrations..."
          exportFileName="super-admin-registrations.csv"
        />
      </Card>

      <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 shadow-sm">
        <div className="flex gap-3">
          <FileClock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-200">
            <p className="font-medium">Approval flow reminder</p>
            <p>
              Approving a registration should eventually create the tenant
              workspace, provision the tenant database, activate the
              subscription, and send the welcome email.
            </p>
          </div>
        </div>
      </Card>

      <RegistrationReviewDialog
        registration={selectedRegistration}
        action={registrationAction}
        planLabel={
          selectedRegistration
            ? planLabels[selectedRegistration.requestedPlan]
            : undefined
        }
        onClose={() => {
          setSelectedRegistration(null);
          setRegistrationAction(null);
        }}
      />
    </div>
  );
}
