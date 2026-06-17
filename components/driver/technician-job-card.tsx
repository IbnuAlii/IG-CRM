"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Clock3,
  FileText,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
} from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import type { AdminJob } from "@/types";
import {
  formatTechnicianDate,
  formatTechnicianTime,
  getTechnicianJobProgress,
} from "./technician-utils";
import { TechnicianActionButton } from "./technician-action-button";

export function TechnicianJobCard({ job, compact = false }: { job: AdminJob; compact?: boolean }) {
  const progress = getTechnicianJobProgress(job.status);

  return (
    <Card className="border-border bg-card p-5 shadow-sm">
      <div className="grid gap-5 xl:grid-cols-[1fr_auto] xl:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-foreground">{job.jobNumber}</p>
            <AdminStatusBadge status={job.status} />
            <AdminStatusBadge status={job.priority} />
          </div>
          <h2 className="mt-3 text-xl font-semibold text-foreground">
            {job.serviceType}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {job.customerName}
          </p>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
            <span className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
              <span>{job.address}</span>
            </span>
            <span className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 shrink-0 text-blue-700" />
              {formatTechnicianDate(job.scheduledStart)}
            </span>
            <span className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 shrink-0 text-blue-700" />
              {formatTechnicianTime(job.scheduledStart)} / {job.estimatedDurationMinutes} min
            </span>
          </div>
          {!compact ? (
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span>Field progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ) : null}
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:w-64 xl:grid-cols-1">
          <TechnicianActionButton
            variant="outline"
            className="justify-start"
            feedbackTitle="Customer call ready"
            feedbackDescription={`${job.customerName} contact details are ready for backend dialing.`}
          >
            <Phone className="mr-2 h-4 w-4" />
            Call Customer
          </TechnicianActionButton>
          <TechnicianActionButton
            variant="outline"
            className="justify-start"
            feedbackTitle="Message drafted"
            feedbackDescription={`Message thread for ${job.jobNumber} is ready.`}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Message
          </TechnicianActionButton>
          <TechnicianActionButton
            variant="outline"
            className="justify-start"
            feedbackTitle="Route opened"
            feedbackDescription="Turn-by-turn route will connect to the native maps app."
          >
            <Navigation className="mr-2 h-4 w-4" />
            Navigate
          </TechnicianActionButton>
          <TechnicianActionButton asChild className="justify-start bg-blue-600 hover:bg-blue-700" feedbackTitle="Job opened">
            <Link href={`/driver/jobs/${job.id}`}>
              <FileText className="mr-2 h-4 w-4" />
              View Details
              <ArrowRight className="ml-auto h-4 w-4" />
            </Link>
          </TechnicianActionButton>
        </div>
      </div>
    </Card>
  );
}
