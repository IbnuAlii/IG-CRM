"use client";

import Link from "next/link";
import { MapPin, Route } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AdminEmployee, AdminJob } from "@/types";
import {
  getTechnicianAvailabilityLabel,
  getTechnicianJobs,
  getTechnicianUtilization,
} from "./technician-utils";

export function TechnicianDirectory({
  technicians,
  jobs,
}: {
  technicians: AdminEmployee[];
  jobs: AdminJob[];
}) {
  const columns: DataTableColumn<AdminEmployee>[] = [
    {
      id: "technician",
      header: "Technician",
      accessorFn: (technician) =>
        `${technician.name} ${technician.email} ${technician.phone}`,
      cell: (technician) => (
        <div>
          <p className="font-medium">{technician.name}</p>
          <p className="text-xs text-muted-foreground">{technician.email}</p>
        </div>
      ),
      exportValue: (technician) =>
        `${technician.name} (${technician.email})`,
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (technician) => technician.status,
      cell: (technician) => <AdminStatusBadge status={technician.status} />,
      align: "center",
    },
    {
      id: "availability",
      header: "Availability",
      accessorFn: (technician) => getTechnicianAvailabilityLabel(technician),
      cell: (technician) => (
        <div className="text-center">
          <p className="font-medium">
            {getTechnicianAvailabilityLabel(technician)}
          </p>
          <p className="text-xs text-muted-foreground">
            {technician.scheduledHours}/{technician.capacityHours}h
          </p>
        </div>
      ),
      align: "center",
    },
    {
      id: "location",
      header: "Location",
      accessorFn: (technician) => technician.currentLocation,
      cell: (technician) => (
        <div className="flex items-center justify-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{technician.currentLocation ?? "Unknown"}</span>
        </div>
      ),
      align: "center",
    },
    {
      id: "skills",
      header: "Skills",
      accessorFn: (technician) => technician.skills.join(" "),
      cell: (technician) => (
        <div className="flex flex-wrap justify-center gap-1">
          {technician.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="font-normal">
              {skill}
            </Badge>
          ))}
        </div>
      ),
      align: "center",
    },
    {
      id: "utilization",
      header: "Utilization",
      accessorFn: (technician) => getTechnicianUtilization(technician),
      cell: (technician) => {
        const utilization = getTechnicianUtilization(technician);

        return (
          <div className="min-w-36">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span>{utilization}%</span>
              <span className="text-muted-foreground">
                {getTechnicianJobs(technician, jobs).length} jobs
              </span>
            </div>
            <Progress value={utilization} />
          </div>
        );
      },
      align: "center",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: (technician) => (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dispatcher/schedule">Schedule</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dispatcher/routes">
              <Route className="mr-1 h-3.5 w-3.5" />
              Route
            </Link>
          </Button>
        </div>
      ),
      align: "center",
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Technician Directory</h2>
        <p className="text-sm text-muted-foreground">
          Search by name, email, phone, skill, location, availability, and status.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={technicians}
        getRowKey={(technician) => technician.id}
        emptyMessage="No technicians match these filters."
        features={{
          sorting: true,
          globalFilter: true,
          pagination: true,
          columnVisibility: true,
          export: true,
          rowSelection: true,
        }}
        searchPlaceholder="Search technicians..."
        exportFileName="dispatcher-technicians.csv"
      />
    </Card>
  );
}
