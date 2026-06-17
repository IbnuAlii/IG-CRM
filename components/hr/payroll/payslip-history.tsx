"use client";

import { Download, Mail } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HRActionButton } from "@/components/hr/action-button";
import type { HRPayslipRecord } from "@/components/hr/hr-data";
import { formatCurrency, formatDate } from "./payroll-formatters";

export function PayslipHistory({
  payslips,
}: {
  payslips: HRPayslipRecord[];
}) {
  const columns: DataTableColumn<HRPayslipRecord>[] = [
    {
      id: "employee",
      header: "Employee",
      accessorFn: (payslip) => payslip.employeeName,
      cell: (payslip) => (
        <div>
          <p className="font-medium">{payslip.employeeName}</p>
          <p className="text-xs text-muted-foreground">{payslip.periodLabel}</p>
        </div>
      ),
    },
    {
      id: "gross",
      header: "Gross",
      accessorFn: (payslip) => payslip.grossPay,
      cell: (payslip) => formatCurrency(payslip.grossPay),
      align: "center",
    },
    {
      id: "deductions",
      header: "Deductions",
      accessorFn: (payslip) => payslip.deductions,
      cell: (payslip) => formatCurrency(payslip.deductions),
      align: "center",
    },
    {
      id: "net",
      header: "Net Pay",
      accessorFn: (payslip) => payslip.netPay,
      cell: (payslip) => <span className="font-medium">{formatCurrency(payslip.netPay)}</span>,
      align: "center",
    },
    {
      id: "generated",
      header: "Generated",
      accessorFn: (payslip) => payslip.generatedAt,
      cell: (payslip) => formatDate(payslip.generatedAt),
      align: "center",
    },
    {
      id: "delivery",
      header: "Delivery",
      accessorFn: (payslip) => payslip.deliveryStatus,
      cell: (payslip) => (
        <Badge variant={payslip.deliveryStatus === "queued" ? "default" : "secondary"}>
          {payslip.deliveryStatus}
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
            feedbackTitle="Payslip PDF prepared"
            feedbackDescription="The payslip PDF download is mocked for frontend review."
          >
            <Download className="mr-2 h-4 w-4" />
            PDF
          </HRActionButton>
          <HRActionButton
            size="sm"
            variant="outline"
            feedbackTitle="Payslip email queued"
            feedbackDescription="The employee payslip email was queued in the mock workflow."
          >
            <Mail className="mr-2 h-4 w-4" />
            Email
          </HRActionButton>
        </div>
      ),
      align: "center",
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Payslip History</h2>
        <p className="text-sm text-muted-foreground">
          Generated payslips with download and email delivery states.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={payslips}
        getRowKey={(payslip) => payslip.id}
        emptyMessage="No payslips are available for this period."
        searchPlaceholder="Search payslips..."
        exportFileName="hr-payslips.csv"
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
