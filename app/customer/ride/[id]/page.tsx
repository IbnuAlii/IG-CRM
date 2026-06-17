"use client";

import { useParams } from "next/navigation";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LeafletRouteMap } from "@/components/map/leaflet-route-map";
import { CustomerActionButton } from "@/components/customer/customer-action-button";
import { customerTones } from "@/components/customer/customer-tones";
import {
  formatCustomerPortalCurrency,
  formatCustomerPortalDateTime,
  getCustomerPortalData,
} from "@/components/customer/customer-data";

const data = getCustomerPortalData();

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.id as string;
  const appointment =
    data.appointments.find((item) => item.id === serviceId) ?? data.appointments[0];

  const steps = [
    { label: "Request received", complete: true },
    { label: "Technician assigned", complete: true },
    { label: "Technician en route", complete: appointment.progress >= 50 },
    { label: "Service in progress", complete: appointment.progress >= 75 },
    { label: "Completed", complete: appointment.progress === 100 },
  ];
  const points = [
    {
      id: "technician",
      label: "T",
      detail: `${appointment.technician.name} assigned`,
      lat: 40.7549,
      lng: -73.984,
      kind: "origin" as const,
    },
    {
      id: "service",
      label: "S",
      detail: appointment.address,
      lat: 40.7527,
      lng: -73.9772,
      kind: "stop" as const,
    },
  ];

  return (
    <div className={customerTones.page}>
      <div className="mx-auto w-full max-w-[1760px] space-y-6 px-4 py-6 2xl:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className={`mb-3 ${customerTones.statusPill}`}>
              {appointment.id}
            </Badge>
            <h1 className="text-3xl font-semibold tracking-normal text-foreground">
              {appointment.service}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Complete service details, technician information, arrival map, scope, and billing estimate.
            </p>
          </div>
          <CustomerActionButton
            feedbackTitle="Service timeline refreshed"
            feedbackDescription={`${appointment.id} latest status is ready for backend refresh.`}
          >
            Refresh Status
          </CustomerActionButton>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <Card className="overflow-hidden border-border bg-card p-0 shadow-sm">
              <LeafletRouteMap points={points} className="h-[460px] rounded-none border-0" />
            </Card>

            <Card className="border-border bg-card p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground">Service Timeline</h2>
              <div className="mt-5 grid gap-3">
                {steps.map((step) => (
                  <div key={step.label} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <div className={step.complete ? "text-teal-600" : "text-muted-foreground"}>
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <span className={step.complete ? "font-medium text-foreground" : "text-muted-foreground"}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <img
                  src={appointment.technician.avatar}
                  alt={appointment.technician.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {appointment.technician.name}
                  </p>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {appointment.technician.rating} rating
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <CustomerActionButton
                  variant="outline"
                  feedbackTitle="Call prepared"
                  feedbackDescription={`${appointment.technician.phone} is ready to dial.`}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </CustomerActionButton>
                <CustomerActionButton
                  variant="outline"
                  feedbackTitle="Message prepared"
                  feedbackDescription="Technician message is ready for backend messaging."
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </CustomerActionButton>
              </div>
            </Card>

            <Card className="border-border bg-card p-5 shadow-sm">
              <h2 className="font-semibold text-foreground">Appointment</h2>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <CalendarClock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{formatCustomerPortalDateTime(appointment.scheduledFor)}</span>
                </div>
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{appointment.address}</span>
                </div>
                <div className="flex gap-3">
                  <Wrench className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{appointment.issue}</span>
                </div>
              </div>
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-medium">{appointment.progress}%</span>
                </div>
                <Progress value={appointment.progress} />
              </div>
            </Card>

            <Card className="border-border bg-card p-5 shadow-sm">
              <h2 className="font-semibold text-foreground">Billing Estimate</h2>
              <div className="mt-4 rounded-lg bg-gradient-to-br from-blue-600 to-blue-900 p-4 text-white dark:from-blue-800 dark:to-slate-900">
                <p className="text-sm text-blue-100">Current approved estimate</p>
                <p className="mt-1 text-3xl font-semibold">
                  {formatCustomerPortalCurrency(appointment.estimate)}
                </p>
              </div>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-teal-600" />
                  No extra work begins without customer approval.
                </p>
                <p className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-teal-600" />
                  Service notes and invoice will be stored in history.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
