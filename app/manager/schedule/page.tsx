"use client";

import { CalendarDays, Clock, Download, UsersRound } from "lucide-react";
import { useState } from "react";
import { ManagerActionButton } from "@/components/manager/manager-action-button";
import { formatDate, getManagerData } from "@/components/manager/manager-data";
import { ManagerPageHeader } from "@/components/manager/manager-page-header";
import { ManagerStatCard } from "@/components/manager/manager-stat-card";
import { ManagerStatusBadge } from "@/components/manager/manager-status-badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AdminJob } from "@/types";

export default function ManagerSchedulePage() {
  const { adminData, teamMembers } = getManagerData();
  const [selectedJob, setSelectedJob] = useState<AdminJob | null>(null);
  const scheduledJobs = adminData.jobs.slice().sort((a, b) => a.scheduledStart.getTime() - b.scheduledStart.getTime());
  const totalHours = scheduledJobs.reduce((sum, job) => sum + job.estimatedDurationMinutes / 60, 0);
  const overloadedMembers = teamMembers.filter((member) => member.utilization > 90);

  return (
    <div className="space-y-8 py-6">
      <ManagerPageHeader
        badge="Schedules and calendars"
        title="Schedule"
        description="View team calendars, scheduled jobs, capacity pressure, appointment windows, and manager schedule actions."
        actions={
          <ManagerActionButton variant="outline" feedbackTitle="Calendar export prepared">
            <Download className="mr-2 h-4 w-4" />
            Export Calendar
          </ManagerActionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ManagerStatCard icon={CalendarDays} label="Scheduled jobs" value={scheduledJobs.length} detail="Visible team calendar" />
        <ManagerStatCard icon={Clock} label="Scheduled hours" value={totalHours.toFixed(1)} detail="Current calendar load" tone="purple" />
        <ManagerStatCard icon={UsersRound} label="Over capacity" value={overloadedMembers.length} detail="Team members above 90%" tone="amber" />
        <ManagerStatCard icon={CalendarDays} label="Open windows" value="6" detail="Available appointment slots" tone="green" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-border bg-card shadow-sm">
          <div className="border-b border-border p-6">
            <h2 className="text-xl font-semibold text-foreground">Team Calendar</h2>
            <p className="mt-1 text-sm text-muted-foreground">Upcoming scheduled work assigned to the manager's team.</p>
          </div>
          <div className="divide-y divide-border">
            {scheduledJobs.slice(0, 9).map((job) => (
              <div key={job.id} className="grid gap-4 p-5 md:grid-cols-[150px_1fr_auto] md:items-center">
                <div>
                  <p className="font-semibold text-foreground">{formatDate(job.scheduledStart)}</p>
                  <p className="text-sm text-muted-foreground">{job.estimatedDurationMinutes} min window</p>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{job.jobNumber}</p>
                    <ManagerStatusBadge status={job.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{job.customerName} / {job.technicianName ?? "Unassigned"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{job.address}</p>
                </div>
                <ManagerActionButton
                  size="sm"
                  variant="outline"
                  feedbackTitle="Schedule adjustment opened"
                  onClick={() => setSelectedJob(job)}
                >
                  Adjust
                </ManagerActionButton>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Capacity Watch</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manager view of people who may need schedule balancing.</p>
          <div className="mt-5 space-y-4">
            {teamMembers.slice(0, 6).map((member) => (
              <div key={member.id} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.scheduledHours}/{member.capacityHours} hours scheduled</p>
                  </div>
                  <ManagerStatusBadge status={member.utilization > 90 ? "at_risk" : "active"} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Dialog open={Boolean(selectedJob)} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Schedule</DialogTitle>
            <DialogDescription>
              {selectedJob?.jobNumber} / {selectedJob?.customerName}
            </DialogDescription>
          </DialogHeader>
          {selectedJob ? (
            <div className="grid gap-4">
              <div className="rounded-lg border border-border p-4">
                <p className="font-semibold text-foreground">{selectedJob.serviceType}</p>
                <p className="mt-1 text-sm text-muted-foreground">{selectedJob.address}</p>
              </div>
              <Select defaultValue="same-day">
                <SelectTrigger><SelectValue placeholder="New service window" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="same-day">Today / 2:30 PM - 3:00 PM</SelectItem>
                  <SelectItem value="morning">Tomorrow / 9:00 AM - 11:00 AM</SelectItem>
                  <SelectItem value="afternoon">Tomorrow / 1:00 PM - 3:00 PM</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue={selectedJob.technicianName ?? "unassigned"}>
                <SelectTrigger><SelectValue placeholder="Assign technician" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={selectedJob.technicianName ?? "unassigned"}>{selectedJob.technicianName ?? "Unassigned"}</SelectItem>
                  {teamMembers.slice(0, 4).map((member) => (
                    <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <DialogFooter>
            <ManagerActionButton variant="outline" feedbackTitle="Schedule adjustment cancelled" onClick={() => setSelectedJob(null)}>Cancel</ManagerActionButton>
            <ManagerActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle="Schedule adjustment saved">Save Adjustment</ManagerActionButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
