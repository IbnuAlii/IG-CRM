"use client";

import { AlertTriangle, CheckCircle2, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AdminEmployee } from "@/types";
import type { RouteStop } from "./route-utils";
import { getRouteMetrics, getRouteReadiness } from "./route-utils";

export function RouteReviewPanel({
  technician,
  stops,
}: {
  technician?: AdminEmployee;
  stops: RouteStop[];
}) {
  const metrics = getRouteMetrics(stops);
  const warnings = getRouteReadiness({ technician, stops });

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Route Review</h2>
        <p className="text-sm text-muted-foreground">
          Optimization readiness before sending work to the technician.
        </p>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg border border-border/70 bg-background p-4">
          <p className="text-sm text-muted-foreground">Route owner</p>
          <p className="mt-1 font-semibold">
            {technician?.name ?? "Multiple or unassigned"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {technician?.currentLocation ?? "Use filters to focus one route"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border/70 bg-background p-3">
            <p className="text-xs text-muted-foreground">Service</p>
            <p className="mt-1 font-semibold">
              {Math.round(metrics.serviceMinutes)}m
            </p>
          </div>
          <div className="rounded-lg border border-border/70 bg-background p-3">
            <p className="text-xs text-muted-foreground">Saved</p>
            <p className="mt-1 font-semibold">{metrics.savedMinutes}m</p>
          </div>
        </div>

        <div className="space-y-2">
          {warnings.length > 0 ? (
            warnings.map((warning) => (
              <div
                key={warning}
                className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/25 dark:text-amber-200"
              >
                <div className="flex gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{warning}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900 dark:border-green-900 dark:bg-green-950/25 dark:text-green-200">
              <div className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Route is ready to send.</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button className="flex-1">
            <Navigation className="mr-2 h-4 w-4" />
            Accept Route
          </Button>
          <Button variant="outline" className="flex-1">
            Recalculate
          </Button>
        </div>

        <Badge variant="outline" className="w-full justify-center bg-background py-2">
          Mock route engine
        </Badge>
      </div>
    </Card>
  );
}
