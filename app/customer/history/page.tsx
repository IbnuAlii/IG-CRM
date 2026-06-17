"use client";

import { Calendar, ChevronLeft, ChevronRight, Download, FileText, MapPin, Search, Snowflake, Star, Wrench, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomerActionButton } from "@/components/customer/customer-action-button";
import { customerTones } from "@/components/customer/customer-tones";
import {
  formatCustomerPortalCurrency,
  formatCustomerPortalDate,
  getCustomerPortalData,
} from "@/components/customer/customer-data";

const data = getCustomerPortalData();

export default function HistoryPage() {
  return (
    <div className={customerTones.page}>
      <div className="mx-auto w-full max-w-[1760px] space-y-6 px-4 py-8 2xl:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className={`mb-4 px-3 py-1.5 ${customerTones.badge.info}`}>
              Service records
            </Badge>
            <h1 className="text-4xl font-semibold tracking-normal text-foreground">Service History</h1>
            <p className="mt-3 max-w-3xl text-base text-muted-foreground">
              Completed visits, quotes, invoices, technician ratings, and downloadable records.
            </p>
          </div>
          <CustomerActionButton variant="outline" feedbackTitle="History export prepared">
            <Download className="mr-2 h-4 w-4" />
            Export History
          </CustomerActionButton>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Completed visits", data.appointments.filter((item) => item.status === "completed").length, Calendar, customerTones.icon.blue],
            ["Open quotes", data.quotes.filter((quote) => quote.status === "pending").length, FileText, customerTones.icon.violet],
            ["Paid invoices", data.invoices.filter((invoice) => invoice.status === "paid").length, FileText, customerTones.icon.emerald],
          ].map(([label, value, Icon, tone]) => {
            const IconComponent = Icon as typeof Calendar;
            return (
              <Card key={label as string} className="border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-5">
                  <div className={`grid h-16 w-16 place-items-center rounded-lg ${tone as string}`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-lg text-muted-foreground">{label as string}</p>
                    <p className="mt-1 text-3xl font-semibold text-foreground">{value as number}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="border-border bg-card p-5 shadow-sm">
          <div className="grid gap-4 xl:grid-cols-[1fr_220px_220px_220px_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search services, addresses, or technicians..." />
            </div>
            <Select><SelectTrigger><SelectValue placeholder="All status" /></SelectTrigger><SelectContent><SelectItem value="all">All status</SelectItem></SelectContent></Select>
            <Select><SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger><SelectContent><SelectItem value="all">All types</SelectItem></SelectContent></Select>
            <Select><SelectTrigger><SelectValue placeholder="All time" /></SelectTrigger><SelectContent><SelectItem value="all">All time</SelectItem></SelectContent></Select>
            <CustomerActionButton variant="link" className={customerTones.link} feedbackTitle="Filters cleared">Clear filters</CustomerActionButton>
          </div>

          <div className="mt-5 space-y-3">
            {data.appointments.map((appointment, index) => {
              const Icon = index === 0 ? Snowflake : index === 1 ? Wrench : Zap;
              const tone = index === 0 ? customerTones.icon.blue : index === 1 ? customerTones.icon.emerald : customerTones.icon.violet;
              return (
                <div key={appointment.id} className="grid gap-4 rounded-lg border border-border p-5 xl:grid-cols-[1fr_180px_160px] xl:items-center">
                  <div className="flex gap-5">
                    <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-lg ${tone}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold text-foreground">{appointment.service}</h2>
                        <Badge className={appointment.status === "completed" ? customerTones.badge.success : appointment.status === "awaiting_approval" ? customerTones.badge.pending : customerTones.badge.pending}>
                          {appointment.status.replaceAll("_", " ")}
                        </Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {formatCustomerPortalDate(appointment.scheduledFor)}</span>
                        <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {appointment.address}</span>
                        <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {appointment.technician.name} / {appointment.technician.rating}</span>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{appointment.issue}</p>
                    </div>
                  </div>
                  <div
                    className={`rounded-lg px-6 py-4 text-center ${
                      index === 0
                        ? customerTones.icon.blue
                        : index === 1
                          ? customerTones.icon.emerald
                          : customerTones.icon.violet
                    }`}
                  >
                    <p className="text-sm text-muted-foreground">Estimate</p>
                    <p className="text-3xl font-semibold text-foreground">{formatCustomerPortalCurrency(appointment.estimate)}</p>
                  </div>
                  <CustomerActionButton variant="outline" feedbackTitle="Service record opened">
                    <FileText className="mr-2 h-4 w-4" />
                    Details
                  </CustomerActionButton>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>Showing 1 to 3 of 3 records</p>
            <div className="flex items-center justify-center gap-2">
              <CustomerActionButton variant="outline" size="icon" feedbackTitle="Previous page"><ChevronLeft className="h-4 w-4" /></CustomerActionButton>
              <span className="grid h-9 w-9 place-items-center rounded-md bg-blue-600 text-white">1</span>
              <CustomerActionButton variant="outline" size="icon" feedbackTitle="Next page"><ChevronRight className="h-4 w-4" /></CustomerActionButton>
            </div>
            <Select><SelectTrigger className="w-[140px]"><SelectValue placeholder="10 per page" /></SelectTrigger><SelectContent><SelectItem value="10">10 per page</SelectItem></SelectContent></Select>
          </div>
        </Card>
      </div>
    </div>
  );
}
