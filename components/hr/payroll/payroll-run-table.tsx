"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HRActionButton } from "@/components/hr/action-button";
import type { HRPayrollRecord, HRPayrollStatus } from "@/components/hr/hr-data";
import { formatCurrency, formatDecimal } from "./payroll-formatters";

const statusLabels: Record<HRPayrollStatus, string> = {
  draft: "Draft",
  review: "In Review",
  approved: "Approved",
  paid: "Paid",
};

function getStatusVariant(status: HRPayrollStatus) {
  if (status === "approved" || status === "paid") return "secondary";
  if (status === "review") return "default";
  return "outline";
}

export function PayrollRunTable({
  records,
}: {
  records: HRPayrollRecord[];
}) {
  const columns: DataTableColumn<HRPayrollRecord>[] = [
    {
      id: "employee",
      header: "Employee",
      accessorFn: (record) =>
        `${record.employeeName} ${record.employeeNumber} ${record.department}`,
      cell: (record) => (
        <div>
          <p className="font-medium">{record.employeeName}</p>
          <p className="text-xs text-muted-foreground">
            {record.employeeNumber} - {record.department}
          </p>
        </div>
      ),
      exportValue: (record) =>
        `${record.employeeNumber} ${record.employeeName}`,
    },
    {
      id: "hours",
      header: "Hours",
      accessorFn: (record) => record.regularHours + record.overtimeHours,
      cell: (record) => (
        <div>
          <p>{formatDecimal(record.regularHours)} regular</p>
          <p className="text-xs text-muted-foreground">
            {formatDecimal(record.overtimeHours)} overtime
          </p>
        </div>
      ),
      align: "center",
    },
    {
      id: "gross",
      header: "Gross",
      accessorFn: (record) => record.grossPay,
      cell: (record) => formatCurrency(record.grossPay),
      align: "center",
    },
    {
      id: "taxes",
      header: "Taxes",
      accessorFn: (record) => record.taxWithholding,
      cell: (record) => formatCurrency(record.taxWithholding),
      align: "center",
    },
    {
      id: "deductions",
      header: "Deductions",
      accessorFn: (record) => record.deductions,
      cell: (record) => formatCurrency(record.deductions),
      align: "center",
    },
    {
      id: "bonus",
      header: "Bonus",
      accessorFn: (record) => record.bonus,
      cell: (record) => (record.bonus > 0 ? formatCurrency(record.bonus) : "--"),
      align: "center",
    },
    {
      id: "net",
      header: "Net Pay",
      accessorFn: (record) => record.netPay,
      cell: (record) => <span className="font-medium">{formatCurrency(record.netPay)}</span>,
      align: "center",
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (record) => record.status,
      cell: (record) => (
        <Badge variant={getStatusVariant(record.status)}>
          {statusLabels[record.status]}
        </Badge>
      ),
      align: "center",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: () => (
        <div className="flex justify-center gap-2">
          <HRActionButton
            size="sm"
            variant="outline"
            feedbackTitle="Payroll adjustment opened"
            feedbackDescription="Adjustment review is active for this payroll row."
          >
            Adjust
          </HRActionButton>
          <HRActionButton
            size="sm"
            variant="outline"
            feedbackTitle="Audit trail opened"
            feedbackDescription="Attendance, tax, deduction, and approval notes are available for this row."
          >
            Audit
          </HRActionButton>
        </div>
      ),
      align: "center",
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Payroll Run</h2>
        <p className="text-sm text-muted-foreground">
          Attendance-based payroll calculations with taxes, deductions, bonuses, adjustments, and audit notes.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={records}
        getRowKey={(record) => record.id}
        emptyMessage="No payroll rows match these filters."
        searchPlaceholder="Search payroll..."
        exportFileName="hr-payroll-run.csv"
        features={{
          sorting: true,
          globalFilter: true,
          pagination: true,
          columnVisibility: true,
          export: true,
          rowSelection: true,
        }}
      />
    </Card>
  );
}
