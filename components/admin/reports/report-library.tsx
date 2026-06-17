"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminReport } from "@/types";
import {
  formatReportDate,
  reportCategoryColors,
  reportCategoryLabels,
} from "./report-formatters";
import { Card } from "@/components/ui/card";

export function ReportLibrary({ reports }: { reports: AdminReport[] }) {
  const reportColumns: DataTableColumn<AdminReport>[] = [
    {
      id: "report",
      header: "Report",
      accessorFn: (report) => `${report.name} ${report.description}`,
      cell: (report) => (
        <div>
          <p className="font-medium">{report.name}</p>
          <p className="text-xs text-muted-foreground">{report.description}</p>
        </div>
      ),
      exportValue: (report) => `${report.name} - ${report.description}`,
    },
    {
      id: "category",
      header: "Category",
      accessorFn: (report) => reportCategoryLabels[report.category],
      cell: (report) => (
        <Badge
          variant="outline"
          style={{
            borderColor: `${reportCategoryColors[report.category]}55`,
            color: reportCategoryColors[report.category],
          }}
        >
          {reportCategoryLabels[report.category]}
        </Badge>
      ),
      align: "center",
    },
    {
      id: "schedule",
      header: "Schedule",
      accessorFn: (report) => report.schedule,
      cell: (report) =>
        report.schedule.charAt(0).toUpperCase() + report.schedule.slice(1),
      align: "center",
    },
    {
      id: "lastRun",
      header: "Last Run",
      accessorFn: (report) => report.lastRunAt.getTime(),
      cell: (report) => formatReportDate(report.lastRunAt),
      exportValue: (report) => formatReportDate(report.lastRunAt),
      align: "center",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      align: "center",
      cell: () => (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm">
            Run
          </Button>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border/70 bg-muted/20 p-4 md:flex-row md:items-center md:justify-between md:p-6">
        <div>
          <h2 className="text-lg font-semibold">Report Library</h2>
          <p className="text-sm text-muted-foreground">
            Search, run, schedule, and export saved report definitions.
          </p>
        </div>
        <Badge variant="outline" className="w-fit bg-background">
          {reports.length} saved
        </Badge>
      </div>
      <DataTable
        columns={reportColumns}
        data={reports}
        getRowKey={(report) => report.id}
        emptyMessage="No reports found."
        features={{
          sorting: true,
          globalFilter: true,
          pagination: true,
          columnVisibility: true,
          export: true,
        }}
        searchPlaceholder="Search reports..."
        exportFileName="admin-reports.csv"
      />
    </Card>
  );
}
