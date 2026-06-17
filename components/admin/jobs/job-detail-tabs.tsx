"use client";

import { Route } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AdminJob } from "@/types";
import { formatJobDetailDateTime } from "./job-detail-formatters";

export function JobDetailTabs({ job }: { job: AdminJob }) {
  return (
    <Tabs defaultValue="timeline" className="space-y-4">
      <TabsList>
        <TabsTrigger value="timeline">Status History</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="attachments">Attachments</TabsTrigger>
        <TabsTrigger value="route">Route</TabsTrigger>
      </TabsList>
      <TabsContent value="timeline">
        <Card className="border-border/70 bg-card p-5 shadow-sm">
          <div className="space-y-3">
            {[
              ["Created", "Job was created from Admin module mock data."],
              ["Scheduled", `Scheduled for ${formatJobDetailDateTime(job.scheduledStart)}.`],
              [job.status, `Current status is ${job.status.replace("_", " ")}.`],
            ].map(([title, description]) => (
              <div key={title} className="rounded-lg border border-border p-4">
                <p className="font-medium">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="notes">
        <Card className="border-border/70 bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Job notes and technician updates will appear here. This pass
            includes the page structure and mocked context.
          </p>
        </Card>
      </TabsContent>
      <TabsContent value="attachments">
        <Card className="border-border/70 bg-card p-5 shadow-sm">
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Photos, PDFs, and signed forms will be attached here.
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="route">
        <Card className="border-border/70 bg-card p-5 shadow-sm">
          <div className="relative h-80 overflow-hidden rounded-lg border border-border bg-[linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px),linear-gradient(0deg,hsl(var(--border))_1px,transparent_1px)] bg-[size:40px_40px]">
            <div className="absolute left-[24%] top-[32%] rounded-full bg-primary p-3 text-primary-foreground shadow-md">
              <Route className="h-5 w-5" />
            </div>
            <div className="absolute right-[24%] bottom-[28%] rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 shadow-sm dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
              {job.jobNumber}
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
