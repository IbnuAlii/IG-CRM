"use client";

import { Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ReportFilters() {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Report Filters</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Select defaultValue="this-week">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This week</SelectItem>
            <SelectItem value="this-month">This month</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all-status">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">All statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="open">Open</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all-techs">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-techs">All technicians</SelectItem>
            <SelectItem value="ethan">Ethan Brooks</SelectItem>
            <SelectItem value="nora">Nora Kim</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
