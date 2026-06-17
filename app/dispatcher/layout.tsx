"use client";

import { ProtectedRoute } from "@/lib/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  AlertTriangle,
  BarChart3,
  BriefcaseBusiness,
  CalendarClock,
  LayoutDashboard,
  Map,
  Radio,
  Wrench,
} from "lucide-react";

const dispatcherNavItems = [
  { href: "/dispatcher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dispatcher/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/dispatcher/schedule", label: "Schedule", icon: CalendarClock },
  { href: "/dispatcher/technicians", label: "Technicians", icon: Wrench },
  { href: "/dispatcher/routes", label: "Routes", icon: Map },
  { href: "/dispatcher/emergency", label: "Emergency", icon: AlertTriangle },
  { href: "/dispatcher/reports", label: "Reports", icon: BarChart3 },
];

export default function DispatcherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={["dispatcher"]}>
      <DashboardShell
        brand={{
          title: "Dispatch Console",
          subtitle: "Scheduling Operations",
          icon: Radio,
          href: "/dispatcher/dashboard",
        }}
        items={dispatcherNavItems}
        userLabel="Dispatcher"
      >
        {children}
      </DashboardShell>
    </ProtectedRoute>
  );
}
