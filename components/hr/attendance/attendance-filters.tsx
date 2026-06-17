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
import type { HREmployeeRecord } from "@/components/hr/hr-data";

export function AttendanceFilters({
  employees,
  employeeId,
  setEmployeeId,
  status,
  setStatus,
}: {
  employees: HREmployeeRecord[];
  employeeId: string;
  setEmployeeId: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
}) {
  return (
    <Card className="border-border/70 bg-card p-4 shadow-sm md:p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto] md:items-center">
        <Select value={employeeId} onValueChange={setEmployeeId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Employee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All employees</SelectItem>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name}
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
            <SelectItem value="clocked_in">Clocked In</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="late">Late</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            setEmployeeId("all");
            setStatus("all");
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Reset filters
        </Button>
      </div>
    </Card>
  );
}
