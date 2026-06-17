"use client";

import { BarChart3, Download, FileText, Save } from "lucide-react";
import { useState } from "react";
import { ManagerActionButton } from "@/components/manager/manager-action-button";
import { getManagerData, type ManagerReport } from "@/components/manager/manager-data";
import { ManagerPageHeader } from "@/components/manager/manager-page-header";
import { ManagerStatCard } from "@/components/manager/manager-stat-card";
import { ManagerStatusBadge } from "@/components/manager/manager-status-badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ManagerReportsPage() {
  const { reports, teamMembers } = getManagerData();
  const [selectedReport, setSelectedReport] = useState<ManagerReport | null>(null);

  return (
    <div className="space-y-8 py-6">
      <ManagerPageHeader
        badge="Team-specific analytics"
        title="Reports"
        description="Generate team performance, productivity, operations, customer SLA, and limited financial reports for decision making."
        actions={
          <ManagerActionButton variant="outline" feedbackTitle="Report export bundle prepared">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </ManagerActionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ManagerStatCard icon={BarChart3} label="Reports" value={reports.length} detail="Manager templates" />
        <ManagerStatCard icon={FileText} label="Ready" value={reports.filter((report) => report.status === "ready").length} detail="Available now" tone="green" />
        <ManagerStatCard icon={Save} label="Saved filters" value="5" detail="Department presets" tone="purple" />
        <ManagerStatCard icon={BarChart3} label="Team members" value={teamMembers.length} detail="Available in filters" tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Build Team Report</h2>
          <p className="mt-1 text-sm text-muted-foreground">Select report type, date range, team members, and export formats.</p>
          <div className="mt-5 grid gap-4">
            <Select defaultValue="team-performance">
              <SelectTrigger><SelectValue placeholder="Report type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="team-performance">Team Performance Report</SelectItem>
                <SelectItem value="productivity">Productivity by Employee</SelectItem>
                <SelectItem value="operations">Operations Summary</SelectItem>
                <SelectItem value="limited-finance">Limited Financial Summary</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="last-30">
              <SelectTrigger><SelectValue placeholder="Date range" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="this-week">This week</SelectItem>
                <SelectItem value="last-30">Last 30 days</SelectItem>
                <SelectItem value="month">Current month</SelectItem>
                <SelectItem value="quarter">Current quarter</SelectItem>
              </SelectContent>
            </Select>
            <div className="grid gap-3 rounded-lg border border-border p-4">
              {["PDF export", "Excel export", "CSV export", "Schedule weekly email"].map((item) => (
                <label key={item} className="flex items-center gap-3 text-sm text-foreground">
                  <Checkbox defaultChecked={item !== "Schedule weekly email"} />
                  {item}
                </label>
              ))}
            </div>
            <ManagerActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle="Manager report generated">
              Generate Report
            </ManagerActionButton>
          </div>
        </Card>

        <Card className="border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Report Library</h2>
          <p className="mt-1 text-sm text-muted-foreground">Saved report templates for managers.</p>
          <div className="mt-5 grid gap-4">
            {reports.map((report) => (
              <div key={report.id} className="rounded-lg border border-border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{report.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{report.period} / {report.owner}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <ManagerStatusBadge status={report.status} />
                    <ManagerActionButton
                      size="sm"
                      variant="outline"
                      feedbackTitle="Report preview opened"
                      onClick={() => setSelectedReport(report)}
                    >
                      Preview
                    </ManagerActionButton>
                    <ManagerActionButton size="sm" variant="outline" feedbackTitle="Report exported">Export</ManagerActionButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Dialog open={Boolean(selectedReport)} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedReport?.name}</DialogTitle>
            <DialogDescription>
              {selectedReport?.period} / {selectedReport?.owner} / {selectedReport?.category}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <ReportPreviewMetric label="Completion" value="94%" />
              <ReportPreviewMetric label="Team avg" value="88%" />
              <ReportPreviewMetric label="Exceptions" value="3" />
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold text-foreground">Preview fields</p>
              <p className="mt-2 text-sm text-muted-foreground">Team member, jobs completed, utilization, rating, SLA status, customer exceptions, and manager notes.</p>
            </div>
          </div>
          <DialogFooter>
            <ManagerActionButton variant="outline" feedbackTitle="Report preview closed" onClick={() => setSelectedReport(null)}>Close</ManagerActionButton>
            <ManagerActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle="Report exported">Export Preview</ManagerActionButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReportPreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
