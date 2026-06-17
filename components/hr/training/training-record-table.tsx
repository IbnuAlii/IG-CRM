"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HRActionButton } from "@/components/hr/action-button";
import type { HRTrainingRecord, HRTrainingStatus } from "@/components/hr/hr-data";
import { formatDate, titleCase } from "./training-formatters";

function getStatusVariant(status: HRTrainingStatus) {
  if (status === "overdue") return "destructive";
  if (status === "completed") return "secondary";
  if (status === "in_progress") return "default";
  return "outline";
}

export function TrainingRecordTable({
  records,
}: {
  records: HRTrainingRecord[];
}) {
  const columns: DataTableColumn<HRTrainingRecord>[] = [
    {
      id: "employee",
      header: "Employee",
      accessorFn: (record) => `${record.employeeName} ${record.department}`,
      cell: (record) => (
        <div>
          <p className="font-medium">{record.employeeName}</p>
          <p className="text-xs text-muted-foreground">{record.department}</p>
        </div>
      ),
    },
    {
      id: "course",
      header: "Course",
      accessorFn: (record) => `${record.courseName} ${record.category}`,
      cell: (record) => (
        <div>
          <p className="font-medium">{record.courseName}</p>
          <p className="text-xs text-muted-foreground">{record.category}</p>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (record) => record.status,
      cell: (record) => (
        <Badge variant={getStatusVariant(record.status)}>
          {titleCase(record.status)}
        </Badge>
      ),
      align: "center",
    },
    {
      id: "due",
      header: "Due",
      accessorFn: (record) => record.dueAt,
      cell: (record) => formatDate(record.dueAt),
      align: "center",
    },
    {
      id: "completed",
      header: "Completed",
      accessorFn: (record) => record.completedAt ?? "",
      cell: (record) => (
        <div>
          <p>{formatDate(record.completedAt)}</p>
          {record.score ? (
            <p className="text-xs text-muted-foreground">{record.score}% score</p>
          ) : null}
        </div>
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
            feedbackTitle="Training record update opened"
            feedbackDescription="Completion status and score can be reviewed in this mock workflow."
          >
            Update
          </HRActionButton>
          <HRActionButton
            size="sm"
            variant="outline"
            feedbackTitle="Training reminder queued"
            feedbackDescription="The employee training reminder was queued."
          >
            Reminder
          </HRActionButton>
        </div>
      ),
      align: "center",
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Training Records</h2>
        <p className="text-sm text-muted-foreground">
          Track assigned courses, completion status, scores, due dates, and reminder actions.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={records}
        getRowKey={(record) => record.id}
        emptyMessage="No training records match these filters."
        searchPlaceholder="Search training..."
        exportFileName="hr-training-records.csv"
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
