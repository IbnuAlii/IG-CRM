"use client";

import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { AdminDashboardData } from "@/types";

type JobStatusChartItem = {
  name: string;
  value: number;
  color: string;
};

export function DashboardCharts({
  data,
  jobStatusData,
}: {
  data: AdminDashboardData;
  jobStatusData: JobStatusChartItem[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.55fr_0.9fr]">
      <Card className="border-border/70 bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Revenue Velocity</h2>
            <p className="text-sm text-muted-foreground">
              Revenue and job volume move together across the operating week.
            </p>
          </div>
          <Badge variant="outline" className="w-fit bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300">
            +9.4% week over week
          </Badge>
        </div>
        <ResponsiveContainer width="100%" height={330}>
          <ComposedChart data={data.revenueTrend}>
            <defs>
              <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="date" className="text-xs text-muted-foreground" />
            <YAxis yAxisId="left" className="text-xs text-muted-foreground" />
            <YAxis yAxisId="right" orientation="right" className="text-xs text-muted-foreground" />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }} />
            <Bar yAxisId="right" dataKey="jobs" fill="#10b981" radius={[5, 5, 0, 0]} barSize={22} />
            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#2563eb" fill="url(#revenueGlow)" strokeWidth={3} dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Card className="border-border/70 bg-card p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Workload Mix</h2>
          <p className="text-sm text-muted-foreground">
            Live distribution of dispatch states.
          </p>
        </div>
        <div className="relative">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={jobStatusData} dataKey="value" innerRadius={64} outerRadius={98} paddingAngle={5}>
                {jobStatusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-x-0 top-[92px] text-center">
            <p className="text-3xl font-semibold">{data.jobs.length}</p>
            <p className="text-xs text-muted-foreground">jobs</p>
          </div>
        </div>
        <div className="mt-2 grid gap-2">
          {jobStatusData.map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-md border border-border/70 bg-background px-3 py-2 text-sm">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
              <span className="font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
