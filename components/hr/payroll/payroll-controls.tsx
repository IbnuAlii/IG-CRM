"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HRPayrollPeriod, HRPayrollStatus } from "@/components/hr/hr-data";

const statusLabels: Record<HRPayrollStatus, string> = {
  draft: "Draft",
  review: "In Review",
  approved: "Approved",
  paid: "Paid",
};

export function PayrollControls({
  periods,
  periodId,
  setPeriodId,
  status,
  setStatus,
}: {
  periods: HRPayrollPeriod[];
  periodId: string;
  setPeriodId: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
}) {
  return (
    <Card className="border-border/70 bg-card p-4 shadow-sm md:p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.5fr_1fr_auto] md:items-center">
        <Select value={periodId} onValueChange={setPeriodId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pay period" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((period) => (
              <SelectItem key={period.id} value={period.id}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            setPeriodId(periods[0]?.id ?? "");
            setStatus("all");
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </Card>
  );
}
