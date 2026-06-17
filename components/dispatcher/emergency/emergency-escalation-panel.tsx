"use client";

import Link from "next/link";
import { BellRing, CalendarClock, MessageSquareWarning, Route, ShieldAlert } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AdminJob } from "@/types";
import { getEscalationLevel, getResponseEtaMinutes } from "./emergency-utils";

export function EmergencyEscalationPanel({ job }: { job?: AdminJob }) {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Escalation Workflow</h2>
        <p className="text-sm text-muted-foreground">
          Dispatcher checklist for urgent ownership, notifications, routing, and follow-up.
        </p>
      </div>

      {!job ? (
        <div className="rounded-lg border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
          Select an urgent job to review escalation steps.
        </div>
      ) : (
        <div className="space-y-4">
          <Alert variant={job.technicianId ? "default" : "destructive"}>
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>{getEscalationLevel(job)} response</AlertTitle>
            <AlertDescription>
              {job.technicianId
                ? `${job.technicianName} owns this job. Confirm route and customer communication.`
                : "This urgent job is unassigned. Assign a technician before sending route instructions."}
            </AlertDescription>
          </Alert>

          <div className="rounded-lg border border-border/70 bg-background p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-red-600 text-white hover:bg-red-600">
                {job.jobNumber}
              </Badge>
              <AdminStatusBadge status={job.priority} />
              <AdminStatusBadge status={job.status} />
            </div>
            <p className="mt-3 font-medium">
              {job.customerName} - {job.serviceType}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {job.specialInstructions ?? "No special instructions were provided."}
            </p>
            <Badge variant="secondary" className="mt-3">
              Target response ETA {getResponseEtaMinutes(job)}m
            </Badge>
          </div>

          <div className="space-y-3">
            {[
              ["Notify technician", "Send emergency assignment and access notes."],
              ["Notify customer", "Send ETA and escalation confirmation."],
              ["Recalculate route", "Prioritize emergency stop before routine work."],
              ["Log incident", "Record dispatcher decision and timeline."],
            ].map(([title, detail], index) => (
              <div
                key={title}
                className="flex gap-3 rounded-lg border border-border/70 bg-background p-3"
              >
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-xs text-muted-foreground">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button>
              <BellRing className="mr-2 h-4 w-4" />
              Send Alerts
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dispatcher/routes">
                <Route className="mr-2 h-4 w-4" />
                Recalculate Route
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dispatcher/schedule">
                <CalendarClock className="mr-2 h-4 w-4" />
                Open Schedule
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/dispatcher/jobs/${job.id}`}>
                <MessageSquareWarning className="mr-2 h-4 w-4" />
                Job Detail
              </Link>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
