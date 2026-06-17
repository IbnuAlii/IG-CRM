"use client";

import { ProtectedRoute } from "@/lib/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  BarChart3,
  CalendarCheck,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  ReceiptText,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const hrNavItems = [
  { href: "/hr/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hr/employees", label: "Employees", icon: UsersRound },
  { href: "/hr/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/hr/leave", label: "Leave", icon: ClipboardCheck },
  { href: "/hr/payroll", label: "Payroll", icon: ReceiptText },
  { href: "/hr/training", label: "Training", icon: GraduationCap },
  { href: "/hr/reports", label: "Reports", icon: BarChart3 },
];

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={["hr_officer"]}>
      <DashboardShell
        brand={{
          title: "HR Console",
          subtitle: "People Operations",
          icon: ShieldCheck,
          href: "/hr/dashboard",
        }}
        items={hrNavItems}
        userLabel="HR Officer"
      >
        {children}
      </DashboardShell>
    </ProtectedRoute>
  );
}
