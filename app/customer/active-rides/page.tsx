"use client";

import {
  CalendarClock,
  Car,
  Check,
  CheckCircle2,
  Clock,
  FileText,
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
const activeAppointment =
  data.appointments.find((appointment) => appointment.status !== "completed") ??
  data.appointments[0];

export default function ActiveServicePage() {
  const points = [
    {
      id: "technician",
      label: "T",
      detail: `${activeAppointment.technician.name} is en route`,
      lat: 40.7549,
      lng: -73.984,
      kind: "origin" as const,
    },
    {
      id: "service",
      label: "S",
      detail: activeAppointment.address,
      lat: 40.7527,
      lng: -73.9772,
      kind: "stop" as const,
    },
  ];

  return (
    <div className={customerTones.page}>
      <div className="mx-auto w-full max-w-[1760px] space-y-6 px-4 py-8 2xl:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className={`mb-4 px-3 py-1.5 ${customerTones.badge.success}`}>
              <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
              Live service tracking
            </Badge>
            <h1 className="text-4xl font-semibold tracking-normal text-foreground">
              Active Service
            </h1>
            <p className="mt-3 max-w-3xl text-base text-muted-foreground">
              Follow technician arrival, confirm appointment details, and contact your service team.
            </p>
          </div>
          <CustomerActionButton
            variant="outline"
            className={customerTones.outlineAction}
            feedbackTitle="Visit update requested"
            feedbackDescription="The latest technician ETA is ready for backend refresh."
          >
            <Clock className="mr-2 h-4 w-4" />
            Refresh ETA
          </CustomerActionButton>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <Card className="overflow-hidden border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {activeAppointment.service}
                </h2>
                <p className="mt-1 text-base text-muted-foreground">
                  {activeAppointment.id} / {activeAppointment.arrivalWindow}
                </p>
              </div>
              <Badge className={`w-fit px-3 py-2 ${customerTones.statusPill}`}>
                <Car className="mr-2 h-4 w-4" />
                Technician en route
              </Badge>
            </div>
            <div className="p-4 md:p-6">
              <div className="relative overflow-hidden rounded-lg border border-border">
                <LeafletRouteMap points={points} className="h-[470px] rounded-none border-0 opacity-75" />
                <div className="absolute bottom-6 left-6 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-background/95 px-5 py-3 text-sm shadow-lg backdrop-blur">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    ETA 12 min
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    1.8 mi away
                  </span>
                  <span className="hidden h-5 w-px bg-border sm:block" />
                  <span className="text-muted-foreground">Live location updates every 60 sec</span>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-border p-6">
                <div className="grid grid-cols-3 items-start gap-4 text-center">
                  {[
                    ["Dispatched", "2:08 PM", true],
                    ["En route", "2:12 PM", true],
                    ["Arriving soon", "Est. 2:24 PM", false],
                  ].map(([label, time, done], index) => (
                    <div key={label as string} className="relative">
                      {index < 2 ? (
                        <div className="absolute left-1/2 top-4 h-0.5 w-full bg-blue-500" />
                      ) : null}
                      <div className="relative mx-auto grid h-8 w-8 place-items-center rounded-full border-2 border-blue-500 bg-card text-blue-600">
                        {done ? <Check className="h-4 w-4" /> : null}
                      </div>
                      <p className={done ? "mt-3 font-semibold text-blue-700 dark:text-blue-300" : "mt-3 font-semibold text-foreground"}>
                        {label as string}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{time as string}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-center text-sm text-muted-foreground">
                  We&apos;ll notify you when your technician arrives.
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-5">
                <img
                  src={activeAppointment.technician.avatar}
                  alt={activeAppointment.technician.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {activeAppointment.technician.name}
                  </h2>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {activeAppointment.technician.rating} rating
                  </p>
                  <div className="mt-4 flex flex-wrap gap-5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      HVAC Specialist
                    </span>
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Verified technician
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <CustomerActionButton variant="outline" feedbackTitle="Call prepared">
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </CustomerActionButton>
                <CustomerActionButton
                  variant="outline"
                  className={customerTones.outlineAction}
                  feedbackTitle="Message prepared"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </CustomerActionButton>
              </div>
            </Card>

            <Card className="border-border bg-card p-6 shadow-sm">
              <h2 className="font-semibold text-foreground">Visit Details</h2>
              <div className="mt-5 space-y-4 text-sm text-foreground">
                <p className="flex gap-3"><CalendarClock className="h-4 w-4 text-muted-foreground" /> {formatCustomerPortalDateTime(activeAppointment.scheduledFor)}</p>
                <p className="flex gap-3"><Clock className="h-4 w-4 text-muted-foreground" /> {activeAppointment.arrivalWindow}</p>
                <p className="flex gap-3"><MapPin className="h-4 w-4 text-muted-foreground" /> {activeAppointment.address}</p>
                <p className="flex gap-3"><FileText className="h-4 w-4 text-muted-foreground" /> {activeAppointment.issue}</p>
              </div>
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-foreground">{activeAppointment.progress}%</span>
                </div>
                <Progress value={activeAppointment.progress} />
                <p className="mt-2 text-sm text-muted-foreground">
                  Technician checked in and is heading to your location.
                </p>
              </div>
            </Card>

            <Card className="border-border bg-card p-6 shadow-sm">
              <h2 className="font-semibold text-foreground">Estimate & Protection</h2>
              <div className="mt-4 rounded-lg bg-gradient-to-br from-blue-700 to-blue-950 p-5 text-white dark:from-blue-800 dark:to-slate-950">
                <p className="text-sm text-blue-100">Approved visit estimate</p>
                <p className="mt-1 text-4xl font-semibold">
                  {formatCustomerPortalCurrency(activeAppointment.estimate)}
                </p>
              </div>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                {[
                  "Verified technician identity",
                  "Arrival and completion timestamps",
                  "Service notes stored in history",
                ].map((label) => (
                  <p key={label} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {label}
                  </p>
                ))}
              </div>
              <CustomerActionButton variant="link" className={`mt-3 h-auto px-0 ${customerTones.link}`} feedbackTitle="Agreement opened">
                View service agreement
              </CustomerActionButton>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
