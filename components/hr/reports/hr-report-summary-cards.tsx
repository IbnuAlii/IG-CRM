"use client";

import { BadgeCheck, Clock, FileText, ReceiptText } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type {
  HRAttendanceRecord,
  HRCertificationRecord,
  HRLeaveRequest,
  HRPayrollRecord,
} from "@/components/hr/hr-data";
import { formatCurrency, formatDecimal } from "./hr-report-formatters";

export function HRReportSummaryCards({
  attendanceRecords,
  leaveRequests,
  payrollRecords,
  certifications,
}: {
  attendanceRecords: HRAttendanceRecord[];
  leaveRequests: HRLeaveRequest[];
  payrollRecords: HRPayrollRecord[];
  certifications: HRCertificationRecord[];
}) {
  const totalHours = attendanceRecords.reduce(
    (total, record) => total + record.hoursWorked,
    0,
  );
  const approvedLeaveHours = leaveRequests
    .filter((request) => request.status === "approved")
    .reduce((total, request) => total + request.requestedHours, 0);
  const payrollTotal = payrollRecords.reduce(
    (total, record) => total + record.netPay,
    0,
  );
  const certificationAlerts = certifications.filter((certification) =>
    ["expiring", "expired", "missing"].includes(certification.status),
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Attendance Hours"
        value={formatDecimal(totalHours)}
        description="Reported working hours"
        trend="Includes GPS punch records"
        icon={Clock}
        tone="blue"
      />
      <AdminStatCard
        label="Approved Leave"
        value={`${approvedLeaveHours}h`}
        description="Approved schedule blocks"
        trend={`${leaveRequests.length} total requests`}
        icon={FileText}
        tone="amber"
      />
      <AdminStatCard
        label="Net Payroll"
        value={formatCurrency(payrollTotal)}
        description="Payroll report preview"
        trend="Exportable for accounting"
        icon={ReceiptText}
        tone="green"
      />
      <AdminStatCard
        label="Compliance Alerts"
        value={certificationAlerts}
        description="Training/certification issues"
        trend="Reminder queue source"
        icon={BadgeCheck}
        tone={certificationAlerts > 0 ? "red" : "green"}
      />
    </div>
  );
}
