'use client';

import { ProtectedRoute } from '@/lib/protected-route';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Activity, BarChart3, Bell, Building2, CreditCard, FileClock, Settings, ShieldCheck } from 'lucide-react';

const superAdminNavItems = [
  { href: '/superadmin/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/superadmin/tenants', label: 'Tenants', icon: Building2 },
  { href: '/superadmin/registrations', label: 'Registrations', icon: FileClock },
  { href: '/superadmin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/superadmin/system-health', label: 'System Health', icon: Activity },
  { href: '/superadmin/logs', label: 'Logs', icon: Bell },
  { href: '/superadmin/settings', label: 'Settings', icon: Settings },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={['superadmin']}>
      <DashboardShell
        brand={{
          title: 'CRM Super Admin',
          subtitle: 'Platform Owner',
          icon: ShieldCheck,
          href: '/superadmin/dashboard',
        }}
        items={superAdminNavItems}
        userLabel="Platform Owner"
      >
        {children}
      </DashboardShell>
    </ProtectedRoute>
  );
}
