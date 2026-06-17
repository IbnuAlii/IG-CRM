"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LeaveApprovalPanel } from "@/components/hr/leave/leave-approval-panel";
import { LeaveBalanceBoard } from "@/components/hr/leave/leave-balance-board";
import { LeaveFilters } from "@/components/hr/leave/leave-filters";
import { LeaveRequestDialog } from "@/components/hr/leave/leave-request-dialog";
import { LeaveRequestTable } from "@/components/hr/leave/leave-request-table";
import { LeaveSummaryCards } from "@/components/hr/leave/leave-summary-cards";
import {
  buildHREmployeeRecords,
  buildHRLeaveBalances,
  buildHRLeaveRequests,
} from "@/components/hr/hr-data";
import { Button } from "@/components/ui/button";
import { generateAdminDashboardData } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import type { HRLeaveStatus } from "@/components/hr/hr-data";

const data = generateAdminDashboardData();
const employees = buildHREmployeeRecords(data.employees);
const leaveRequests = buildHRLeaveRequests(employees);
const leaveBalances = buildHRLeaveBalances(employees);

export default function HRLeavePage() {
  const { toast } = useToast();
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [requestOpen, setRequestOpen] = useState(false);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, HRLeaveStatus>>({});

  const effectiveLeaveRequests = useMemo(
    () =>
      leaveRequests.map((request) => ({
        ...request,
        status: statusOverrides[request.id] ?? request.status,
      })),
    [statusOverrides],
  );

  const filteredRequests = useMemo(() => {
    return effectiveLeaveRequests.filter((request) => {
      const matchesType = type === "all" || request.type === type;
      const matchesStatus = status === "all" || request.status === status;
      return matchesType && matchesStatus;
    });
  }, [effectiveLeaveRequests, status, type]);

  const handleDecision = (requestId: string, nextStatus: HRLeaveStatus) => {
    const request = effectiveLeaveRequests.find((item) => item.id === requestId);
    setStatusOverrides((current) => ({
      ...current,
      [requestId]: nextStatus,
    }));
    toast({
      title: nextStatus === "approved" ? "Leave approved" : "Leave rejected",
      description: request
        ? `${request.employeeName}'s request was marked ${nextStatus} and notification was queued.`
        : "Leave request status updated.",
    });
  };

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Leave"
        description="Submit leave requests, check balances, review manager approvals, capture comments, notify employees, and block approved dates on schedules."
        actions={
          <Button onClick={() => setRequestOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Leave Request
          </Button>
        }
      />

      <LeaveSummaryCards requests={effectiveLeaveRequests} balances={leaveBalances} />
      <LeaveFilters
        type={type}
        setType={setType}
        status={status}
        setStatus={setStatus}
      />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
        <LeaveRequestTable
          requests={filteredRequests}
          onDecision={handleDecision}
        />
        <LeaveApprovalPanel
          requests={filteredRequests}
          onDecision={handleDecision}
        />
      </div>

      <LeaveBalanceBoard balances={leaveBalances} />

      <LeaveRequestDialog
        employees={employees}
        open={requestOpen}
        onOpenChange={setRequestOpen}
      />
    </div>
  );
}
