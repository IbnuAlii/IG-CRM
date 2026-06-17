"use client";

import { Clock, MapPin, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HRActionButton } from "@/components/hr/action-button";
import type { HREmployeeRecord } from "@/components/hr/hr-data";

export function ClockInPanel({
  employees,
}: {
  employees: HREmployeeRecord[];
}) {
  const fieldEmployees = employees.filter((employee) => employee.role === "technician");

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Clock In/Out</h2>
          <p className="text-sm text-muted-foreground">
            Mock mobile attendance capture with GPS location and duplicate punch prevention.
          </p>
        </div>
        <Smartphone className="h-5 w-5 text-primary" />
      </div>

      <div className="space-y-3">
        {fieldEmployees.map((employee, index) => (
          <div
            key={employee.id}
            className="rounded-lg border border-border/70 bg-background p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">{employee.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {employee.workLocation}
                </p>
              </div>
              <Badge variant={index === 0 ? "default" : "secondary"}>
                {index === 0 ? "Clocked in" : "Ready"}
              </Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <HRActionButton
                size="sm"
                variant={index === 0 ? "outline" : "default"}
                feedbackTitle="Clock-in recorded"
                feedbackDescription={`${employee.name} clock-in was captured with GPS context.`}
              >
                <Clock className="mr-2 h-4 w-4" />
                Clock In
              </HRActionButton>
              <HRActionButton
                size="sm"
                variant="outline"
                feedbackTitle="Clock-out recorded"
                feedbackDescription={`${employee.name} clock-out was captured and hours recalculated.`}
              >
                Clock Out
              </HRActionButton>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
