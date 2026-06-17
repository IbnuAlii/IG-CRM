"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { AdminDashboardData, AdminReport } from "@/types";
import {
  formatReportCurrency,
  reportCategoryColors,
  reportCategoryLabels,
} from "./report-formatters";

export function ReportCharts({
  data,
  weeklyRevenue,
}: {
  data: AdminDashboardData;
  weeklyRevenue: number;
}) {
  const reportCategoryData = Object.entries(reportCategoryLabels).map(
    ([category, label]) => ({
      name: label,
      value: data.reports.filter(
        (report) => report.category === (category as AdminReport["category"]),
      ).length,
      color: reportCategoryColors[category as AdminReport["category"]],
    }),
  );

  return (
    <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.45fr_0.95fr]">
      <Card className="border-border/70 bg-card p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Revenue Reports</h2>
            <p className="text-sm text-muted-foreground">
              Daily revenue curve with clear peaks and operational context.
            </p>
          </div>
          <Badge
            variant="outline"
            className="w-fit bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300"
          >
            {formatReportCurrency(weeklyRevenue)}
          </Badge>
        </div>
        <ResponsiveContainer width="100%" height={330}>
          <AreaChart data={data.revenueTrend}>
            <defs>
              <linearGradient id="reportRevenueGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.34} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="date" className="text-xs text-muted-foreground" />
            <YAxis className="text-xs text-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              fill="url(#reportRevenueGlow)"
              strokeWidth={3}
              dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="border-border/70 bg-card p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Report Categories</h2>
          <p className="text-sm text-muted-foreground">
            Saved reports by analytical domain.
          </p>
        </div>
        <div className="relative">
          <ResponsiveContainer width="100%" height={235}>
            <PieChart>
              <Pie
                data={reportCategoryData}
                dataKey="value"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={5}
              >
                {reportCategoryData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-x-0 top-[88px] text-center">
            <p className="text-3xl font-semibold">{data.reports.length}</p>
            <p className="text-xs text-muted-foreground">reports</p>
          </div>
        </div>
        <div className="mt-2 grid gap-2">
          {reportCategoryData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-md border border-border/70 bg-background px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
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
