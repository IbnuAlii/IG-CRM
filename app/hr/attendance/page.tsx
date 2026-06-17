"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AttendanceCalendar } from "@/components/hr/attendance/attendance-calendar";
import { AttendanceFilters } from "@/components/hr/attendance/attendance-filters";
import { AttendanceSummaryCards } from "@/components/hr/attendance/attendance-summary-cards";
import { AttendanceTable } from "@/components/hr/attendance/attendance-table";
import { ClockInPanel } from "@/components/hr/attendance/clock-in-panel";
import { HRActionButton } from "@/components/hr/action-button";
import {
  buildHRAttendanceRecords,
  buildHREmployeeRecords,
} from "@/components/hr/hr-data";
import { Button } from "@/components/ui/button";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();
const employees = buildHREmployeeRecords(data.employees);
const attendanceRecords = buildHRAttendanceRecords(employees);

export default function HRAttendancePage() {
  const [employeeId, setEmployeeId] = useState("all");
  const [status, setStatus] = useState("all");

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((record) => {
      const matchesEmployee = employeeId === "all" || record.employeeId === employeeId;
      const matchesStatus = status === "all" || record.status === status;
      return matchesEmployee && matchesStatus;
    });
  }, [employeeId, status]);

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Attendance"
        description="Track clock in/out history, GPS punch locations, weekly hours, overtime, leave blocks, and attendance exceptions."
        actions={
          <HRActionButton
            variant="outline"
            feedbackTitle="Attendance export prepared"
            feedbackDescription="Use the attendance table export to download filtered records."
          >
            <Download className="mr-2 h-4 w-4" />
            Export Attendance
          </HRActionButton>
        }
      />

      <AttendanceSummaryCards records={filteredRecords} />
      <AttendanceFilters
        employees={employees}
        employeeId={employeeId}
        setEmployeeId={setEmployeeId}
        status={status}
        setStatus={setStatus}
      />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
        <AttendanceTable records={filteredRecords} />
        <ClockInPanel employees={employees} />
      </div>

      <AttendanceCalendar records={filteredRecords} />
    </div>
  );
}
