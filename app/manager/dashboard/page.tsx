"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, BriefcaseBusiness, ClipboardCheck, DollarSign, Download, UsersRound } from "lucide-react";
import { ManagerActionButton } from "@/components/manager/manager-action-button";
import { formatManagerCurrency, getManagerData } from "@/components/manager/manager-data";
import { ManagerPageHeader } from "@/components/manager/manager-page-header";
import { ManagerStatCard } from "@/components/manager/manager-stat-card";
import { ManagerStatusBadge } from "@/components/manager/manager-status-badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ManagerDashboardPage() {
  const { teamMembers, approvals, activeJobs, completedJobs, revenue, openPipeline, reports } = getManagerData();
  const avgScore = Math.round(teamMembers.reduce((sum, member) => sum + member.performanceScore, 0) / teamMembers.length);
  const pendingApprovals = approvals.filter((approval) => approval.status === "pending");

  return (
    <div className="space-y-8 py-6">
      <ManagerPageHeader
        badge="Department overview"
        title="Manager Dashboard"
        description="Track team performance, active operations, pending approvals, report readiness, and limited financial outcomes."
        actions={
          <ManagerActionButton variant="outline" feedbackTitle="Manager snapshot export prepared">
            <Download className="mr-2 h-4 w-4" />
            Export Snapshot
          </ManagerActionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ManagerStatCard icon={UsersRound} label="Team members" value={teamMembers.length} detail="Direct operational team" />
        <ManagerStatCard icon={BarChart3} label="Avg performance" value={`${avgScore}%`} detail="Team KPI score" tone="green" />
        <ManagerStatCard icon={BriefcaseBusiness} label="Active jobs" value={activeJobs.length} detail={`${completedJobs.length} completed this cycle`} tone="purple" />
        <ManagerStatCard icon={DollarSign} label="Limited revenue" value={formatManagerCurrency(revenue)} detail={`${formatManagerCurrency(openPipeline)} open pipeline`} tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Team Performance</h2>
              <p className="mt-1 text-sm text-muted-foreground">Ranked view of utilization, quality, completed work, and open coaching actions.</p>
            </div>
            <Link href="/manager/team" className="flex items-center gap-1 text-sm font-medium text-blue-700">
              View team <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {teamMembers.slice(0, 5).map((member) => (
              <div key={member.id} className="rounded-lg border border-border p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{member.name}</p>
                    <p className="text-sm capitalize text-muted-foreground">{member.role.replace("_", " ")} / {member.jobsCompleted} jobs / {member.rating.toFixed(1)} rating</p>
                  </div>
                  <div className="text-sm font-semibold text-foreground">{member.performanceScore}%</div>
                </div>
                <Progress value={member.performanceScore} className="mt-3 h-2" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Approval Queue</h2>
              <p className="mt-1 text-sm text-muted-foreground">{pendingApprovals.length} decisions need manager review.</p>
            </div>
            <ClipboardCheck className="h-5 w-5 text-blue-600" />
          </div>
          <div className="mt-5 space-y-3">
            {approvals.slice(0, 4).map((approval) => (
              <div key={approval.id} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{approval.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{approval.impact}</p>
                  </div>
                  <ManagerStatusBadge status={approval.status} />
                </div>
              </div>
            ))}
          </div>
          <Link href="/manager/approvals" className="mt-5 flex items-center gap-1 text-sm font-medium text-blue-700">
            Review approvals <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </div>

      <Card className="border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Report Readiness</h2>
            <p className="mt-1 text-sm text-muted-foreground">Team-specific reports available for performance reviews and planning.</p>
          </div>
          <Link href="/manager/reports" className="flex items-center gap-1 text-sm font-medium text-blue-700">
            Build report <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reports.map((report) => (
            <div key={report.id} className="rounded-lg border border-border bg-muted p-4">
              <ManagerStatusBadge status={report.status} />
              <p className="mt-3 font-semibold text-foreground">{report.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{report.period} / {report.owner}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
