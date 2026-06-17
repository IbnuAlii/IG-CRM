"use client";

import Link from "next/link";
import { ArrowRight, Clock3, GripVertical, MapPin } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { RouteStop } from "./route-utils";

export function RouteStopList({ stops }: { stops: RouteStop[] }) {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Optimized Stop Order</h2>
          <p className="text-sm text-muted-foreground">
            Review, accept, or manually adjust the suggested sequence.
          </p>
        </div>
        <Badge variant="outline" className="bg-background">
          {stops.length} stops
        </Badge>
      </div>

      <div className="space-y-3">
        {stops.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
            No jobs match the current route filters.
          </div>
        ) : (
          stops.map((stop) => (
            <div
              key={stop.job.id}
              className="grid grid-cols-1 gap-3 rounded-lg border border-border/70 bg-background p-4 lg:grid-cols-[auto_1fr_auto]"
            >
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {stop.sequence}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/dispatcher/jobs/${stop.job.id}`}
                    className="font-semibold hover:underline"
                  >
                    {stop.job.jobNumber}
                  </Link>
                  <AdminStatusBadge status={stop.job.priority} />
                  <AdminStatusBadge status={stop.job.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stop.job.customerName} - {stop.job.serviceType}
                </p>
                <p className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{stop.job.address}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <Badge variant="secondary" className="gap-1">
                  <Clock3 className="h-3.5 w-3.5" />
                  {Math.round(stop.driveMinutes)}m drive
                </Badge>
                <Badge variant="outline">{stop.distanceMiles.toFixed(1)} mi</Badge>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dispatcher/jobs/${stop.job.id}`}>
                    Open
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
