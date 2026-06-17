"use client";

import Link from "next/link";
import { ArrowLeft, Paperclip, UserCheck } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Button } from "@/components/ui/button";
import type { AdminJob } from "@/types";

export function JobDetailHeader({
  job,
  backHref = "/admin/jobs",
}: {
  job: AdminJob;
  backHref?: string;
}) {
  return (
    <div>
      <Button variant="ghost" asChild className="mb-3 -ml-3">
        <Link href={backHref}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Link>
      </Button>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {job.jobNumber}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {job.serviceType} for {job.customerName}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <AdminStatusBadge status={job.status} />
            <AdminStatusBadge status={job.priority} />
            {job.recurring ? <AdminStatusBadge status="active" /> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">Add Note</Button>
          <Button variant="outline">
            <Paperclip className="mr-2 h-4 w-4" />
            Attach
          </Button>
          <Button>
            <UserCheck className="mr-2 h-4 w-4" />
            Assign
          </Button>
        </div>
      </div>
    </div>
  );
}
