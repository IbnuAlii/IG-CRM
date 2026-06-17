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
import { teamRoleLabels } from "./team-role-labels";

export function TeamFilters({
  role,
  setRole,
  status,
  setStatus,
}: {
  role: string;
  setRole: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
}) {
  return (
    <Card className="border-border/70 bg-card p-4 shadow-sm md:p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto] md:items-center md:gap-16">
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {Object.entries(teamRoleLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            setRole("all");
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
