"use client";

import { useEffect, useMemo, useState } from "react";
import { RouteEmptyState } from "@/components/common/route-empty-state";
import { RouteLoadingSkeleton } from "@/components/common/route-loading-skeleton";
import { BriefcaseBusiness, CheckCircle2, Download, Search, SlidersHorizontal, Timer } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { TechnicianActionButton } from "@/components/driver/technician-action-button";
import { TechnicianJobCard } from "@/components/driver/technician-job-card";
import { TechnicianPageHeader } from "@/components/driver/technician-page-header";
import { TechnicianStatCard } from "@/components/driver/technician-stat-card";
import { getActiveTechnicianJobs, getTechnicianData } from "@/components/driver/technician-utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const filterOptions = [
  { value: "active", label: "Active" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "all", label: "All Jobs" },
];

export default function TechnicianJobsPage() {
  const [filter, setFilter] = useState("active");
  const [search, setSearch] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 350);
    return () => window.clearTimeout(timer);
  }, []);
  const { jobs } = getTechnicianData();
  const activeJobs = getActiveTechnicianJobs(jobs);

  const visibleJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && job.status !== "completed" && job.status !== "cancelled") ||
        job.status === filter;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        [job.jobNumber, job.customerName, job.serviceType, job.address, job.status]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [filter, jobs, search]);

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-[1760px] px-4 py-6 2xl:px-8">
        <RouteLoadingSkeleton variant="cards" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1760px] space-y-8 px-4 py-6 2xl:px-8">
      <TechnicianPageHeader
        badge="Assigned jobs"
        title="My Jobs"
        description="View assigned service jobs, filter by status, contact customers, open routes, and continue field workflows."
        actions={
          <TechnicianActionButton variant="outline" feedbackTitle="Job export prepared">
            <Download className="mr-2 h-4 w-4" />
            Export My Jobs
          </TechnicianActionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TechnicianStatCard icon={BriefcaseBusiness} label="Active assignments" value={activeJobs.length} detail="Need technician action" />
        <TechnicianStatCard icon={Timer} label="In progress" value={jobs.filter((job) => job.status === "in_progress").length} detail="Currently underway" tone="amber" />
        <TechnicianStatCard icon={CheckCircle2} label="Completed" value={jobs.filter((job) => job.status === "completed").length} detail="Ready for customer history" tone="green" />
        <TechnicianStatCard icon={SlidersHorizontal} label="Visible" value={visibleJobs.length} detail="Filtered list count" tone="purple" />
      </div>

      <Card className="border-border bg-card p-5 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_auto] lg:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by job, customer, address, service, or status..."
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => { setFilter("active"); setSearch(""); }}>
            Reset
          </Button>
        </div>
      </Card>

      <div className="grid gap-5">
        {visibleJobs.map((job) => (
          <TechnicianJobCard key={job.id} job={job} />
        ))}
        {visibleJobs.length === 0 ? (
          <RouteEmptyState
            title="No assigned jobs"
            description="No jobs match the selected filters. Try resetting filters or check back later."
          />
        ) : null}
      </div>

      <Card className="border border-blue-200 bg-blue-50 p-6 shadow-sm dark:border-blue-800 dark:bg-blue-950/40">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-blue-950 dark:text-blue-100">Status update rules</h2>
            <p className="mt-1 text-sm text-blue-900/80 dark:text-blue-100/80">
              Start records a start time, hold notifies dispatch, completion requires notes, photos, and signature.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <AdminStatusBadge status="assigned" />
            <AdminStatusBadge status="in_progress" />
            <AdminStatusBadge status="on_hold" />
            <AdminStatusBadge status="completed" />
          </div>
        </div>
      </Card>
    </div>
  );
}
