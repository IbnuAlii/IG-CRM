"use client";

import { CheckCircle2, ClipboardCheck, Download, MessageSquare, XCircle } from "lucide-react";
import { useState } from "react";
import { ManagerActionButton } from "@/components/manager/manager-action-button";
import { getManagerData } from "@/components/manager/manager-data";
import { ManagerPageHeader } from "@/components/manager/manager-page-header";
import { ManagerStatCard } from "@/components/manager/manager-stat-card";
import { ManagerStatusBadge } from "@/components/manager/manager-status-badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function ManagerApprovalsPage() {
  const { approvals } = getManagerData();
  const [approvalStatuses, setApprovalStatuses] = useState<Record<string, "pending" | "approved" | "rejected">>(
    Object.fromEntries(approvals.map((approval) => [approval.id, approval.status])),
  );
  const pending = approvals.filter((approval) => approvalStatuses[approval.id] === "pending");
  const approved = approvals.filter((approval) => approvalStatuses[approval.id] === "approved");
  const rejected = approvals.filter((approval) => approvalStatuses[approval.id] === "rejected");

  return (
    <div className="space-y-8 py-6">
      <ManagerPageHeader
        badge="Approval workflow"
        title="Approvals"
        description="Approve or reject leave, schedule changes, quote exceptions, and expense decisions with manager comments."
        actions={
          <ManagerActionButton variant="outline" feedbackTitle="Approval log export prepared">
            <Download className="mr-2 h-4 w-4" />
            Export Log
          </ManagerActionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ManagerStatCard icon={ClipboardCheck} label="Pending review" value={pending.length} detail="Manager decisions needed" tone="amber" />
        <ManagerStatCard icon={CheckCircle2} label="Approved" value={approved.length} detail="Accepted requests" tone="green" />
        <ManagerStatCard icon={XCircle} label="Rejected" value={rejected.length} detail="Declined requests" tone="red" />
        <ManagerStatCard icon={MessageSquare} label="Comment required" value={pending.length} detail="Before final action" tone="blue" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden border-border bg-card shadow-sm">
          <div className="border-b border-border p-6">
            <h2 className="text-xl font-semibold text-foreground">Decision Queue</h2>
            <p className="mt-1 text-sm text-muted-foreground">Requests routed to the department manager.</p>
          </div>
          <div className="divide-y divide-border">
            {approvals.map((approval) => (
              <div key={approval.id} className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">{approval.title}</p>
                      <ManagerStatusBadge status={approvalStatuses[approval.id]} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{approval.id} / {approval.requester} / {approval.submittedAt}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{approval.impact}</p>
                  </div>
                  <div className="flex gap-2">
                    <ManagerActionButton
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      feedbackTitle="Approval accepted"
                      onClick={() => setApprovalStatuses((current) => ({ ...current, [approval.id]: "approved" }))}
                    >
                      Approve
                    </ManagerActionButton>
                    <ManagerActionButton
                      size="sm"
                      variant="outline"
                      feedbackTitle="Approval rejected"
                      onClick={() => setApprovalStatuses((current) => ({ ...current, [approval.id]: "rejected" }))}
                    >
                      Reject
                    </ManagerActionButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Manager Comment</h2>
          <p className="mt-1 text-sm text-muted-foreground">Document the reason for approval, rejection, or follow-up before saving.</p>
          <Textarea className="mt-5 min-h-36" placeholder="Add decision notes, coverage requirements, or conditions..." />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <ManagerActionButton variant="outline" feedbackTitle="Comment saved">Save Comment</ManagerActionButton>
            <ManagerActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle="Decision submitted">Submit Decision</ManagerActionButton>
          </div>
          <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            Manager approvals update the related leave, schedule, quote, or expense workflow and keep an audit trail for reports.
          </div>
        </Card>
      </div>
    </div>
  );
}
