'use client';

import { ProtectedRoute } from '@/lib/protected-route';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarClock,
  FileText,
  Headphones,
  LayoutDashboard,
  Settings,
  Shield,
  Truck,
  Users,
  Wrench,
} from 'lucide-react';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/quotes', label: 'Quotes', icon: FileText },
  { href: '/admin/tickets', label: 'Tickets', icon: Headphones },
  { href: '/admin/jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { href: '/admin/dispatch', label: 'Dispatch', icon: CalendarClock },
  { href: '/admin/team', label: 'Team', icon: Wrench },
  { href: '/fleet/dashboard', label: 'Fleet', icon: Truck },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <DashboardShell
        brand={{
          title: 'CRM Admin',
          subtitle: 'Company Operations',
          icon: Shield,
          href: '/admin/dashboard',
        }}
        items={adminNavItems}
        userLabel="Company Admin"
      >
        {children}
      </DashboardShell>
    </ProtectedRoute>
  );
}
