"use client";

import { Play, Save, SlidersHorizontal, Wand2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminDashboardData } from "@/types";

export function ReportBuilderAndPreview({
  data,
}: {
  data: AdminDashboardData;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="border-border/70 bg-card p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Custom Report Builder</h2>
            <p className="text-sm text-muted-foreground">
              Choose a data source, grouping, and fields for a reusable report.
            </p>
          </div>
          <Wand2 className="h-5 w-5 text-primary" />
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="report-name">Report name</Label>
            <Input id="report-name" placeholder="Monthly service performance" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Data source</Label>
              <Select defaultValue="jobs">
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customers">Customers</SelectItem>
                  <SelectItem value="jobs">Jobs</SelectItem>
                  <SelectItem value="quotes">Quotes</SelectItem>
                  <SelectItem value="employees">Employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Group by</Label>
              <Select defaultValue="technician">
                <SelectTrigger>
                  <SelectValue placeholder="Group by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="service">Service Type</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Fields</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Customer",
                "Status",
                "Service Type",
                "Technician",
                "Revenue",
                "SLA",
                "Duration",
                "Rating",
              ].map((field) => (
                <Label
                  key={field}
                  className="flex items-center gap-3 rounded-md border border-border/70 p-3 text-sm"
                >
                  <Checkbox
                    defaultChecked={!["Revenue", "Rating"].includes(field)}
                  />
                  {field}
                </Label>
              ))}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="outline">
              <Play className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Definition
            </Button>
          </div>
        </div>
      </Card>

      <Card className="border-border/70 bg-card p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Report Preview</h2>
          <p className="text-sm text-muted-foreground">
            Generated mock output from selected source and fields.
          </p>
        </div>
        <ResponsiveContainer width="100%" height={245}>
          <BarChart data={data.revenueTrend}>
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
            <Bar dataKey="jobs" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
