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

export function QuoteFilters({
  status,
  setStatus,
}: {
  status: string;
  setStatus: (value: string) => void;
}) {
  return (
    <Card className="border-border/70 bg-card p-4 shadow-sm md:p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-center md:gap-16">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Quote status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All quote statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="viewed">Viewed</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setStatus("all")}
        >
          <RotateCcw className="h-4 w-4" />
          Reset filters
        </Button>
      </div>
    </Card>
  );
}
