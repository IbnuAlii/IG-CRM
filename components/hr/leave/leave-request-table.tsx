"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { HRLeaveRequest, HRLeaveStatus, HRLeaveType } from "@/components/hr/hr-data";

const typeLabels: Record<HRLeaveType, string> = {
  vacation: "Vacation",
  sick: "Sick",
  personal: "Personal",
};

const statusLabels: Record<HRLeaveStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

function getStatusVariant(status: HRLeaveStatus) {
  if (status === "rejected") return "destructive";
  if (status === "approved") return "secondary";
  return "default";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function LeaveRequestTable({
  requests,
  onDecision,
}: {
  requests: HRLeaveRequest[];
  onDecision: (requestId: string, status: HRLeaveStatus) => void;
}) {
  const columns: DataTableColumn<HRLeaveRequest>[] = [
    {
      id: "employee",
      header: "Employee",
      accessorFn: (request) => `${request.employeeName} ${request.department}`,
      cell: (request) => (
        <div>
          <p className="font-medium">{request.employeeName}</p>
          <p className="text-xs text-muted-foreground">{request.department}</p>
        </div>
      ),
    },
    {
      id: "type",
      header: "Type",
      accessorFn: (request) => request.type,
      cell: (request) => typeLabels[request.type],
    },
    {
      id: "dates",
      header: "Dates",
      accessorFn: (request) => `${request.startDate} ${request.endDate}`,
      cell: (request) => (
        <div>
          <p>
            {formatDate(request.startDate)} to {formatDate(request.endDate)}
          </p>
          <p className="text-xs text-muted-foreground">
            {request.requestedHours} requested hours
          </p>
        </div>
      ),
    },
    {
      id: "balance",
      header: "Balance Check",
      accessorFn: (request) => request.balanceBeforeHours,
      cell: (request) => (
        <Badge
          variant={
            request.balanceBeforeHours >= request.requestedHours
              ? "secondary"
              : "destructive"
          }
        >
          {request.balanceBeforeHours}h available
        </Badge>
      ),
      align: "center",
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (request) => request.status,
      cell: (request) => (
        <Badge variant={getStatusVariant(request.status)}>
          {statusLabels[request.status]}
        </Badge>
      ),
      align: "center",
    },
    {
      id: "manager",
      header: "Manager",
      accessorFn: (request) => request.managerName,
      cell: (request) => request.managerName,
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: (request) => (
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant={request.status === "pending" ? "default" : "outline"}
            onClick={() => onDecision(request.id, "approved")}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDecision(request.id, "rejected")}
          >
            Reject
          </Button>
        </div>
      ),
      align: "center",
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Leave Requests</h2>
        <p className="text-sm text-muted-foreground">
          Review submissions, balance checks, manager approval status, comments, and calendar blocking.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={requests}
        getRowKey={(request) => request.id}
        emptyMessage="No leave requests match these filters."
        searchPlaceholder="Search leave..."
        exportFileName="hr-leave-requests.csv"
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
