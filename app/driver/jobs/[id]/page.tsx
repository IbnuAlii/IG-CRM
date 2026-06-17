"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  ClipboardList,
  Clock3,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { TechnicianActionButton } from "@/components/driver/technician-action-button";
import { TechnicianRoutePanel } from "@/components/driver/technician-route-panel";
import { TechnicianStatusWorkflow } from "@/components/driver/technician-status-workflow";
import {
  formatTechnicianDate,
  formatTechnicianTime,
  getTechnicianData,
  technicianProfile,
} from "@/components/driver/technician-utils";
import { RouteEmptyState } from "@/components/common/route-empty-state";
import { RouteLoadingSkeleton } from "@/components/common/route-loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TechnicianJobDetailPage() {
  const params = useParams<{ id: string }>();
  const [ready, setReady] = useState(false);
  const { data } = getTechnicianData();
  const job = data.jobs.find((item) => item.id === params.id);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 300);
    return () => window.clearTimeout(timer);
  }, [params.id]);
  const customer = job ? data.customers.find((item) => item.id === job.customerId) : undefined;
  const relatedQuote = job?.quoteId ? data.quotes.find((item) => item.id === job.quoteId) : undefined;

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-[1760px] px-4 py-6 2xl:px-8">
        <RouteLoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-4">
        <Button variant="ghost" asChild className="-ml-3">
          <Link href="/driver/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Jobs
          </Link>
        </Button>
        <RouteEmptyState
          title="Job not found"
          description="This job is not available in the technician demo data."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1760px] space-y-8 px-4 py-6 2xl:px-8">
      <Button variant="ghost" asChild className="-ml-3">
        <Link href="/driver/jobs">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Jobs
        </Link>
      </Button>

      <Card className="border-border bg-card p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <AdminStatusBadge status={job.status} />
              <AdminStatusBadge status={job.priority} />
              {job.recurring ? <AdminStatusBadge status="active" /> : null}
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal text-foreground md:text-4xl">
              {job.serviceType}
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              {job.jobNumber} for {job.customerName}
            </p>
            <div className="mt-5 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
              <span className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-blue-700" />
                {formatTechnicianDate(job.scheduledStart)}
              </span>
              <span className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-blue-700" />
                {formatTechnicianTime(job.scheduledStart)} / {job.estimatedDurationMinutes} min
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-700" />
                {job.address}
              </span>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-52 lg:grid-cols-1">
            <TechnicianActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle="Navigation opened">
              <MapPin className="mr-2 h-4 w-4" />
              Navigate
            </TechnicianActionButton>
            <TechnicianActionButton variant="outline" feedbackTitle="Customer call ready">
              <Phone className="mr-2 h-4 w-4" />
              Call
            </TechnicianActionButton>
            <TechnicianActionButton variant="outline" feedbackTitle="Message opened">
              <Mail className="mr-2 h-4 w-4" />
              Message
            </TechnicianActionButton>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 2xl:grid-cols-[1fr_0.9fr]">
        <TechnicianRoutePanel job={job} />
        <Card className="border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Customer & Access</h2>
          <div className="mt-5 grid gap-4">
            <InfoRow icon={UserRound} label="Customer" value={customer?.name ?? job.customerName} />
            <InfoRow icon={Phone} label="Phone" value={customer?.phone ?? "+1 (212) 555-0173"} />
            <InfoRow icon={Mail} label="Email" value={customer?.email ?? "customer@example.com"} />
            <InfoRow icon={MapPin} label="Service address" value={job.address} />
            <InfoRow icon={ShieldCheck} label="Access instructions" value={job.specialInstructions ?? "Call or text upon arrival. Confirm access before entering."} />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Scope & Service Notes</h2>
          <div className="mt-5 space-y-5">
            <InfoBlock title="Problem description" value={job.description} />
            <InfoBlock title="Technician readiness" value={`Assigned vehicle: ${technicianProfile.vehicle} / ${technicianProfile.licensePlate}. Required skills are verified against the technician profile.`} />
            <InfoBlock title="Quote / approval" value={relatedQuote ? `${relatedQuote.quoteNumber} is linked for ${job.customerName}.` : "No quote is linked to this job."} />
          </div>
        </Card>

        <Card className="border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Documents & Attachments</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Work order", `${job.jobNumber}.pdf`],
              ["Customer history", `${job.customerName} service timeline`],
              ["Safety checklist", "HVAC diagnostic checklist"],
              ["Parts estimate", relatedQuote?.quoteNumber ?? "No active estimate"],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-lg border border-border p-4">
                <FileText className="mb-3 h-5 w-5 text-blue-700" />
                <p className="font-semibold text-foreground">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <TechnicianStatusWorkflow job={job} />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-border p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
      <div>
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function InfoBlock({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  );
}
