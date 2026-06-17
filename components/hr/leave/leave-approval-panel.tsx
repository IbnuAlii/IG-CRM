"use client";

import { MessageSquareText, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { HRLeaveRequest } from "@/components/hr/hr-data";

export function LeaveApprovalPanel({
  requests,
  onDecision,
}: {
  requests: HRLeaveRequest[];
  onDecision: (requestId: string, status: "approved" | "rejected") => void;
}) {
  const pendingRequests = requests.filter((request) => request.status === "pending");

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Approval Workflow</h2>
          <p className="text-sm text-muted-foreground">
            Manager review comments and employee notification state.
          </p>
        </div>
        <MessageSquareText className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-4">
        {pendingRequests.map((request) => (
          <div
            key={request.id}
            className="rounded-lg border border-border/70 bg-background p-3"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">{request.employeeName}</p>
                <p className="text-xs text-muted-foreground">{request.reason}</p>
              </div>
              <Badge>{request.requestedHours}h</Badge>
            </div>
            <Textarea
              className="min-h-20"
              placeholder="Add approval or rejection comment..."
              defaultValue={request.comments}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => onDecision(request.id, "approved")}>
                <Send className="mr-2 h-4 w-4" />
                Approve & Notify
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDecision(request.id, "rejected")}
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
        {pendingRequests.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/70 p-4 text-center text-sm text-muted-foreground">
            No pending leave approvals.
          </div>
        ) : null}
      </div>
    </Card>
  );
}
