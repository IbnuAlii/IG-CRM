"use client";

import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AdminJob } from "@/types";

export function JobDetailsCard({ job }: { job: AdminJob }) {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <h2 className="font-semibold">Job Details</h2>
      <div className="mt-4 space-y-4 text-sm">
        <div>
          <p className="font-medium">Description</p>
          <p className="mt-1 text-muted-foreground">{job.description}</p>
        </div>
        <Separator />
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">Service address</p>
            <p className="text-muted-foreground">{job.address}</p>
          </div>
        </div>
        <div>
          <p className="font-medium">Special instructions</p>
          <p className="mt-1 text-muted-foreground">
            {job.specialInstructions ?? "No special instructions were added."}
          </p>
        </div>
      </div>
    </Card>
  );
}
