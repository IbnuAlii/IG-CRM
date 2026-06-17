"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { JobFilters } from "@/components/admin/jobs/job-filters";
import { JobRegister } from "@/components/admin/jobs/job-register";
import { JobStats } from "@/components/admin/jobs/job-stats";
import { JobWorkflowDialog } from "@/components/admin/jobs/job-workflow-dialog";
import { Button } from "@/components/ui/button";
import { generateAdminDashboardData } from "@/lib/mock-data";
import type { AdminJob } from "@/types";

const data = generateAdminDashboardData();

export default function AdminJobsPage() {
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [selectedJob, setSelectedJob] = useState<AdminJob | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const jobs = data.jobs;
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesStatus = status === "all" || job.status === status;
      const matchesPriority = priority === "all" || job.priority === priority;
      return matchesStatus && matchesPriority;
    });
  }, [jobs, priority, status]);

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Jobs"
        description="Create, assign, update, and monitor service jobs with schedule, priority, technician, quote link, and customer context."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </Button>
        }
      />

      <JobStats jobs={jobs} visibleCount={filteredJobs.length} />
      <JobFilters
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
      />
      <JobRegister jobs={filteredJobs} onAssign={setSelectedJob} />

      <JobWorkflowDialog
        job={selectedJob}
        mode="assign"
        open={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
      <JobWorkflowDialog
        job={null}
        mode="create"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
