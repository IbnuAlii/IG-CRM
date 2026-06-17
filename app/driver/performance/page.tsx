"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Award, CheckCircle2, Download, Star, Target, TrendingUp, Wrench } from "lucide-react";
import { TechnicianActionButton } from "@/components/driver/technician-action-button";
import { TechnicianPageHeader } from "@/components/driver/technician-page-header";
import { TechnicianStatCard } from "@/components/driver/technician-stat-card";
import {
  getTechnicianData,
  technicianWeeklyPerformance,
} from "@/components/driver/technician-utils";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function TechnicianPerformancePage() {
  const { technician, jobs } = getTechnicianData();
  const utilization = technician
    ? Math.round((technician.scheduledHours / technician.capacityHours) * 100)
    : 0;

  return (
    <div className="mx-auto w-full max-w-[1760px] space-y-8 px-4 py-6 2xl:px-8">
      <TechnicianPageHeader
        badge="Personal performance"
        title="Performance"
        description="Review job completion, on-time arrival, customer rating, utilization, goals, and certification impact."
        actions={
          <TechnicianActionButton variant="outline" feedbackTitle="Performance export prepared">
            <Download className="mr-2 h-4 w-4" />
            Export Summary
          </TechnicianActionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TechnicianStatCard icon={Wrench} label="Jobs completed" value={technician?.jobsCompleted ?? 0} detail="Lifetime completed services" />
        <TechnicianStatCard icon={Star} label="Rating" value={technician?.rating.toFixed(1) ?? "0.0"} detail="Average customer rating" tone="purple" />
        <TechnicianStatCard icon={TrendingUp} label="Utilization" value={`${utilization}%`} detail="Scheduled capacity" tone="amber" />
        <TechnicianStatCard icon={Award} label="Assigned jobs" value={jobs.length} detail="All visible assignments" tone="green" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Jobs Completed</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={technicianWeeklyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jobs" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-foreground">On-Time Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={technicianWeeklyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" />
              <YAxis domain={[80, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="onTime" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Target className="h-5 w-5 text-blue-700" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">Monthly Goals</h2>
              <p className="text-sm text-muted-foreground">Goal tracking visible to technician and manager.</p>
            </div>
          </div>
          <div className="space-y-5">
            {[
              ["Complete 48 jobs", 82, "39 of 48 completed"],
              ["Maintain 95% on-time arrival", 94, "94% current"],
              ["Keep rating above 4.8", 98, "4.9 average"],
              ["Close photo checklist compliance", 88, "88% complete"],
            ].map(([label, progress, detail]) => (
              <div key={label as string}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-foreground">{label as string}</span>
                  <span className="text-muted-foreground">{detail as string}</span>
                </div>
                <Progress value={progress as number} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Recent Recognition</h2>
          <div className="mt-5 space-y-4">
            {[
              ["Customer praise", "Nora noted clean work area and clear explanation."],
              ["Dispatch note", "Accepted emergency reassignment without schedule conflict."],
              ["Safety", "No missed checklists in the last 14 days."],
            ].map(([title, detail]) => (
              <div key={title} className="flex gap-3 rounded-lg border border-border p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
