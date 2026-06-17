"use client";

import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { HRAttendanceRecord } from "@/components/hr/hr-data";

function formatDay(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function AttendanceCalendar({
  records,
}: {
  records: HRAttendanceRecord[];
}) {
  const days = Array.from(new Set(records.map((record) => record.date))).sort();

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-muted/20 p-5">
        <div>
          <h2 className="text-lg font-semibold">Attendance Calendar</h2>
          <p className="text-sm text-muted-foreground">
            Weekly attendance coverage with leave and exception markers.
          </p>
        </div>
        <CalendarDays className="h-5 w-5 text-primary" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5">
        {days.map((day) => {
          const dayRecords = records.filter((record) => record.date === day);
          const exceptions = dayRecords.filter((record) =>
            ["late", "missed"].includes(record.status),
          ).length;
          const leaveCount = dayRecords.filter((record) => record.status === "on_leave").length;

          return (
            <div
              key={day}
              className="min-h-48 border-b border-border/70 p-4 xl:border-r xl:last:border-r-0"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="font-medium">{formatDay(day)}</p>
                <Badge variant={exceptions > 0 ? "destructive" : "secondary"}>
                  {exceptions} exceptions
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="rounded-md border border-border/70 bg-background p-3">
                  <p className="font-medium">{dayRecords.length} attendance records</p>
                  <p className="text-xs text-muted-foreground">
                    {leaveCount} leave blocks
                  </p>
                </div>
                {dayRecords.slice(0, 3).map((record) => (
                  <div
                    key={record.id}
                    className="rounded-md border border-border/70 bg-background p-2"
                  >
                    <p className="truncate font-medium">{record.employeeName}</p>
                    <p className="text-xs text-muted-foreground">
                      {record.status.replace("_", " ")} - {record.hoursWorked.toFixed(1)}h
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
