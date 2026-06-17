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

export function VehicleFilters({
  status,
  setStatus,
  gpsStatus,
  setGpsStatus,
}: {
  status: string;
  setStatus: (value: string) => void;
  gpsStatus: string;
  setGpsStatus: (value: string) => void;
}) {
  return (
    <Card className="border-border/70 bg-card p-4 shadow-sm md:p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto] md:items-center">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Vehicle status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All vehicle statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="in_maintenance">In Maintenance</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
          </SelectContent>
        </Select>

        <Select value={gpsStatus} onValueChange={setGpsStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="GPS status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All GPS statuses</SelectItem>
            <SelectItem value="moving">Moving</SelectItem>
            <SelectItem value="idle">Idle</SelectItem>
            <SelectItem value="parked">Parked</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            setStatus("all");
            setGpsStatus("all");
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Reset filters
        </Button>
      </div>
    </Card>
  );
}
