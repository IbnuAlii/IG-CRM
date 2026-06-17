"use client";

import { CalendarCheck, ClipboardCheck, Clock, XCircle } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { HRLeaveBalance, HRLeaveRequest } from "@/components/hr/hr-data";

export function LeaveSummaryCards({
  requests,
  balances,
}: {
  requests: HRLeaveRequest[];
  balances: HRLeaveBalance[];
}) {
  const pending = requests.filter((request) => request.status === "pending").length;
  const approvedHours = requests
    .filter((request) => request.status === "approved")
    .reduce((total, request) => total + request.requestedHours, 0);
  const availableHours = balances.reduce(
    (total, balance) =>
      total + balance.vacationHours + balance.sickHours + balance.personalHours,
    0,
  );
  const rejected = requests.filter((request) => request.status === "rejected").length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Pending Requests"
        value={pending}
        description="Awaiting manager decision"
        trend="Approval comments supported"
        icon={ClipboardCheck}
        tone={pending > 0 ? "amber" : "green"}
      />
      <AdminStatCard
        label="Approved Hours"
        value={approvedHours}
        description="Scheduled leave blocks"
        trend="Blocks employee calendars"
        icon={CalendarCheck}
        tone="green"
      />
      <AdminStatCard
        label="Available Balance"
        value={`${availableHours}h`}
        description="Vacation, sick, personal"
        trend="Checked before submission"
        icon={Clock}
        tone="blue"
      />
      <AdminStatCard
        label="Rejected"
        value={rejected}
        description="Requests denied or conflicted"
        trend="Coverage reasons retained"
        icon={XCircle}
        tone={rejected > 0 ? "red" : "neutral"}
      />
    </div>
  );
}
