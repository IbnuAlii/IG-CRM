"use client";

import { useMemo, useState } from "react";
import { Download, Mail } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  buildHRAttendanceRecords,
  buildHRCertificationRecords,
  buildHREmployeeRecords,
  buildHRLeaveBalances,
  buildHRLeaveRequests,
  buildHRPayrollPeriods,
  buildHRPayrollRecords,
  buildHRTrainingRecords,
} from "@/components/hr/hr-data";
import { HRCompliancePanel } from "@/components/hr/reports/hr-compliance-panel";
import { HRDepartmentCostPanel } from "@/components/hr/reports/hr-department-cost-panel";
import { HRReportControls } from "@/components/hr/reports/hr-report-controls";
import { HRReportLibrary } from "@/components/hr/reports/hr-report-library";
import {
  buildHRReportRows,
  HRReportPreviewTable,
} from "@/components/hr/reports/hr-report-preview-table";
import { HRReportSummaryCards } from "@/components/hr/reports/hr-report-summary-cards";
import { HRActionButton } from "@/components/hr/action-button";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();
const employees = buildHREmployeeRecords(data.employees);
const attendanceRecords = buildHRAttendanceRecords(employees);
const leaveRequests = buildHRLeaveRequests(employees);
const leaveBalances = buildHRLeaveBalances(employees);
const payrollPeriod = buildHRPayrollPeriods()[0];
const payrollRecords = buildHRPayrollRecords({
  employees,
  attendanceRecords,
  period: payrollPeriod,
});
const trainingRecords = buildHRTrainingRecords(employees);
const certifications = buildHRCertificationRecords(employees);

export default function HRReportsPage() {
  const [reportType, setReportType] = useState("workforce");
  const [department, setDepartment] = useState("all");

  const departments = useMemo(
    () => Array.from(new Set(employees.map((employee) => employee.department))).sort(),
    [],
  );

  const reportRows = useMemo(
    () =>
      buildHRReportRows({
        employees,
        attendanceRecords,
        leaveBalances,
        payrollRecords,
        trainingRecords,
        certifications,
        department,
      }),
    [department],
  );

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="HR Reports"
        description="Generate HR reports for attendance, leave, payroll, labor cost, training compliance, certifications, and employee data exports."
        actions={
          <>
            <HRActionButton
              variant="outline"
              feedbackTitle="Report email scheduled"
              feedbackDescription="The selected HR report was scheduled for email delivery."
            >
              <Mail className="mr-2 h-4 w-4" />
              Schedule Email
            </HRActionButton>
            <HRActionButton
              feedbackTitle="Report export prepared"
              feedbackDescription="The generated HR report preview is ready for CSV export."
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </HRActionButton>
          </>
        }
      />

      <HRReportControls
        reportType={reportType}
        setReportType={setReportType}
        department={department}
        setDepartment={setDepartment}
        departments={departments}
      />
      <HRReportSummaryCards
        attendanceRecords={attendanceRecords}
        leaveRequests={leaveRequests}
        payrollRecords={payrollRecords}
        certifications={certifications}
      />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
        <HRReportPreviewTable rows={reportRows} reportType={reportType} />
        <HRReportLibrary />
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[0.9fr_1.1fr]">
        <HRCompliancePanel
          trainingRecords={trainingRecords}
          certifications={certifications}
          payrollRecords={payrollRecords}
        />
        <HRDepartmentCostPanel payrollRecords={payrollRecords} />
      </div>
    </div>
  );
}
