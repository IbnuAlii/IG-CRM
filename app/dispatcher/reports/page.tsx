"use client";

import { Download, FileText, Route, Timer, Wrench } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateAdminDashboardData } from "@/lib/mock-data";
import type { AdminEmployee } from "@/types";

const data = generateAdminDashboardData();

export default function DispatcherReportsPage() {
  const technicians = data.employees.filter(
    (employee) => employee.role === "technician",
  );
  const completedJobs = data.jobs.filter((job) => job.status === "completed");
  const activeJobs = data.jobs.filter((job) =>
    ["pending", "assigned", "in_progress"].includes(job.status),
  );
  const emergencyJobs = data.jobs.filter((job) => job.priority === "emergency");

  const columns: DataTableColumn<AdminEmployee>[] = [
    {
      id: "technician",
      header: "Technician",
      accessorFn: (technician) => technician.name,
      cell: (technician) => (
        <div>
          <p className="font-medium">{technician.name}</p>
          <p className="text-xs text-muted-foreground">
            {technician.currentLocation}
          </p>
        </div>
      ),
    },
    {
      id: "jobs",
      header: "Jobs",
      accessorFn: (technician) =>
        data.jobs.filter((job) => job.technicianId === technician.id).length,
      cell: (technician) => {
        const assigned = data.jobs.filter(
          (job) => job.technicianId === technician.id,
        ).length;
        return <span>{assigned} assigned</span>;
      },
      align: "center",
    },
    {
      id: "utilization",
      header: "Utilization",
      accessorFn: (technician) =>
        Math.round((technician.scheduledHours / technician.capacityHours) * 100),
      cell: (technician) => (
        <Badge variant="secondary">
          {Math.round((technician.scheduledHours / technician.capacityHours) * 100)}%
        </Badge>
      ),
      align: "center",
    },
    {
      id: "rating",
      header: "Rating",
      accessorFn: (technician) => technician.rating,
      cell: (technician) => technician.rating.toFixed(1),
      align: "center",
    },
  ];

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Dispatch Reports"
        description="Generate operational dispatch reports for job volume, route load, technician utilization, and emergency response."
        actions={
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Active Jobs"
          value={activeJobs.length}
          description="Pending through in progress"
          trend={`${completedJobs.length} completed in mock data`}
          icon={FileText}
          tone="blue"
        />
        <AdminStatCard
          label="Emergency Jobs"
          value={emergencyJobs.length}
          description="Escalation workload"
          trend="Included in response report"
          icon={Timer}
          tone="red"
        />
        <AdminStatCard
          label="Technicians"
          value={technicians.length}
          description="Field capacity"
          trend="Utilization export ready"
          icon={Wrench}
          tone="green"
        />
        <AdminStatCard
          label="Route Stops"
          value={data.jobs.filter((job) => job.technicianId).length}
          description="Assigned service stops"
          trend="Route report source"
          icon={Route}
          tone="amber"
        />
      </div>

      <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
        <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
          <h2 className="font-semibold">Technician Utilization Report</h2>
          <p className="text-sm text-muted-foreground">
            Exportable dispatch report covering assigned work, workload, and ratings.
          </p>
        </div>
        <DataTable
          columns={columns}
          data={technicians}
          getRowKey={(technician) => technician.id}
          searchPlaceholder="Search report..."
          exportFileName="dispatcher-report.csv"
          features={{
            sorting: true,
            globalFilter: true,
            pagination: true,
            columnVisibility: true,
            export: true,
          }}
        />
      </Card>
    </div>
  );
}
