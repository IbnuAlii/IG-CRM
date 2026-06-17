'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DashboardStatCard } from '@/components/superadmin/dashboard/dashboard-stat-card';
import { DataTable, type DataTableColumn } from '@/components/common/data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateSuperAdminDashboardData } from '@/lib/mock-data';
import { AlertTriangle, CheckCircle2, Download, FileText, KeyRound, RotateCcw, ShieldAlert, SlidersHorizontal, UserCog } from 'lucide-react';

const dashboardData = generateSuperAdminDashboardData();

type LogSeverity = 'info' | 'warning' | 'critical';
type LogCategory = 'system' | 'billing' | 'tenant' | 'security';

type PlatformLog = {
  id: string;
  title: string;
  description: string;
  category: LogCategory;
  severity: LogSeverity;
  resolved: boolean;
  createdAt: Date;
  actor?: string;
  ipAddress?: string;
  resource?: string;
};

const logs: PlatformLog[] = [
  {
    id: 'log_1',
    title: 'Tenant registration submitted',
    description: 'Summit Garage Doors submitted a new Professional plan registration.',
    category: 'tenant',
    severity: 'info',
    resolved: false,
    createdAt: new Date('2026-05-18T09:30:00'),
    actor: 'Public registration',
    ipAddress: '198.51.100.21',
    resource: 'tenant_registration',
  },
  {
    id: 'log_2',
    title: 'Payment retry required',
    description: 'RapidFix Electrical has a past due subscription invoice.',
    category: 'billing',
    severity: 'warning',
    resolved: false,
    createdAt: new Date('2026-05-19T08:40:00'),
    actor: 'Stripe webhook',
    ipAddress: '52.15.44.12',
    resource: 'subscription_invoice',
  },
  {
    id: 'log_3',
    title: 'API latency spike resolved',
    description: 'Average response time returned below the 500ms target.',
    category: 'system',
    severity: 'info',
    resolved: true,
    createdAt: new Date('2026-05-18T12:15:00'),
    actor: 'APM monitor',
    ipAddress: '10.0.4.18',
    resource: 'api_gateway',
  },
  {
    id: 'log_4',
    title: 'Suspicious login attempt',
    description: 'Multiple failed Super Admin login attempts were detected from an unknown IP address.',
    category: 'security',
    severity: 'critical',
    resolved: false,
    createdAt: new Date('2026-05-19T06:12:00'),
    actor: 'unknown',
    ipAddress: '203.0.113.77',
    resource: 'super_admin_login',
  },
  {
    id: 'log_5',
    title: 'Database backup completed',
    description: 'Scheduled tenant database backups completed successfully.',
    category: 'system',
    severity: 'info',
    resolved: true,
    createdAt: new Date('2026-05-19T03:00:00'),
    actor: 'backup scheduler',
    ipAddress: '10.0.1.25',
    resource: 'tenant_databases',
  },
  {
    id: 'log_6',
    title: 'Tenant suspended',
    description: 'RapidFix Electrical workspace was suspended after billing status changed to past due.',
    category: 'tenant',
    severity: 'warning',
    resolved: false,
    createdAt: new Date('2026-05-19T09:05:00'),
    actor: 'Demo User',
    ipAddress: '192.0.2.10',
    resource: 'tenant_lifecycle',
  },
];

const auditCoverage = [
  {
    label: 'Authentication',
    detail: 'Login attempts, lockouts, password reset events',
    retention: '90 days access / 1 year security',
    icon: KeyRound,
  },
  {
    label: 'Admin Actions',
    detail: 'Tenant lifecycle, exports, approvals, billing changes',
    retention: '7 years audit',
    icon: UserCog,
  },
  {
    label: 'Configuration Changes',
    detail: 'Security defaults, integrations, tenant settings',
    retention: '7 years audit',
    icon: SlidersHorizontal,
  },
] as const;

const severityLabels = {
  info: 'Info',
  warning: 'Warning',
  critical: 'Critical',
};

const categoryLabels = {
  system: 'System',
  billing: 'Billing',
  tenant: 'Tenant',
  security: 'Security',
};

function severityBadgeClass(severity: string) {
  if (severity === 'info') {
    return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900';
  }

  if (severity === 'warning') {
    return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900';
  }

  if (severity === 'critical') {
    return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900';
  }

  return '';
}

function statusBadgeClass(resolved: boolean) {
  return resolved
    ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900'
    : 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900';
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export default function SuperAdminLogsPage() {
  const [severity, setSeverity] = useState('all');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');

  const allLogs = useMemo(() => {
    const alertLogs = dashboardData.alerts.map((alert) => ({
      id: `alert_${alert.id}`,
      title: alert.title,
      description: alert.description,
      category: (alert.title.toLowerCase().includes('payment') ? 'billing' : 'system') as LogCategory,
      severity: alert.severity,
      resolved: alert.resolved,
      createdAt: alert.createdAt,
      actor: 'system monitor',
      ipAddress: '10.0.2.14',
      resource: 'system_alert',
    }));

    return [...logs, ...alertLogs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, []);

  const filteredLogs = useMemo(() => {
    return allLogs.filter((log) => {
      const matchesSeverity = severity === 'all' || log.severity === severity;
      const matchesStatus =
        status === 'all' || (status === 'resolved' ? log.resolved : !log.resolved);
      const matchesCategory = category === 'all' || log.category === category;

      return matchesSeverity && matchesStatus && matchesCategory;
    });
  }, [allLogs, category, severity, status]);

  const openAlerts = allLogs.filter((log) => !log.resolved).length;
  const criticalAlerts = allLogs.filter((log) => log.severity === 'critical').length;
  const warningAlerts = allLogs.filter((log) => log.severity === 'warning').length;
  const resolvedAlerts = allLogs.filter((log) => log.resolved).length;

  const logColumns: DataTableColumn<PlatformLog>[] = [
    {
      id: 'time',
      header: 'Time',
      align: 'center',
      accessorFn: (log) => log.createdAt.getTime(),
      cell: (log) => <span className="whitespace-nowrap">{formatDateTime(log.createdAt)}</span>,
      exportValue: (log) => formatDateTime(log.createdAt),
    },
    {
      id: 'severity',
      header: 'Severity',
      align: 'center',
      accessorFn: (log) => severityLabels[log.severity],
      cell: (log) => (
        <Badge variant="outline" className={severityBadgeClass(log.severity)}>
          {severityLabels[log.severity]}
        </Badge>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      align: 'center',
      accessorFn: (log) => categoryLabels[log.category],
      cell: (log) => categoryLabels[log.category],
    },
    {
      id: 'actor',
      header: 'Actor / IP',
      accessorFn: (log) => `${log.actor ?? ''} ${log.ipAddress ?? ''}`,
      cell: (log) => (
        <div>
          <p className="font-medium">{log.actor ?? 'System'}</p>
          <p className="text-xs text-muted-foreground">{log.ipAddress ?? 'internal'}</p>
        </div>
      ),
      exportValue: (log) => `${log.actor ?? 'System'} (${log.ipAddress ?? 'internal'})`,
    },
    {
      id: 'resource',
      header: 'Resource',
      align: 'center',
      accessorFn: (log) => log.resource,
      cell: (log) => <span className="text-sm">{log.resource ?? '-'}</span>,
    },
    {
      id: 'event',
      header: 'Event',
      accessorFn: (log) => `${log.title} ${log.description}`,
      cell: (log) => (
        <div>
          <p className="font-medium">{log.title}</p>
          <p className="text-xs text-muted-foreground">{log.description}</p>
        </div>
      ),
      exportValue: (log) => `${log.title} - ${log.description}`,
    },
    {
      id: 'status',
      header: 'Status',
      align: 'center',
      accessorFn: (log) => (log.resolved ? 'Resolved' : 'Open'),
      cell: (log) => (
        <Badge variant="outline" className={statusBadgeClass(log.resolved)}>
          {log.resolved ? 'Resolved' : 'Open'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'center',
      enableSorting: false,
      enableHiding: false,
      cell: (log) => (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm">View Details</Button>
          {!log.resolved ? <Button variant="outline" size="sm">Mark Resolved</Button> : null}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Logs & Alerts</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review platform events, security activity, and operational alerts.
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <DashboardStatCard label="Open Alerts" value={openAlerts} description="Require review" trend="Action queue" icon={AlertTriangle} tone="amber" />
        <DashboardStatCard label="Critical" value={criticalAlerts} description="Security or outage risk" trend="High priority" icon={ShieldAlert} tone="red" />
        <DashboardStatCard label="Warnings" value={warningAlerts} description="Needs attention" trend="Monitor" icon={FileText} tone="amber" />
        <DashboardStatCard label="Resolved" value={resolvedAlerts} description="Closed events" trend="Audit retained" icon={CheckCircle2} tone="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {auditCoverage.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="border-border/70 bg-card p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold">{item.label}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
                  <Badge variant="outline" className="mt-3">{item.retention}</Badge>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="border-border/70 bg-card p-4 shadow-sm md:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center md:gap-8">
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severities</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="tenant">Tenant</SelectItem>
              <SelectItem value="security">Security</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSeverity('all');
              setStatus('all');
              setCategory('all');
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
            <h2 className="font-semibold">Event Timeline</h2>
            <p className="text-sm text-muted-foreground">
              Showing {filteredLogs.length} of {allLogs.length} platform events.
            </p>
          </div>
        </div>

        <DataTable
          columns={logColumns}
          data={filteredLogs}
          getRowKey={(log) => log.id}
          emptyMessage="No logs found. Try changing your search or filters."
          features={{ sorting: true, globalFilter: true, pagination: true, columnVisibility: true, export: true }}
          pageSize={10}
          searchPlaceholder="Search logs..."
          exportFileName="super-admin-logs.csv"
        />
      </Card>
    </div>
  );
}
