#!/usr/bin/env node
/**
 * Regenerates docs/10_FRONTEND_ROUTE_INVENTORY.md from app page routes.
 * Run: node scripts/generate-route-inventory.mjs
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const appDir = path.join(root, "app");
const outFile = path.join(root, "docs", "10_FRONTEND_ROUTE_INVENTORY.md");

/** @type {Record<string, { purpose: string; actions: string; states: string; status?: string }>} */
const ROUTE_META = {
  "/": {
    purpose: "Root redirect / landing",
    actions: "Navigate to login or role home",
    states: "loading, redirect",
  },
  "/login": {
    purpose: "User authentication",
    actions: "Sign in, forgot password link",
    states: "loading, error, validation",
  },
  "/forgot-password": {
    purpose: "Password recovery request",
    actions: "Submit email",
    states: "loading, error, success",
  },
  "/reset-password": {
    purpose: "Set new password",
    actions: "Submit new password",
    states: "loading, error, validation",
  },
  "/two-factor": {
    purpose: "Two-factor verification",
    actions: "Enter OTP code",
    states: "loading, error",
  },
  "/verify-email": {
    purpose: "Email verification",
    actions: "Confirm verification",
    states: "loading, error, success",
  },
  "/admin": {
    purpose: "Admin portal index redirect",
    actions: "Redirect to dashboard",
    states: "redirect",
    status: "implemented",
  },
  "/admin/dashboard": {
    purpose: "Admin operations overview",
    actions: "Review KPIs, open modules",
    states: "loading, empty, error",
  },
  "/admin/customers": {
    purpose: "Customer directory",
    actions: "Search, filter, open customer",
    states: "loading, empty, error, permission denied",
  },
  "/admin/customers/[id]": {
    purpose: "Customer detail",
    actions: "View profile, related tabs",
    states: "loading, error, not found, permission denied",
  },
  "/admin/quotes": {
    purpose: "Quote list",
    actions: "Filter quotes, open detail",
    states: "loading, empty, error",
  },
  "/admin/quotes/[id]": {
    purpose: "Quote detail",
    actions: "Review line items, status",
    states: "loading, error, not found",
  },
  "/admin/tickets": {
    purpose: "Support tickets",
    actions: "Filter, open ticket",
    states: "loading, empty, error",
  },
  "/admin/tickets/[id]": {
    purpose: "Ticket conversation",
    actions: "Reply, update status",
    states: "loading, error, not found",
  },
  "/admin/jobs": {
    purpose: "Job list",
    actions: "Filter jobs, open job",
    states: "loading, empty, error",
  },
  "/admin/jobs/[id]": {
    purpose: "Job detail",
    actions: "View timeline, assign technician",
    states: "loading, error, not found",
  },
  "/admin/dispatch": {
    purpose: "Dispatch board",
    actions: "View map, assign routes",
    states: "loading, error",
  },
  "/admin/team": {
    purpose: "Team management",
    actions: "View technicians, roles",
    states: "loading, empty, error",
  },
  "/admin/drivers": {
    purpose: "Driver roster (admin)",
    actions: "Browse drivers",
    states: "loading, empty, error",
  },
  "/admin/rides": {
    purpose: "Rides overview",
    actions: "Monitor rides",
    states: "loading, empty, error",
  },
  "/admin/reports": {
    purpose: "Admin reports",
    actions: "Select report, export",
    states: "loading, empty, error",
  },
  "/admin/analytics": {
    purpose: "Analytics dashboards",
    actions: "Review charts",
    states: "loading, error",
  },
  "/admin/settings": {
    purpose: "Company settings",
    actions: "Update preferences",
    states: "loading, error, validation",
  },
  "/customer": {
    purpose: "Customer portal redirect",
    actions: "Redirect to home",
    states: "redirect",
  },
  "/customer/home": {
    purpose: "Customer portal home",
    actions: "Request service, view appointments",
    states: "loading, empty, error",
  },
  "/customer/active-service": {
    purpose: "Active service tracking",
    actions: "Track technician, contact support",
    states: "loading, empty, error",
  },
  "/customer/active-rides": {
    purpose: "Active rides (legacy alias)",
    actions: "View active ride",
    states: "loading, empty, error",
    status: "needs QA",
  },
  "/customer/quotes": {
    purpose: "Quote review",
    actions: "Approve or decline quotes",
    states: "loading, empty, error",
  },
  "/customer/billing": {
    purpose: "Billing and invoices",
    actions: "View invoices, payment methods",
    states: "loading, empty, error",
  },
  "/customer/support": {
    purpose: "Support tickets",
    actions: "Create ticket, view history",
    states: "loading, empty, error",
  },
  "/customer/history": {
    purpose: "Service history",
    actions: "Browse past services",
    states: "loading, empty, error",
  },
  "/customer/account": {
    purpose: "Account settings",
    actions: "Edit profile, addresses, payments",
    states: "loading, error, validation",
  },
  "/customer/service/[id]": {
    purpose: "Service appointment detail",
    actions: "View status, reschedule",
    states: "loading, error, not found",
  },
  "/customer/ride/[id]": {
    purpose: "Ride detail",
    actions: "Track ride progress",
    states: "loading, error, not found",
  },
  "/driver": {
    purpose: "Driver portal redirect",
    actions: "Redirect to dashboard",
    states: "redirect",
  },
  "/driver/dashboard": {
    purpose: "Technician dashboard",
    actions: "View today jobs, stats",
    states: "loading, empty, error",
  },
  "/driver/jobs": {
    purpose: "Assigned jobs list",
    actions: "Filter jobs, open detail",
    states: "loading, empty, error",
  },
  "/driver/jobs/[id]": {
    purpose: "Job detail and status workflow",
    actions: "Update status, photos, signature",
    states: "loading, error, not found",
  },
  "/driver/schedule": {
    purpose: "Work schedule",
    actions: "View calendar",
    states: "loading, empty, error",
  },
  "/driver/route": {
    purpose: "Route map view",
    actions: "Navigate stops",
    states: "loading, error",
  },
  "/driver/performance": {
    purpose: "Performance metrics",
    actions: "Review KPIs",
    states: "loading, error",
  },
  "/driver/earnings": {
    purpose: "Earnings summary",
    actions: "View payouts",
    states: "loading, empty, error",
  },
  "/driver/available-rides": {
    purpose: "Available ride offers",
    actions: "Accept or decline rides",
    states: "loading, empty, error",
  },
  "/driver/profile": {
    purpose: "Technician profile",
    actions: "Edit profile, certifications",
    states: "loading, error, validation",
  },
  "/dispatcher": {
    purpose: "Dispatcher redirect",
    actions: "Redirect to dashboard",
    states: "redirect",
  },
  "/dispatcher/dashboard": {
    purpose: "Dispatch overview",
    actions: "Monitor queue, KPIs",
    states: "loading, error",
  },
  "/dispatcher/jobs": {
    purpose: "Dispatch job list",
    actions: "Assign, reschedule",
    states: "loading, empty, error",
  },
  "/dispatcher/jobs/[id]": {
    purpose: "Dispatch job detail",
    actions: "Edit assignment",
    states: "loading, error, not found",
  },
  "/dispatcher/schedule": {
    purpose: "Schedule board",
    actions: "Drag jobs, filter",
    states: "loading, error",
  },
  "/dispatcher/technicians": {
    purpose: "Technician availability",
    actions: "View capacity",
    states: "loading, empty, error",
  },
  "/dispatcher/routes": {
    purpose: "Route planning",
    actions: "Optimize routes",
    states: "loading, error",
  },
  "/dispatcher/emergency": {
    purpose: "Emergency queue",
    actions: "Escalate, assign",
    states: "loading, empty, error",
  },
  "/dispatcher/reports": {
    purpose: "Dispatcher reports",
    actions: "Export metrics",
    states: "loading, error",
  },
  "/superadmin/dashboard": {
    purpose: "Platform overview",
    actions: "Review tenants, health",
    states: "loading, error",
  },
  "/superadmin/tenants": {
    purpose: "Tenant directory",
    actions: "Search tenants, open detail",
    states: "loading, empty, error",
  },
  "/superadmin/tenants/[id]": {
    purpose: "Tenant detail",
    actions: "Manage plan, limits",
    states: "loading, error, not found",
  },
  "/superadmin/registrations": {
    purpose: "Pending registrations",
    actions: "Approve or reject",
    states: "loading, empty, error",
  },
  "/superadmin/subscriptions": {
    purpose: "Subscription management",
    actions: "Edit plans (UI may be simulated)",
    states: "loading, empty, error",
  },
  "/superadmin/system-health": {
    purpose: "System health monitoring",
    actions: "View service status",
    states: "loading, error",
  },
  "/superadmin/logs": {
    purpose: "Platform audit logs",
    actions: "Filter logs",
    states: "loading, empty, error",
  },
  "/superadmin/settings": {
    purpose: "Platform settings",
    actions: "Configure platform",
    states: "loading, error",
  },
  "/hr": {
    purpose: "HR portal redirect",
    actions: "Redirect to dashboard",
    states: "redirect",
  },
  "/hr/dashboard": {
    purpose: "HR overview",
    actions: "Review workforce KPIs",
    states: "loading, error",
  },
  "/hr/employees": {
    purpose: "Employee directory",
    actions: "Search employees",
    states: "loading, empty, error",
  },
  "/hr/attendance": {
    purpose: "Attendance tracking",
    actions: "Review timesheets",
    states: "loading, empty, error",
  },
  "/hr/leave": {
    purpose: "Leave management",
    actions: "Approve requests",
    states: "loading, empty, error",
  },
  "/hr/payroll": {
    purpose: "Payroll runs",
    actions: "Review payroll",
    states: "loading, empty, error",
  },
  "/hr/training": {
    purpose: "Training and certifications",
    actions: "Track compliance",
    states: "loading, empty, error",
  },
  "/hr/reports": {
    purpose: "HR reports",
    actions: "Export reports",
    states: "loading, error",
  },
  "/fleet": {
    purpose: "Fleet portal redirect",
    actions: "Redirect to dashboard",
    states: "redirect",
  },
  "/fleet/dashboard": {
    purpose: "Fleet overview map",
    actions: "Monitor vehicles",
    states: "loading, error",
  },
  "/fleet/vehicles": {
    purpose: "Vehicle directory",
    actions: "Add vehicle, open detail",
    states: "loading, empty, error",
  },
  "/fleet/drivers": {
    purpose: "Fleet drivers",
    actions: "Assign drivers",
    states: "loading, empty, error",
  },
  "/fleet/maintenance": {
    purpose: "Maintenance schedule",
    actions: "Log service",
    states: "loading, empty, error",
  },
  "/fleet/fuel": {
    purpose: "Fuel logs",
    actions: "Record fuel entries",
    states: "loading, empty, error",
  },
  "/fleet/tracking": {
    purpose: "Live GPS tracking",
    actions: "Track vehicles on map",
    states: "loading, error",
  },
  "/fleet/routes": {
    purpose: "Route history",
    actions: "Review past routes",
    states: "loading, empty, error",
  },
  "/fleet/geofences": {
    purpose: "Geofence management",
    actions: "Create geofences",
    states: "loading, empty, error",
  },
  "/fleet/reports": {
    purpose: "Fleet reports",
    actions: "Run behavior reports",
    states: "loading, error",
  },
  "/manager": {
    purpose: "Manager redirect",
    actions: "Redirect to dashboard",
    states: "redirect",
  },
  "/manager/dashboard": {
    purpose: "Manager overview",
    actions: "Review team KPIs",
    states: "loading, error",
  },
  "/manager/team": {
    purpose: "Team roster",
    actions: "View team performance",
    states: "loading, empty, error",
  },
  "/manager/operations": {
    purpose: "Operations board",
    actions: "Monitor jobs",
    states: "loading, error",
  },
  "/manager/schedule": {
    purpose: "Team schedule",
    actions: "View calendar",
    states: "loading, empty, error",
  },
  "/manager/customers": {
    purpose: "Customer oversight",
    actions: "Review accounts",
    states: "loading, empty, error",
  },
  "/manager/approvals": {
    purpose: "Approval queue",
    actions: "Approve quotes/expenses",
    states: "loading, empty, error",
  },
  "/manager/reports": {
    purpose: "Manager reports",
    actions: "Export data",
    states: "loading, error",
  },
  "/manager/finance": {
    purpose: "Limited finance view",
    actions: "View summaries (read-only scope)",
    states: "loading, error, permission denied",
  },
  "/accountant": {
    purpose: "Accountant redirect",
    actions: "Redirect to dashboard",
    states: "redirect",
  },
  "/accountant/dashboard": {
    purpose: "Accounting overview",
    actions: "Review AR/AP KPIs",
    states: "loading, error",
  },
  "/accountant/invoices": {
    purpose: "Invoice management",
    actions: "Create, send invoices",
    states: "loading, empty, error",
  },
  "/accountant/payments": {
    purpose: "Payment processing",
    actions: "Record payments",
    states: "loading, empty, error",
  },
  "/accountant/payroll": {
    purpose: "Payroll visibility",
    actions: "Review payroll runs",
    states: "loading, empty, error",
  },
  "/accountant/customers": {
    purpose: "Customer billing",
    actions: "Manage billing accounts",
    states: "loading, empty, error",
  },
  "/accountant/reports": {
    purpose: "Financial reports",
    actions: "Export ledgers",
    states: "loading, error",
  },
};

const PORTAL_ROLES = {
  admin: "Admin",
  superadmin: "Super Admin",
  dispatcher: "Dispatcher",
  customer: "Customer",
  driver: "Driver / Technician",
  hr: "HR",
  fleet: "Fleet",
  manager: "Manager",
  accountant: "Accountant",
  login: "Auth",
  "forgot-password": "Auth",
  "reset-password": "Auth",
  "two-factor": "Auth",
  "verify-email": "Auth",
  "": "Root",
};

async function walkPages(dir, segments = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  const pages = [];

  for (const entry of entries) {
    const next = [...segments, entry.name];
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      pages.push(...(await walkPages(full, next)));
    } else if (entry.name === "page.tsx") {
      const routeSegments = segments;
      const route =
        routeSegments.length === 0
          ? "/"
          : "/" + routeSegments.join("/").replace(/\[([^\]]+)\]/g, "[$1]");
      pages.push(route);
    }
  }

  return pages;
}

function routeKey(route) {
  return route.replace(/\/([^/]+)\/([^/]+)$/g, (m, a, b) => {
    if (a.match(/^[a-f0-9-]{36}$/i) || !a.startsWith("[")) return m;
    return m;
  });
}

function inferPortal(route) {
  if (route === "/") return "Root";
  const seg = route.split("/").filter(Boolean)[0];
  return PORTAL_ROLES[seg] ?? seg;
}

function defaultMeta(route) {
  const label = route.split("/").pop() || "home";
  return {
    purpose: `${label.replace(/\[|\]/g, "")} screen`,
    actions: "Navigate, view data",
    states: "loading, empty, error",
    status: "needs QA",
  };
}

function escapeCell(value) {
  return String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

async function main() {
  const routes = (await walkPages(appDir)).sort();

  const groups = new Map();
  for (const route of routes) {
    const portal =
      route === "/"
        ? "Root / Auth"
        : route.startsWith("/login") ||
            ["/forgot-password", "/reset-password", "/two-factor", "/verify-email"].includes(route)
          ? "Auth"
          : inferPortal(route);
    if (!groups.has(portal)) groups.set(portal, []);
    groups.get(portal).push(route);
  }

  const portalOrder = [
    "Root / Auth",
    "Auth",
    "Admin",
    "Super Admin",
    "Dispatcher",
    "Customer",
    "Driver / Technician",
    "HR",
    "Fleet",
    "Manager",
    "Accountant",
  ];

  const lines = [
    "# Frontend Route Inventory",
    "",
    "**Generated:** " + new Date().toISOString().slice(0, 10),
    "**Total routes:** " + routes.length,
    "",
    "This inventory maps every Next.js App Router page to its portal, purpose, and QA status.",
    "Regenerate with: `node scripts/generate-route-inventory.mjs`",
    "",
    "Related: [Frontend Gap Tracker](../issue/10_FRONTEND_GAP_AUDIT_AND_FIX_TRACKER.md) | [UI/UX Design](./04_UI_UX_Design_Document.md)",
    "",
    "## Status legend",
    "",
    "| Status | Meaning |",
    "| --- | --- |",
    "| implemented | UI present and wired to demo/mock data |",
    "| needs QA | Implemented; awaiting visual/functional QA |",
    "| placeholder | Shell only or redirect stub |",
    "| needs design | Requires design sign-off |",
    "| out of scope | Not in current release |",
    "",
    "## Route inventory",
    "",
  ];

  for (const portal of portalOrder) {
    const portalRoutes = groups.get(portal);
    if (!portalRoutes?.length) continue;

    lines.push(`### ${portal}`, "");
    lines.push(
      "| Route | Role/portal | Purpose | Main actions | States required | Status | Owner |",
    );
    lines.push("| --- | --- | --- | --- | --- | --- | --- |");

    for (const route of portalRoutes) {
      const meta = ROUTE_META[route] ?? defaultMeta(route);
      const status = meta.status ?? "needs QA";
      lines.push(
        `| \`${route}\` | ${portal} | ${escapeCell(meta.purpose)} | ${escapeCell(meta.actions)} | ${escapeCell(meta.states)} | ${status} | TBD |`,
      );
    }
    lines.push("");
  }

  await writeFile(outFile, lines.join("\n"), "utf8");
  console.log(`Wrote ${routes.length} routes to ${outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
