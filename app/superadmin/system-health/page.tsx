'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DashboardStatCard } from '@/components/superadmin/dashboard/dashboard-stat-card';
import { DataTable, type DataTableColumn } from '@/components/common/data-table';
import { generateSuperAdminDashboardData } from '@/lib/mock-data';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  HardDrive,
  Mail,
  Map,
  RefreshCw,
  Server,
  ShieldCheck,
  Wifi,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const dashboardData = generateSuperAdminDashboardData();

const statusLabels = {
  operational: 'Operational',
  degraded: 'Degraded',
  down: 'Down',
};

const serviceIcons = {
  api: Server,
  backend: ShieldCheck,
  database: Database,
  websocket: Wifi,
  storage: HardDrive,
  email: Mail,
  maps: Map,
  payments: Activity,
};

type MonitoredService = {
  id: keyof typeof serviceIcons;
  name: string;
  status: keyof typeof statusLabels;
  latencyMs: number;
  description: string;
};

const services: MonitoredService[] = [
  {
    id: 'api',
    name: 'API Gateway',
    status: 'operational',
    latencyMs: 118,
    description: 'Routes web and mobile API traffic to Frappe services.',
  },
  {
    id: 'backend',
    name: 'Frappe Backend',
    status: 'operational',
    latencyMs: 214,
    description: 'Authentication, permissions, DocTypes, and CRM business logic.',
  },
  {
    id: 'database',
    name: 'MariaDB / RDS',
    status: 'operational',
    latencyMs: 42,
    description: 'Tenant databases and shared tenant metadata storage.',
  },
  {
    id: 'websocket',
    name: 'WebSocket Service',
    status: 'operational',
    latencyMs: 88,
    description: 'Live dashboard, notification, and tracking event delivery.',
  },
  {
    id: 'storage',
    name: 'File Storage / S3',
    status: 'operational',
    latencyMs: 96,
    description: 'Documents, attachments, photos, and generated exports.',
  },
  {
    id: 'email',
    name: 'Email Service',
    status: 'operational',
    latencyMs: 151,
    description: 'Verification, welcome, password reset, and notification emails.',
  },
  {
    id: 'maps',
    name: 'Maps Integration',
    status: 'degraded',
    latencyMs: 412,
    description: 'Route planning, dispatch maps, and location services.',
  },
  {
    id: 'payments',
    name: 'Payment Provider',
    status: 'operational',
    latencyMs: 189,
    description: 'Subscription billing and invoice payment status sync.',
  },
];

const responseTimeTrend = [
  { time: '09:00', response: 238, errorRate: 0.21 },
  { time: '10:00', response: 226, errorRate: 0.18 },
  { time: '11:00', response: 248, errorRate: 0.24 },
  { time: '12:00', response: 312, errorRate: 0.39 },
  { time: '13:00', response: 214, errorRate: 0.18 },
];

function statusBadgeClass(status: string) {
  if (status === 'operational') {
    return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900';
  }

  if (status === 'degraded') {
    return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900';
  }

  if (status === 'down') {
    return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900';
  }

  return '';
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export default function SuperAdminSystemHealthPage() {
  const { systemHealth, alerts } = dashboardData;
  const degradedServices = services.filter((service) => service.status === 'degraded').length;
  const downServices = services.filter((service) => service.status === 'down').length;
  const overallStatus = downServices > 0 ? 'down' : degradedServices > 0 ? 'degraded' : 'operational';

  const serviceColumns: DataTableColumn<(typeof services)[number]>[] = [
    {
      id: 'service',
      header: 'Service',
      accessorFn: (service) => service.name,
      cell: (service) => {
        const Icon = serviceIcons[service.id];

        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="font-medium">{service.name}</span>
          </div>
        );
      },
    },
    {
      id: 'status',
      header: 'Status',
      align: 'center',
      accessorFn: (service) => statusLabels[service.status],
      cell: (service) => (
        <Badge variant="outline" className={statusBadgeClass(service.status)}>
          {statusLabels[service.status]}
        </Badge>
      ),
    },
    {
      id: 'latency',
      header: 'Latency',
      align: 'center',
      accessorFn: (service) => service.latencyMs,
      cell: (service) => `${service.latencyMs}ms`,
    },
    {
      id: 'description',
      header: 'Description',
      accessorFn: (service) => service.description,
      cell: (service) => <span className="text-muted-foreground">{service.description}</span>,
    },
    {
      id: 'action',
      header: 'Action',
      align: 'center',
      enableSorting: false,
      enableHiding: false,
      cell: () => <Button variant="outline" size="sm">View Logs</Button>,
    },
  ];

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">System Health</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Monitor platform services, uptime, latency, and operational status.
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <Card className="min-h-[178px] border-border/70 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <span className="text-sm text-muted-foreground">Overall Status</span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <Badge variant="outline" className={statusBadgeClass(overallStatus)}>
            {statusLabels[overallStatus]}
          </Badge>
          <p className="text-xs text-muted-foreground mt-3">{services.length} monitored services</p>
        </Card>

        <Card className="min-h-[178px] border-border/70 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <span className="text-sm text-muted-foreground">API</span>
            <Server className="w-4 h-4 text-primary" />
          </div>
          <Badge variant="outline" className={statusBadgeClass(systemHealth.apiStatus)}>
            {statusLabels[systemHealth.apiStatus]}
          </Badge>
        </Card>

        <Card className="min-h-[178px] border-border/70 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <span className="text-sm text-muted-foreground">Database</span>
            <Database className="w-4 h-4 text-primary" />
          </div>
          <Badge variant="outline" className={statusBadgeClass(systemHealth.databaseStatus)}>
            {statusLabels[systemHealth.databaseStatus]}
          </Badge>
        </Card>

        <Card className="min-h-[178px] border-border/70 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <span className="text-sm text-muted-foreground">WebSocket</span>
            <Wifi className="w-4 h-4 text-primary" />
          </div>
          <Badge variant="outline" className={statusBadgeClass(systemHealth.websocketStatus)}>
            {statusLabels[systemHealth.websocketStatus]}
          </Badge>
        </Card>

        <DashboardStatCard label="Avg Response" value={`${systemHealth.avgResponseTimeMs}ms`} description="Target below 500ms" trend="Within target" icon={Clock} tone="blue" />
        <DashboardStatCard label="Uptime" value={`${systemHealth.uptime}%`} description="Current period" trend="Healthy" icon={Activity} tone="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
          <div className="border-b border-border/70 bg-muted/20 p-6">
            <h2 className="font-semibold">Response Time Trend</h2>
            <p className="text-sm text-muted-foreground">Hourly API response time.</p>
          </div>
          <div className="p-6">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={responseTimeTrend}>
              <defs>
                <linearGradient id="responseFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.24} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/70" vertical={false} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
              <YAxis axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  boxShadow: 'var(--shadow-md)',
                }}
              />
              <Area type="monotone" dataKey="response" stroke="#2563eb" strokeWidth={3} fill="url(#responseFill)" dot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
          </div>
        </Card>

        <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
          <div className="border-b border-border/70 bg-muted/20 p-6">
            <h2 className="font-semibold">Error Rate Trend</h2>
            <p className="text-sm text-muted-foreground">Observed platform error percentage.</p>
          </div>
          <div className="p-6">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={responseTimeTrend}>
              <defs>
                <linearGradient id="errorFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.26} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/70" vertical={false} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
              <YAxis axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  boxShadow: 'var(--shadow-md)',
                }}
              />
              <Area type="monotone" dataKey="errorRate" stroke="#f59e0b" strokeWidth={3} fill="url(#errorFill)" dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden border-border/70 bg-card shadow-sm">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border/70 bg-muted/20">
          <div>
            <h2 className="font-semibold">Service Status</h2>
            <p className="text-sm text-muted-foreground">
              Last checked {formatDateTime(systemHealth.checkedAt)}.
            </p>
          </div>
        </div>

        <DataTable
          columns={serviceColumns}
          data={[...services]}
          getRowKey={(service) => service.id}
          emptyMessage="No monitored services found"
          features={{ sorting: true, globalFilter: true, pagination: false, columnVisibility: true, export: true }}
          searchPlaceholder="Search services..."
          exportFileName="super-admin-service-status.csv"
        />
      </Card>

      <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
        <div className="border-b border-border/70 bg-muted/20 p-6">
          <h2 className="font-semibold">Recent Incidents and Alerts</h2>
          <p className="text-sm text-muted-foreground">Latest platform alerts from monitoring.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-6">
          {alerts.map((alert) => (
            <div key={alert.id} className="rounded-lg border border-border/70 bg-background p-4 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{alert.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                </div>
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground mt-3">{formatDateTime(alert.createdAt)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
