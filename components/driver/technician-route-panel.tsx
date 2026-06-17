"use client";

import { Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LeafletRouteMap } from "@/components/map/leaflet-route-map";
import type { AdminJob } from "@/types";

export function TechnicianRoutePanel({ job }: { job: AdminJob }) {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Route To Job</h2>
          <p className="text-sm text-muted-foreground">
            Technician route context for assigned service location.
          </p>
        </div>
        <Button size="sm">
          <Navigation className="mr-2 h-4 w-4" />
          Navigate
        </Button>
      </div>
      <LeafletRouteMap
        className="h-72"
        points={[
          {
            id: "technician-origin",
            label: "T",
            detail: "Technician current location",
            lat: 40.758,
            lng: -73.9855,
            kind: "origin",
          },
          {
            id: job.id,
            label: "1",
            detail: `${job.jobNumber} - ${job.address}`,
            lat: 40.7505,
            lng: -73.9934,
            kind: job.priority === "emergency" ? "emergency" : "stop",
          },
        ]}
      />
      <Badge variant="secondary" className="mt-3">
        18 min drive
      </Badge>
    </Card>
  );
}
