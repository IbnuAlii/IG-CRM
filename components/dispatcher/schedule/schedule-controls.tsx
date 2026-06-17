"use client";

import { RotateCcw } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ScheduleView } from "./schedule-utils";

export function ScheduleControls({
  technicians,
  customers,
  serviceTypes,
  technicianFilter,
  setTechnicianFilter,
  status,
  setStatus,
  customer,
  setCustomer,
  serviceType,
  setServiceType,
  view,
  setView,
}: {
  technicians: AdminEmployee[];
  customers: string[];
  serviceTypes: string[];
  technicianFilter: string;
  setTechnicianFilter: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  customer: string;
  setCustomer: (value: string) => void;
  serviceType: string;
  setServiceType: (value: string) => void;
  view: ScheduleView;
  setView: (value: ScheduleView) => void;
}) {
  return (
    <Card className="border-border/70 bg-card p-4 shadow-sm md:p-5">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-4 2xl:grid-cols-[1fr_1fr_1fr_1fr_auto_auto] 2xl:items-center">
        <Select value={technicianFilter} onValueChange={setTechnicianFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Technician" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All technicians</SelectItem>
            <SelectItem value="unassigned">Unassigned jobs</SelectItem>
            {technicians.map((technician) => (
              <SelectItem key={technician.id} value={technician.id}>
                {technician.name}
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
          </SelectContent>
        </Select>

        <Select value={customer} onValueChange={setCustomer}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Customer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All customers</SelectItem>
            {customers.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={serviceType} onValueChange={setServiceType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Job type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All job types</SelectItem>
            {serviceTypes.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Tabs value={view} onValueChange={(value) => setView(value as ScheduleView)}>
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            setTechnicianFilter("all");
            setStatus("all");
            setCustomer("all");
            setServiceType("all");
            setView("day");
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </Card>
  );
}
