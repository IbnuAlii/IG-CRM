"use client";

import { BriefcaseBusiness, CalendarClock, Download, MapPin } from "lucide-react";
import { useState } from "react";
import { ManagerActionButton } from "@/components/manager/manager-action-button";
import { formatDate, getManagerData } from "@/components/manager/manager-data";
import { ManagerPageHeader } from "@/components/manager/manager-page-header";
import { ManagerStatCard } from "@/components/manager/manager-stat-card";
import { ManagerStatusBadge } from "@/components/manager/manager-status-badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import type { AdminJob } from "@/types";

export default function ManagerOperationsPage() {
  const { adminData, activeJobs, completedJobs } = getManagerData();
  const [selectedJob, setSelectedJob] = useState<AdminJob | null>(null);
  const [dialogMode, setDialogMode] = useState<"review" | "edit">("review");
  const emergencyJobs = adminData.jobs.filter((job) => job.priority === "emergency" || job.priority === "high");
  const onHold = adminData.jobs.filter((job) => job.status === "on_hold");
  const completionRate = Math.round((completedJobs.length / adminData.jobs.length) * 100);

  return (
    <div className="space-y-8 py-6">
      <ManagerPageHeader
        badge="Operational oversight"
        title="Operations"
        description="Monitor active jobs, dispatch risk, emergency work, service capacity, and customer delivery status."
        actions={
          <ManagerActionButton variant="outline" feedbackTitle="Operations report export prepared">
            <Download className="mr-2 h-4 w-4" />
            Export Operations
          </ManagerActionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ManagerStatCard icon={BriefcaseBusiness} label="Active jobs" value={activeJobs.length} detail="Pending, assigned, in progress" />
        <ManagerStatCard icon={CalendarClock} label="Completion rate" value={`${completionRate}%`} detail="Current operations cycle" tone="green" />
        <ManagerStatCard icon={MapPin} label="High priority" value={emergencyJobs.length} detail="Requires manager awareness" tone="red" />
        <ManagerStatCard icon={BriefcaseBusiness} label="On hold" value={onHold.length} detail="Needs customer or parts update" tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden border-border bg-card shadow-sm">
          <div className="border-b border-border p-6">
            <h2 className="text-xl font-semibold text-foreground">Job Control Board</h2>
            <p className="mt-1 text-sm text-muted-foreground">Operational jobs visible to department managers.</p>
          </div>
          <div className="divide-y divide-border">
            {adminData.jobs.slice(0, 8).map((job) => (
              <div key={job.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_auto_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{job.jobNumber}</p>
                    <ManagerStatusBadge status={job.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{job.customerName} / {job.serviceType}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{job.address}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{formatDate(job.scheduledStart)}</p>
                  <p>{job.estimatedDurationMinutes} minutes</p>
                </div>
                <div className="flex gap-2">
                  <ManagerActionButton
                    size="sm"
                    variant="outline"
                    feedbackTitle="Job review opened"
                    onClick={() => {
                      setSelectedJob(job);
                      setDialogMode("review");
                    }}
                  >
                    Review
                  </ManagerActionButton>
                  <ManagerActionButton
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    feedbackTitle="Job edit workflow opened"
                    onClick={() => {
                      setSelectedJob(job);
                      setDialogMode("edit");
                    }}
                  >
                    Edit
                  </ManagerActionButton>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Service Health</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manager-level view of department service execution.</p>
          <div className="mt-6 space-y-5">
            <HealthMetric label="Schedule adherence" value={86} detail="Jobs started inside service window" />
            <HealthMetric label="Customer SLA" value={91} detail="Cases resolved before SLA risk" />
            <HealthMetric label="Capacity balance" value={78} detail="Scheduled hours against team capacity" />
            <HealthMetric label="First visit resolution" value={84} detail="Jobs completed without return visit" />
          </div>
        </Card>
      </div>

      <Dialog open={Boolean(selectedJob)} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{dialogMode === "edit" ? "Edit Team Job" : "Job Detail Review"}</DialogTitle>
            <DialogDescription>
              {selectedJob?.jobNumber} / {selectedJob?.customerName} / {selectedJob?.serviceType}
            </DialogDescription>
          </DialogHeader>
          {selectedJob ? (
            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Detail label="Status" value={selectedJob.status.replace("_", " ")} />
                <Detail label="Priority" value={selectedJob.priority} />
                <Detail label="Technician" value={selectedJob.technicianName ?? "Unassigned"} />
                <Detail label="Schedule" value={formatDate(selectedJob.scheduledStart)} />
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm font-medium text-foreground">Service address</p>
                <p className="mt-1 text-sm text-muted-foreground">{selectedJob.address}</p>
              </div>
              {dialogMode === "edit" ? (
                <div className="grid gap-3">
                  <Input defaultValue={selectedJob.serviceType} aria-label="Service type" />
                  <Textarea defaultValue={selectedJob.specialInstructions ?? selectedJob.description} aria-label="Manager job notes" />
                </div>
              ) : (
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium text-foreground">Manager review notes</p>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedJob.description}</p>
                </div>
              )}
            </div>
          ) : null}
          <DialogFooter>
            <ManagerActionButton variant="outline" feedbackTitle="Job dialog closed" onClick={() => setSelectedJob(null)}>Close</ManagerActionButton>
            <ManagerActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle={dialogMode === "edit" ? "Job changes saved" : "Job review completed"}>
              {dialogMode === "edit" ? "Save Changes" : "Mark Reviewed"}
            </ManagerActionButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 font-semibold capitalize text-foreground">{value}</p>
    </div>
  );
}

function HealthMetric({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="font-medium text-foreground">{label}</p>
        <p className="font-semibold text-foreground">{value}%</p>
      </div>
      <Progress value={value} className="mt-2 h-2" />
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}
