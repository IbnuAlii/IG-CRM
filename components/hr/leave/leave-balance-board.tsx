"use client";

import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { HRLeaveBalance } from "@/components/hr/hr-data";

export function LeaveBalanceBoard({
  balances,
}: {
  balances: HRLeaveBalance[];
}) {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Leave Balances</h2>
          <p className="text-sm text-muted-foreground">
            Vacation, sick, personal, and used leave hours per employee.
          </p>
        </div>
        <Clock className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-3">
        {balances.map((balance) => {
          const available =
            balance.vacationHours + balance.sickHours + balance.personalHours;
          const total = available + balance.usedHours;
          const usedPercent = Math.round((balance.usedHours / Math.max(total, 1)) * 100);

          return (
            <div
              key={balance.employeeId}
              className="rounded-lg border border-border/70 bg-background p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="font-medium">{balance.employeeName}</p>
                <p className="text-sm text-muted-foreground">{available}h available</p>
              </div>
              <Progress value={usedPercent} />
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <span>Vacation {balance.vacationHours}h</span>
                <span>Sick {balance.sickHours}h</span>
                <span>Personal {balance.personalHours}h</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
