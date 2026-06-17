"use client";

import { useMemo, useState } from "react";
import { Calculator, Download } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  buildHRAttendanceRecords,
  buildHREmployeeRecords,
  buildHRPayrollPeriods,
  buildHRPayrollRecords,
  buildHRPayslipRecords,
} from "@/components/hr/hr-data";
import { PayrollControls } from "@/components/hr/payroll/payroll-controls";
import { PayrollReportCards } from "@/components/hr/payroll/payroll-report-cards";
import { PayrollReviewPanel } from "@/components/hr/payroll/payroll-review-panel";
import { PayrollRunTable } from "@/components/hr/payroll/payroll-run-table";
import { PayrollSummaryCards } from "@/components/hr/payroll/payroll-summary-cards";
import { PayslipHistory } from "@/components/hr/payroll/payslip-history";
import { HRActionButton } from "@/components/hr/action-button";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();
const employees = buildHREmployeeRecords(data.employees);
const attendanceRecords = buildHRAttendanceRecords(employees);
const payrollPeriods = buildHRPayrollPeriods();

export default function HRPayrollPage() {
  const [periodId, setPeriodId] = useState(payrollPeriods[0]?.id ?? "");
  const [status, setStatus] = useState("all");

  const selectedPeriod =
    payrollPeriods.find((period) => period.id === periodId) ?? payrollPeriods[0];

  const payrollRecords = useMemo(
    () =>
      buildHRPayrollRecords({
        employees,
        attendanceRecords,
        period: selectedPeriod,
      }),
    [selectedPeriod],
  );

  const filteredPayrollRecords = useMemo(() => {
    return payrollRecords.filter((record) => {
      return status === "all" || record.status === status;
    });
  }, [payrollRecords, status]);

  const payslips = useMemo(
    () => buildHRPayslipRecords(filteredPayrollRecords, selectedPeriod),
    [filteredPayrollRecords, selectedPeriod],
  );

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Payroll"
        description="Process payroll from attendance data, review overtime, apply taxes and deductions, approve runs, generate payslips, and export reports."
        actions={
          <>
            <HRActionButton
              variant="outline"
              feedbackTitle="Payroll export prepared"
              feedbackDescription="Use table exports for the filtered payroll rows and payslips."
            >
              <Download className="mr-2 h-4 w-4" />
              Export Payroll
            </HRActionButton>
            <HRActionButton
              feedbackTitle="Payroll calculated"
              feedbackDescription="Payroll rows were recalculated from attendance, overtime, deductions, and bonuses."
            >
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Payroll
            </HRActionButton>
          </>
        }
      />

      <PayrollControls
        periods={payrollPeriods}
        periodId={periodId}
        setPeriodId={setPeriodId}
        status={status}
        setStatus={setStatus}
      />
      <PayrollSummaryCards records={filteredPayrollRecords} />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
        <PayrollRunTable records={filteredPayrollRecords} />
        <PayrollReviewPanel
          period={selectedPeriod}
          records={filteredPayrollRecords}
        />
      </div>

      <PayslipHistory payslips={payslips} />
      <PayrollReportCards records={filteredPayrollRecords} />
    </div>
  );
}
