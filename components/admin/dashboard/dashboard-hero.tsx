"use client";

import Link from "next/link";
import {
  CalendarClock,
  Clock3,
  DollarSign,
  FileText,
  Headphones,
  Radio,
  Route,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminDashboardData, AdminJob } from "@/types";
import { formatDashboardCurrency } from "./dashboard-formatters";
import { DashboardMetricTile } from "./dashboard-metric-tile";
import { DashboardSignalBar } from "./dashboard-signal-bar";

export function DashboardHero({
  data,
  activeCustomers,
  scheduledToday,
  acceptedQuoteValue,
  openTickets,
  availableTechnicians,
  totalRevenue,
  emergencyJob,
}: {
  data: AdminDashboardData;
  activeCustomers: number;
  scheduledToday: number;
  acceptedQuoteValue: number;
  openTickets: number;
  availableTechnicians: number;
  totalRevenue: number;
  emergencyJob?: AdminJob;
}) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
      <div className="relative grid gap-6 p-5 md:p-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="gap-1.5 bg-green-600 text-white hover:bg-green-600">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              Live Ops
            </Badge>
            <Badge variant="outline" className="gap-1.5 bg-background/70">
              <Clock3 className="h-3.5 w-3.5" />
              Updated 2 min ago
            </Badge>
            <Badge variant="outline" className="gap-1.5 bg-background/70">
              <Zap className="h-3.5 w-3.5" />
              SLA priority mode
            </Badge>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
              Company operations command center
            </div>
            <h1 className="max-w-4xl text-3xl font-semibold text-foreground lg:text-4xl 2xl:text-5xl">
              Everything that needs action, money, or a technician is visible here.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
              Monitor service momentum, customer risk, accepted quote value,
              team capacity, and urgent dispatch decisions.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
            <DashboardMetricTile label="Customers" value={activeCustomers} detail={`${data.customers.length} total profiles`} icon={Users} tone="blue" href="/admin/customers" />
            <DashboardMetricTile label="Jobs Today" value={scheduledToday} detail="Active schedule load" icon={CalendarClock} tone="cyan" href="/admin/jobs" />
            <DashboardMetricTile label="Accepted Quotes" value={formatDashboardCurrency(acceptedQuoteValue)} detail="Ready to schedule" icon={FileText} tone="green" href="/admin/quotes" />
            <DashboardMetricTile label="Ticket Risk" value={openTickets} detail="Open or in progress" icon={Headphones} tone="red" href="/admin/tickets" />
            <DashboardMetricTile label="Techs" value={availableTechnicians} detail="Available field crew" icon={Wrench} tone="amber" href="/admin/team" />
          </div>
        </div>

        <div className="rounded-lg border border-border/70 bg-background/85 p-5 shadow-sm backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Ops health</p>
              <p className="mt-1 text-4xl font-semibold">92%</p>
            </div>
            <div className="grid h-24 w-24 place-items-center rounded-full bg-[conic-gradient(#10b981_0_72%,#f59e0b_72%_86%,#ef4444_86%_92%,hsl(var(--muted))_92%_100%)]">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-background text-sm font-semibold">
                Pulse
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <DashboardSignalBar label="Revenue capture" value={84} color="#10b981" caption={formatDashboardCurrency(totalRevenue)} />
            <DashboardSignalBar label="Dispatch readiness" value={76} color="#2563eb" caption={`${scheduledToday} live jobs`} />
            <DashboardSignalBar label="SLA shield" value={68} color="#f59e0b" caption={`${openTickets} tickets`} />
            <DashboardSignalBar label="Emergency pressure" value={28} color="#ef4444" caption={emergencyJob?.jobNumber ?? "Clear"} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button asChild>
              <Link href="/admin/dispatch">
                <Route className="mr-2 h-4 w-4" />
                Dispatch
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/reports">
                <DollarSign className="mr-2 h-4 w-4" />
                Reports
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
