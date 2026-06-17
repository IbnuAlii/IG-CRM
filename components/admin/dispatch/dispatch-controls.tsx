"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AdminEmployee } from "@/types";

export function DispatchControls({
  technicians,
  technicianFilter,
  setTechnicianFilter,
  view,
  setView,
}: {
  technicians: AdminEmployee[];
  technicianFilter: string;
  setTechnicianFilter: (value: string) => void;
  view: string;
  setView: (value: string) => void;
}) {
  return (
    <Card className="border-border/70 bg-card p-4 shadow-sm md:p-5">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center lg:gap-4">
        <Select value={technicianFilter} onValueChange={setTechnicianFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter technician" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All technicians</SelectItem>
            {technicians.map((technician) => (
              <SelectItem key={technician.id} value={technician.id}>
                {technician.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" onClick={() => setTechnicianFilter("all")}>
          Reset filters
        </Button>
      </div>
    </Card>
  );
}
