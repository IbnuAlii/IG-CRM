"use client";

import {
  BarChart3,
  CreditCard,
  FileText,
  LayoutDashboard,
  ReceiptText,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { ProtectedRoute } from "@/lib/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";

const accountantNavItems = [
  { href: "/accountant/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/accountant/invoices", label: "Invoices", icon: ReceiptText },
  { href: "/accountant/payments", label: "Payments", icon: CreditCard },
  { href: "/accountant/payroll", label: "Payroll", icon: WalletCards },
  { href: "/accountant/customers", label: "Customer Billing", icon: UsersRound },
  { href: "/accountant/reports", label: "Reports", icon: BarChart3 },
];

export default function AccountantLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={["accountant", "admin"]}>
      <DashboardShell
        brand={{
          title: "Accounting Console",
          subtitle: "Finance Operations",
          icon: FileText,
          href: "/accountant/dashboard",
        }}
        items={accountantNavItems}
        userLabel="Accountant"
      >
        {children}
      </DashboardShell>
    </ProtectedRoute>
  );
}
