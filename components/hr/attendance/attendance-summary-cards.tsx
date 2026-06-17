"use client";

import { AlertTriangle, CalendarCheck, Clock, MapPin } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { HRAttendanceRecord } from "@/components/hr/hr-data";

export function AttendanceSummaryCards({
  records,
}: {
  records: HRAttendanceRecord[];
}) {
  const todayRecords = records.filter((record) => record.date === "2026-05-21");
  const clockedIn = todayRecords.filter((record) => record.status === "clocked_in").length;
  const totalHours = records.reduce((total, record) => total + record.hoursWorked, 0);
  const overtime = records.reduce((total, record) => total + record.overtimeHours, 0);
  const exceptions = records.filter((record) =>
    ["late", "missed"].includes(record.status),
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Clocked In"
        value={clockedIn}
        description="Active mobile/web sessions today"
        trend={`${todayRecords.length} expected records`}
        icon={Clock}
        tone="blue"
      />
      <AdminStatCard
        label="Tracked Hours"
        value={totalHours.toFixed(1)}
        description="Current weekly mock total"
        trend="Feeds payroll calculations"
        icon={CalendarCheck}
        tone="green"
      />
      <AdminStatCard
        label="Overtime"
        value={`${overtime.toFixed(1)}h`}
        description="Flagged for payroll review"
        trend="Over 40h or custom rules"
        icon={AlertTriangle}
        tone={overtime > 0 ? "amber" : "green"}
      />
      <AdminStatCard
        label="GPS Captures"
        value={records.filter((record) => record.gpsLocation).length}
        description="Location attached to punches"
        trend={`${exceptions} attendance exceptions`}
        icon={MapPin}
        tone={exceptions > 0 ? "amber" : "blue"}
      />
    </div>
  );
}
