"use client";

import Link from "next/link";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AdminJob } from "@/types";
import { formatJobDateTime } from "./job-formatters";

export function JobRegister({
  jobs,
  onAssign,
  jobsBasePath = "/admin/jobs",
  exportFileName = "admin-jobs.csv",
}: {
  jobs: AdminJob[];
  onAssign: (job: AdminJob) => void;
  jobsBasePath?: string;
  exportFileName?: string;
}) {
  const columns: DataTableColumn<AdminJob>[] = [
    {
      id: "job",
      header: "Job",
      accessorFn: (job) => `${job.jobNumber} ${job.serviceType}`,
      cell: (job) => (
        <div>
          <p className="font-medium">{job.jobNumber}</p>
          <p className="text-xs text-muted-foreground">{job.serviceType}</p>
        </div>
      ),
      exportValue: (job) => `${job.jobNumber} - ${job.serviceType}`,
    },
    {
      id: "customer",
      header: "Customer",
      accessorFn: (job) => job.customerName,
      cell: (job) => (
        <div>
          <p>{job.customerName}</p>
          <p className="max-w-52 truncate text-xs text-muted-foreground">
            {job.address}
          </p>
        </div>
      ),
      exportValue: (job) => `${job.customerName} (${job.address})`,
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (job) => job.status,
      cell: (job) => <AdminStatusBadge status={job.status} />,
      align: "center",
    },
    {
      id: "priority",
      header: "Priority",
      accessorFn: (job) => job.priority,
      cell: (job) => <AdminStatusBadge status={job.priority} />,
      align: "center",
    },
    {
      id: "technician",
      header: "Technician",
      accessorFn: (job) => job.technicianName ?? "Unassigned",
      cell: (job) => job.technicianName ?? "Unassigned",
    },
    {
      id: "scheduled",
      header: "Scheduled",
      accessorFn: (job) => job.scheduledStart.getTime(),
      cell: (job) => (
        <div className="text-center">
          <p>{formatJobDateTime(job.scheduledStart)}</p>
          <p className="text-xs text-muted-foreground">
            {job.estimatedDurationMinutes} min
          </p>
        </div>
      ),
      exportValue: (job) => formatJobDateTime(job.scheduledStart),
      align: "center",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      align: "center",
      cell: (job) => (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onAssign(job)}>
            Assign
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`${jobsBasePath}/${job.id}`}>View</Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Job Register</h2>
        <p className="text-sm text-muted-foreground">
          Search jobs by number, customer, address, technician, status,
          priority, and service type.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={jobs}
        getRowKey={(job) => job.id}
        getRowHref={(job) => `${jobsBasePath}/${job.id}`}
        emptyMessage="No jobs match these filters."
        features={{
          sorting: true,
          globalFilter: true,
          pagination: true,
          columnVisibility: true,
          export: true,
          rowSelection: true,
        }}
        searchPlaceholder="Search jobs..."
        exportFileName={exportFileName}
      />
    </Card>
  );
}
