"use client";

import { Navigation, RotateCcw } from "lucide-react";
import type { AdminEmployee } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RouteControls({
  technicians,
  technicianId,
  setTechnicianId,
  priority,
  setPriority,
}: {
  technicians: AdminEmployee[];
  technicianId: string;
  setTechnicianId: (value: string) => void;
  priority: string;
  setPriority: (value: string) => void;
}) {
  return (
    <Card className="border-border/70 bg-card p-4 shadow-sm md:p-5">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-center">
        <Select value={technicianId} onValueChange={setTechnicianId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Technician" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All assigned routes</SelectItem>
            <SelectItem value="unassigned">Unassigned stops</SelectItem>
            {technicians.map((technician) => (
              <SelectItem key={technician.id} value={technician.id}>
                {technician.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Button>
          <Navigation className="mr-2 h-4 w-4" />
          Optimize Route
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            setTechnicianId("all");
            setPriority("all");
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </Card>
  );
}
