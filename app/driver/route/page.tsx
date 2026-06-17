"use client";

import { Download, LocateFixed, MapPin, Navigation, Radio, Route } from "lucide-react";
import { TechnicianActionButton } from "@/components/driver/technician-action-button";
import { TechnicianPageHeader } from "@/components/driver/technician-page-header";
import { TechnicianRoutePanel } from "@/components/driver/technician-route-panel";
import {
  getTodayTechnicianJobs,
  getTechnicianData,
  technicianProfile,
  technicianRouteStops,
} from "@/components/driver/technician-utils";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function TechnicianRoutePage() {
  const { jobs } = getTechnicianData();
  const routeJobs = getTodayTechnicianJobs(jobs);
  const currentJob = routeJobs[0];

  return (
    <div className="mx-auto w-full max-w-[1760px] space-y-8 px-4 py-6 2xl:px-8">
      <TechnicianPageHeader
        badge="Route & location"
        title="Route Center"
        description="Review route order, live GPS health, job-linked geo-fences, distance, and navigation status."
        actions={
          <>
            <TechnicianActionButton variant="outline" feedbackTitle="Location ping sent">
              <LocateFixed className="mr-2 h-4 w-4" />
              Send Location
            </TechnicianActionButton>
            <TechnicianActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle="Route export prepared">
              <Download className="mr-2 h-4 w-4" />
              Export Route
            </TechnicianActionButton>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.75fr]">
        {currentJob ? <TechnicianRoutePanel job={currentJob} /> : null}

        <div className="space-y-6">
          <Card className="border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Radio className="h-5 w-5 text-emerald-600" />
              <div>
                <h2 className="text-xl font-semibold text-foreground">GPS Health</h2>
                <p className="text-sm text-muted-foreground">Live tracking via mobile app.</p>
              </div>
            </div>
            <div className="mt-5 space-y-4 text-sm">
              <RouteLine label="Status" value="Online" />
              <RouteLine label="Last update" value={technicianProfile.gpsUpdatedAt} />
              <RouteLine label="Current area" value={technicianProfile.location} />
              <RouteLine label="Vehicle" value={technicianProfile.vehicle} />
              <RouteLine label="Speed" value="18 mph" />
            </div>
          </Card>

          <Card className="border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Route Metrics</h2>
            <div className="mt-5 space-y-5">
              {[
                ["Distance remaining", "18.4 mi", 64],
                ["Route completion", "36%", 36],
                ["ETA confidence", "92%", 92],
              ].map(([label, value, progress]) => (
                <div key={label as string}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">{label as string}</span>
                    <span className="font-medium text-foreground">{value as string}</span>
                  </div>
                  <Progress value={progress as number} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Navigation className="h-5 w-5 text-blue-700" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">Optimized Stop Order</h2>
            <p className="text-sm text-muted-foreground">Dispatch-approved order with geo-fence status at customer locations.</p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          {technicianRouteStops.map((stop, index) => (
            <div key={stop.label} className="rounded-lg border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className={`grid h-9 w-9 place-items-center rounded-full ${stop.status === "current" ? "bg-blue-600 text-white" : stop.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                  {index + 1}
                </div>
                <span className="text-sm font-medium text-muted-foreground">{stop.eta}</span>
              </div>
              <p className="font-semibold text-foreground">{stop.label}</p>
              <p className="mt-2 flex gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                {stop.address}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function RouteLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
