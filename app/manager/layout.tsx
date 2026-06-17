"use client";

import { BarChart3, BriefcaseBusiness, CalendarDays, ClipboardCheck, DollarSign, LayoutDashboard, ListChecks, UsersRound } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProtectedRoute } from "@/lib/protected-route";

const managerNavItems = [
  { href: "/manager/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/manager/team", label: "Team", icon: UsersRound },
  { href: "/manager/operations", label: "Operations", icon: BriefcaseBusiness },
  { href: "/manager/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/manager/customers", label: "Customers", icon: UsersRound },
  { href: "/manager/approvals", label: "Approvals", icon: ClipboardCheck },
  { href: "/manager/reports", label: "Reports", icon: BarChart3 },
  { href: "/manager/finance", label: "Limited Finance", icon: DollarSign },
];

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={["manager", "admin"]}>
      <DashboardShell
        brand={{
          title: "Manager Console",
          subtitle: "Team Operations",
          icon: ListChecks,
          href: "/manager/dashboard",
        }}
        items={managerNavItems}
        userLabel="Manager"
      >
        {children}
      </DashboardShell>
    </ProtectedRoute>
  );
}
