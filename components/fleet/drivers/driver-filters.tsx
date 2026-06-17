"use client";

import type { Dispatch, SetStateAction } from "react";
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

export function DriverFilters({
  status,
  setStatus,
  assignment,
  setAssignment,
}: {
  status: string;
  setStatus: Dispatch<SetStateAction<string>>;
  assignment: string;
  setAssignment: Dispatch<SetStateAction<string>>;
}) {
  return (
    <Card className="border-border/70 p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <div className="space-y-2">
          <p className="text-sm font-medium">Driver status</p>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Driver status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on_leave">On leave</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Assignment</p>
          <Select value={assignment} onValueChange={setAssignment}>
            <SelectTrigger>
              <SelectValue placeholder="Assignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All drivers</SelectItem>
              <SelectItem value="assigned">Assigned vehicle</SelectItem>
              <SelectItem value="unassigned">Unassigned vehicle</SelectItem>
              <SelectItem value="job">Active job</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setStatus("all");
            setAssignment("all");
          }}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </Card>
  );
}
