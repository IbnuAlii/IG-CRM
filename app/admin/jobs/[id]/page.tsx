"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { JobAssignmentFitCard } from "@/components/admin/jobs/job-assignment-fit-card";
import { JobDetailHeader } from "@/components/admin/jobs/job-detail-header";
import { JobDetailStats } from "@/components/admin/jobs/job-detail-stats";
import { JobDetailTabs } from "@/components/admin/jobs/job-detail-tabs";
import { JobDetailsCard } from "@/components/admin/jobs/job-details-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();

export default function AdminJobDetailPage() {
  const params = useParams<{ id: string }>();
  const job = data.jobs.find((item) => item.id === params.id);

  if (!job) {
    return (
      <div className="w-full py-4 md:py-6">
        <Button variant="ghost" asChild className="mb-3 -ml-3">
          <Link href="/admin/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
        <Card className="p-10 text-center">
          <p className="font-medium">Job not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The selected job does not exist in the mock Admin data.
          </p>
        </Card>
      </div>
    );
  }

  const technician = data.employees.find((item) => item.id === job.technicianId);
  const quote = data.quotes.find((item) => item.id === job.quoteId);
  const relatedTickets = data.tickets.filter(
    (ticket) => ticket.customerId === job.customerId,
  );

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <JobDetailHeader job={job} />
      <JobDetailStats
        job={job}
        technician={technician}
        quote={quote}
        relatedTickets={relatedTickets}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <JobDetailsCard job={job} />
        <JobAssignmentFitCard technician={technician} />
      </div>
      <JobDetailTabs job={job} />
    </div>
  );
}
