"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CalendarClock,
  CalendarDays,
  ChevronRight,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  MapPin,
  MessageSquare,
  ReceiptText,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { CustomerActionButton } from "@/components/customer/customer-action-button";
import { customerTones } from "@/components/customer/customer-tones";
import {
  formatCustomerPortalCurrency,
  formatCustomerPortalDate,
  formatCustomerPortalDateTime,
  getCustomerPortalData,
} from "@/components/customer/customer-data";

const data = getCustomerPortalData();

export default function CustomerHomePage() {
  const [serviceType, setServiceType] = useState("HVAC repair");
  const [address, setAddress] = useState(data.locations[0].address);
  const [details, setDetails] = useState("");

  const activeAppointment = data.appointments.find(
    (appointment) => appointment.status !== "completed",
  );
  const openQuotes = data.quotes.filter((quote) => quote.status === "pending");
  const paidInvoices = data.invoices.filter((invoice) => invoice.status === "paid");
  const lifetimeSpend = useMemo(
    () => data.invoices.reduce((sum, invoice) => sum + invoice.amount, 0),
    [],
  );

  return (
    <div className={customerTones.page}>
      <section className="relative overflow-hidden border-b border-blue-950/20 bg-[#061a3d] text-white">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 8%, rgba(37,99,235,0.55), transparent 30%), radial-gradient(circle at 72% 18%, rgba(14,165,233,0.25), transparent 28%), linear-gradient(135deg, #061a3d 0%, #07142f 48%, #050d22 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-[-12%] top-[52%] h-[520px] w-[760px] rounded-full border border-blue-400/10" />
        <div className="pointer-events-none absolute right-[16%] top-[20%] h-[460px] w-[620px] rounded-full border border-blue-300/10" />
        <div className="pointer-events-none absolute left-[48%] top-[24%] h-1 w-1 rounded-full bg-blue-200/80 shadow-[0_0_28px_8px_rgba(147,197,253,0.35)]" />
        <div className="relative mx-auto grid w-full max-w-[1760px] gap-8 px-4 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:py-14 2xl:px-8 2xl:py-16">
          <div className="flex flex-col justify-center">
            <Badge className="mb-5 w-fit rounded-full border-white/20 bg-card/10 px-4 py-1.5 text-white hover:bg-card/10">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Premium customer care portal
            </Badge>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal md:text-5xl xl:text-6xl">
              Service visits, quotes, payments, and updates in one polished place.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground xl:text-lg">
              Request support, follow technician arrival, approve quotes, and keep every service record organized without calling the office.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Next Arrival",
                  value: activeAppointment?.arrivalWindow ?? "No visit",
                  detail: "Today",
                  icon: CalendarDays,
                  tone: "bg-blue-500 shadow-blue-500/30",
                },
                {
                  label: "Open Quotes",
                  value: String(openQuotes.length),
                  detail: "Pending review",
                  icon: FileText,
                  tone: "bg-emerald-500 shadow-emerald-500/30",
                },
                {
                  label: "Paid Invoices",
                  value: String(paidInvoices.length),
                  detail: "All up to date",
                  icon: ReceiptText,
                  tone: "bg-violet-500 shadow-violet-500/30",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="flex items-center gap-4 rounded-lg border border-white/15 bg-card/10 p-4 shadow-lg shadow-blue-950/20 backdrop-blur">
                    <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg text-white shadow-lg ${item.tone}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-xl font-semibold">{item.value}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                </div>
                );
              })}
            </div>
          </div>

          <Card className="border-white/20 bg-card p-5 text-foreground shadow-2xl shadow-blue-950/25 md:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Request Service</h2>
                <p className="text-sm text-muted-foreground">
                  Send a clear request and receive scheduling updates.
                </p>
              </div>
              <div className={`grid h-12 w-12 place-items-center rounded-lg ${customerTones.icon.blue}`}>
                <Settings className="h-5 w-5" />
              </div>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Service needed</label>
                <Input value={serviceType} onChange={(event) => setServiceType(event.target.value)} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Service address</label>
                <Input value={address} onChange={(event) => setAddress(event.target.value)} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">What is happening?</label>
                <Textarea
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  placeholder="Describe symptoms, access notes, preferred time, or urgency."
                  className="min-h-24"
                />
              </div>
              <CustomerActionButton
                className="bg-blue-600 hover:bg-blue-700"
                feedbackTitle="Service request prepared"
                feedbackDescription={`${serviceType} at ${address} is ready for backend scheduling.`}
              >
                Submit Request
                <ArrowRight className="ml-2 h-4 w-4" />
              </CustomerActionButton>
            </div>
          </Card>
        </div>
      </section>

        <div className="mx-auto w-full max-w-[1760px] space-y-6 px-4 py-6 2xl:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Care Score",
              value: "98%",
              detail: "Appointments and invoices in good standing",
              icon: ShieldCheck,
              tone: customerTones.icon.blue,
            },
            {
              label: "Lifetime Spend",
              value: formatCustomerPortalCurrency(lifetimeSpend),
              detail: "Across completed service visits",
              icon: CreditCard,
              tone: customerTones.icon.emerald,
            },
            {
              label: "Preferred Tech",
              value: "4.9",
              detail: "Average technician rating",
              icon: Star,
              tone: customerTones.icon.violet,
            },
            {
              label: "Saved Sites",
              value: data.locations.length,
              detail: "Homes, offices, and service locations",
              icon: Building2,
              tone: customerTones.icon.orange,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.label} className="border-border bg-card p-5 shadow-sm shadow-border/40">
                <div className="flex items-center gap-4">
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg ${item.tone}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">{item.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Card className="border-border bg-card p-5 shadow-sm shadow-border/40">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${customerTones.icon.blue}`}>
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                <h2 className="text-xl font-semibold text-foreground">Today&apos;s Service</h2>
                <p className="text-sm text-muted-foreground">
                  Live appointment status, arrival window, technician, and service scope.
                </p>
                </div>
              </div>
              <Badge className={`w-fit ${customerTones.badge.status}`}>
                Technician en route
              </Badge>
            </div>
            {activeAppointment ? (
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeAppointment.technician.avatar}
                      alt={activeAppointment.technician.name}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{activeAppointment.technician.name}</p>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {activeAppointment.technician.rating} technician rating
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex gap-2">
                      <CalendarClock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <span>{formatCustomerPortalDateTime(activeAppointment.scheduledFor)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <span>{activeAppointment.arrivalWindow}</span>
                    </div>
                    <div className="flex gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <span>{activeAppointment.address}</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-medium text-foreground">{activeAppointment.service}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{activeAppointment.issue}</p>
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-muted-foreground">Visit progress</span>
                      <span className="font-medium">{activeAppointment.progress}%</span>
                    </div>
                    <Progress value={activeAppointment.progress} />
                  </div>
                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <CustomerActionButton
                      feedbackTitle="Technician contacted"
                      feedbackDescription={`Message to ${activeAppointment.technician.name} is ready for backend messaging.`}
                      variant="outline"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </CustomerActionButton>
                    <CustomerActionButton
                      feedbackTitle="Appointment details opened"
                      feedbackDescription={`${activeAppointment.id} details are ready.`}
                    >
                      View Details
                    </CustomerActionButton>
                  </div>
                </div>
              </div>
            ) : null}
          </Card>

          <Card className="border-border bg-card p-5 shadow-sm shadow-border/40">
            <div className="flex gap-4">
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${customerTones.icon.blue}`}>
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Action Center</h2>
                <p className="text-sm text-muted-foreground">
                  Quick approvals and account items that need your attention.
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {openQuotes.map((quote) => (
                <div key={quote.id} className={customerTones.surface.warning}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={customerTones.surface.warningText}>{quote.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Valid until {formatCustomerPortalDate(quote.validUntil)}
                      </p>
                    </div>
                    <p className={`font-semibold ${customerTones.surface.warningText}`}>
                      {formatCustomerPortalCurrency(quote.amount)}
                    </p>
                  </div>
                  <CustomerActionButton
                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700"
                    size="sm"
                    feedbackTitle="Quote approval prepared"
                    feedbackDescription={`${quote.id} approval is ready for backend processing.`}
                  >
                    Approve Quote
                  </CustomerActionButton>
                </div>
              ))}
              <div className="rounded-lg border border-border p-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="font-medium text-foreground">Payments are current</p>
                    <p className="text-sm text-muted-foreground">
                      Your latest invoice was paid successfully.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {data.locations.map((location) => (
            <Card key={location.id} className="border-border bg-card p-5 shadow-sm shadow-border/40">
              <div className="flex items-center gap-4">
                <div className={`grid h-12 w-12 place-items-center rounded-lg ${customerTones.icon.blue}`}>
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-foreground">{location.label}</p>
                    <Badge variant="outline">{location.type}</Badge>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{location.address}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
