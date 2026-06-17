"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AdminEmployee } from "@/types";

export function DashboardTechnicianLoadout({
  technicians,
}: {
  technicians: AdminEmployee[];
}) {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Technician Loadout</h2>
          <p className="text-sm text-muted-foreground">
            Capacity, location, rating, and skill readiness at a glance.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/team">Manage Team</Link>
        </Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {technicians.map((technician) => {
          const utilization = Math.round(
            (technician.scheduledHours / technician.capacityHours) * 100,
          );

          return (
            <Link key={technician.id} href="/admin/team" className="rounded-lg border border-border/70 bg-background p-4 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{technician.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {technician.currentLocation}
                  </p>
                </div>
                {technician.status === "active" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AdminStatusBadge status={technician.status} />
                )}
              </div>
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium">Utilization</span>
                  <span className="text-muted-foreground">{utilization}%</span>
                </div>
                <Progress value={utilization} />
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {technician.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="secondary" className="font-normal">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
