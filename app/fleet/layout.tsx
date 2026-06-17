"use client";

import { ProtectedRoute } from "@/lib/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  BarChart3,
  Fuel,
  History,
  LayoutDashboard,
  MapPinned,
  Users,
  Radar,
  ShieldAlert,
  Truck,
  Wrench,
} from "lucide-react";

const fleetNavItems = [
  { href: "/fleet/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/fleet/vehicles", label: "Vehicles", icon: Truck },
  { href: "/fleet/drivers", label: "Drivers", icon: Users },
  { href: "/fleet/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/fleet/fuel", label: "Fuel", icon: Fuel },
  { href: "/fleet/tracking", label: "Tracking", icon: Radar },
  { href: "/fleet/routes", label: "Route History", icon: History },
  { href: "/fleet/geofences", label: "Geo-fences", icon: MapPinned },
  { href: "/fleet/reports", label: "Reports", icon: BarChart3 },
];

export default function FleetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={["fleet_manager", "admin"]}>
      <DashboardShell
        brand={{
          title: "Fleet Console",
          subtitle: "Vehicles & GPS",
          icon: ShieldAlert,
          href: "/fleet/dashboard",
        }}
        items={fleetNavItems}
        userLabel="Fleet Manager"
      >
        {children}
      </DashboardShell>
    </ProtectedRoute>
  );
}
