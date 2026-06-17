"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { HRAttendanceRecord, HRAttendanceStatus } from "@/components/hr/hr-data";

const statusLabels: Record<HRAttendanceStatus, string> = {
  clocked_in: "Clocked In",
  completed: "Completed",
  late: "Late",
  missed: "Missed",
  on_leave: "On Leave",
};

function getStatusVariant(status: HRAttendanceStatus) {
  if (status === "late" || status === "missed") return "destructive";
  if (status === "clocked_in") return "default";
  return "secondary";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(new Date(`${value}T00:00:00`));
}

export function AttendanceTable({
  records,
}: {
  records: HRAttendanceRecord[];
}) {
  const [selectedRecord, setSelectedRecord] = useState<HRAttendanceRecord | null>(null);
  const columns: DataTableColumn<HRAttendanceRecord>[] = [
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
    },
    {
      id: "date",
      header: "Date",
      accessorFn: (record) => record.date,
      cell: (record) => formatDate(record.date),
    },
    {
      id: "punches",
      header: "Punches",
      accessorFn: (record) => `${record.clockIn ?? ""} ${record.clockOut ?? ""}`,
      cell: (record) => (
        <div>
          <p>{record.clockIn ?? "--"} to {record.clockOut ?? "Active"}</p>
          <p className="text-xs text-muted-foreground">
            {record.hoursWorked.toFixed(1)}h worked
          </p>
        </div>
      ),
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
      id: "overtime",
      header: "Overtime",
      accessorFn: (record) => record.overtimeHours,
      cell: (record) =>
        record.overtimeHours > 0 ? `${record.overtimeHours.toFixed(1)}h` : "--",
      align: "center",
    },
    {
      id: "gps",
      header: "GPS Location",
      accessorFn: (record) => record.gpsLocation,
      cell: (record) => (
        <div className="inline-flex max-w-44 items-center gap-1 text-sm">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="truncate">{record.gpsLocation}</span>
        </div>
      ),
      align: "center",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: (record) => (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedRecord(record)}
          >
            Review
          </Button>
        </div>
      ),
      align: "center",
    },
  ];

  return (
    <>
      <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
        <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
          <h2 className="font-semibold">Attendance Records</h2>
          <p className="text-sm text-muted-foreground">
            Clock in/out history, GPS capture, hours worked, overtime, and exception status.
          </p>
        </div>
        <DataTable
          columns={columns}
          data={records}
          getRowKey={(record) => record.id}
          emptyMessage="No attendance records match these filters."
          searchPlaceholder="Search attendance..."
          exportFileName="hr-attendance.csv"
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

      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Attendance Review</DialogTitle>
            <DialogDescription>
              Review punch details, GPS location, hours, overtime, and exception notes.
            </DialogDescription>
          </DialogHeader>
          {selectedRecord ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border/70 bg-background p-3">
                  <p className="text-xs text-muted-foreground">Employee</p>
                  <p className="font-medium">{selectedRecord.employeeName}</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-background p-3">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant={getStatusVariant(selectedRecord.status)}>
                    {statusLabels[selectedRecord.status]}
                  </Badge>
                </div>
                <div className="rounded-lg border border-border/70 bg-background p-3">
                  <p className="text-xs text-muted-foreground">Punches</p>
                  <p className="font-medium">
                    {selectedRecord.clockIn ?? "--"} to {selectedRecord.clockOut ?? "Active"}
                  </p>
                </div>
                <div className="rounded-lg border border-border/70 bg-background p-3">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedRecord.gpsLocation}</p>
                </div>
              </div>
              <Textarea
                defaultValue={
                  selectedRecord.notes ?? "No exception notes recorded for this attendance row."
                }
                className="min-h-24"
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
