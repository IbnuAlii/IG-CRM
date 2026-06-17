"use client";

import { Card } from "@/components/ui/card";
import type { AdminEmployee } from "@/types";

export function JobAssignmentFitCard({
  technician,
}: {
  technician?: AdminEmployee;
}) {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <h2 className="font-semibold">Assignment Fit</h2>
      <div className="mt-4 space-y-3">
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm font-medium">Technician availability</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {technician
              ? `${technician.name} is scheduled ${technician.scheduledHours}/${technician.capacityHours} hours.`
              : "No technician is assigned. Select a technician from the assignment dialog."}
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm font-medium">Skills</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {technician?.skills.join(", ") ??
              "Skills will be checked after assignment."}
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm font-medium">Conflict detection</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Visual only for now. Backend scheduling rules will validate
            overlaps.
          </p>
        </div>
      </div>
    </Card>
  );
}
