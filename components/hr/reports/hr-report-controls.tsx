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

export function HRReportControls({
  reportType,
  setReportType,
  department,
  setDepartment,
  departments,
}: {
  reportType: string;
  setReportType: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
  departments: string[];
}) {
  return (
    <Card className="border-border/70 bg-card p-4 shadow-sm md:p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto] md:items-center">
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Report type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="workforce">Workforce Summary</SelectItem>
            <SelectItem value="attendance">Attendance & Overtime</SelectItem>
            <SelectItem value="leave">Leave Balances</SelectItem>
            <SelectItem value="payroll">Payroll Summary</SelectItem>
            <SelectItem value="compliance">Training Compliance</SelectItem>
          </SelectContent>
        </Select>

        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {departments.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            setReportType("workforce");
            setDepartment("all");
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </Card>
  );
}
