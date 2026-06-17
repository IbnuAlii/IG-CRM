"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type {
  HRAttendanceRecord,
  HRCertificationRecord,
  HREmployeeRecord,
  HRLeaveBalance,
  HRPayrollRecord,
  HRTrainingRecord,
} from "@/components/hr/hr-data";
import { formatCurrency, formatDecimal, formatPercent } from "./hr-report-formatters";

export interface HRReportPreviewRow {
  id: string;
  employeeName: string;
  department: string;
  attendanceHours: number;
  overtimeHours: number;
  leaveAvailableHours: number;
  netPayroll: number;
  trainingCompletion: number;
  certificationAlerts: number;
}

export function buildHRReportRows({
  employees,
  attendanceRecords,
  leaveBalances,
  payrollRecords,
  trainingRecords,
  certifications,
  department,
}: {
  employees: HREmployeeRecord[];
  attendanceRecords: HRAttendanceRecord[];
  leaveBalances: HRLeaveBalance[];
  payrollRecords: HRPayrollRecord[];
  trainingRecords: HRTrainingRecord[];
  certifications: HRCertificationRecord[];
  department: string;
}): HRReportPreviewRow[] {
  return employees
    .filter((employee) => department === "all" || employee.department === department)
    .map((employee) => {
      const employeeAttendance = attendanceRecords.filter(
        (record) => record.employeeId === employee.id,
      );
      const employeeLeaveBalance = leaveBalances.find(
        (balance) => balance.employeeId === employee.id,
      );
      const employeePayroll = payrollRecords.find(
        (record) => record.employeeId === employee.id,
      );
      const employeeTraining = trainingRecords.filter(
        (record) => record.employeeId === employee.id,
      );
      const completedTraining = employeeTraining.filter(
        (record) => record.status === "completed",
      ).length;
      const employeeCertifications = certifications.filter(
        (certification) => certification.employeeId === employee.id,
      );

      return {
        id: employee.id,
        employeeName: employee.name,
        department: employee.department,
        attendanceHours: employeeAttendance.reduce(
          (total, record) => total + record.hoursWorked,
          0,
        ),
        overtimeHours: employeeAttendance.reduce(
          (total, record) => total + record.overtimeHours,
          0,
        ),
        leaveAvailableHours: employeeLeaveBalance
          ? employeeLeaveBalance.vacationHours +
            employeeLeaveBalance.sickHours +
            employeeLeaveBalance.personalHours
          : 0,
        netPayroll: employeePayroll?.netPay ?? 0,
        trainingCompletion:
          employeeTraining.length > 0
            ? (completedTraining / employeeTraining.length) * 100
            : 100,
        certificationAlerts: employeeCertifications.filter((certification) =>
          ["expiring", "expired", "missing"].includes(certification.status),
        ).length,
      };
    });
}

export function HRReportPreviewTable({
  rows,
  reportType,
}: {
  rows: HRReportPreviewRow[];
  reportType: string;
}) {
  const columns: DataTableColumn<HRReportPreviewRow>[] = [
    {
      id: "employee",
      header: "Employee",
      accessorFn: (row) => `${row.employeeName} ${row.department}`,
      cell: (row) => (
        <div>
          <p className="font-medium">{row.employeeName}</p>
          <p className="text-xs text-muted-foreground">{row.department}</p>
        </div>
      ),
    },
    {
      id: "attendance",
      header: "Attendance",
      accessorFn: (row) => row.attendanceHours,
      cell: (row) => (
        <div>
          <p>{formatDecimal(row.attendanceHours)}h</p>
          <p className="text-xs text-muted-foreground">
            {formatDecimal(row.overtimeHours)}h overtime
          </p>
        </div>
      ),
      align: "center",
    },
    {
      id: "leave",
      header: "Leave",
      accessorFn: (row) => row.leaveAvailableHours,
      cell: (row) => `${row.leaveAvailableHours}h available`,
      align: "center",
    },
    {
      id: "payroll",
      header: "Net Payroll",
      accessorFn: (row) => row.netPayroll,
      cell: (row) => formatCurrency(row.netPayroll),
      align: "center",
    },
    {
      id: "training",
      header: "Training",
      accessorFn: (row) => row.trainingCompletion,
      cell: (row) => (
        <div className="min-w-32">
          <div className="mb-1 text-xs">{formatPercent(row.trainingCompletion)}</div>
          <Progress value={row.trainingCompletion} />
        </div>
      ),
      align: "center",
    },
    {
      id: "certifications",
      header: "Cert Alerts",
      accessorFn: (row) => row.certificationAlerts,
      cell: (row) => (
        <Badge variant={row.certificationAlerts > 0 ? "destructive" : "secondary"}>
          {row.certificationAlerts}
        </Badge>
      ),
      align: "center",
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Generated Report Preview</h2>
        <p className="text-sm text-muted-foreground">
          Current view: {reportType.replace("_", " ")} report. Export uses the visible filtered rows.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(row) => row.id}
        emptyMessage="No report rows match these filters."
        searchPlaceholder="Search report..."
        exportFileName={`hr-${reportType}-report.csv`}
        features={{
          sorting: true,
          globalFilter: true,
          pagination: true,
          columnVisibility: true,
          export: true,
        }}
      />
    </Card>
  );
}
