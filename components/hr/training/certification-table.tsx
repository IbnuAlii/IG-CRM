"use client";

import { BellRing } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HRActionButton } from "@/components/hr/action-button";
import type { HRCertificationRecord, HRCertificationStatus } from "@/components/hr/hr-data";
import { formatDate, titleCase } from "./training-formatters";

function getStatusVariant(status: HRCertificationStatus) {
  if (status === "expired" || status === "missing") return "destructive";
  if (status === "expiring") return "default";
  return "secondary";
}

export function CertificationTable({
  certifications,
}: {
  certifications: HRCertificationRecord[];
}) {
  const columns: DataTableColumn<HRCertificationRecord>[] = [
    {
      id: "employee",
      header: "Employee",
      accessorFn: (certification) =>
        `${certification.employeeName} ${certification.department}`,
      cell: (certification) => (
        <div>
          <p className="font-medium">{certification.employeeName}</p>
          <p className="text-xs text-muted-foreground">{certification.department}</p>
        </div>
      ),
    },
    {
      id: "certification",
      header: "Certification",
      accessorFn: (certification) =>
        `${certification.certificationName} ${certification.requiredFor.join(" ")}`,
      cell: (certification) => (
        <div>
          <p className="font-medium">{certification.certificationName}</p>
          <p className="text-xs text-muted-foreground">
            {certification.requiredFor.join(", ")}
          </p>
        </div>
      ),
    },
    {
      id: "expires",
      header: "Expires",
      accessorFn: (certification) => certification.expiresAt ?? "",
      cell: (certification) => formatDate(certification.expiresAt),
      align: "center",
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (certification) => certification.status,
      cell: (certification) => (
        <Badge variant={getStatusVariant(certification.status)}>
          {titleCase(certification.status)}
        </Badge>
      ),
      align: "center",
    },
    {
      id: "reminder",
      header: "Reminder",
      accessorFn: (certification) => certification.reminderStatus,
      cell: (certification) => (
        <Badge variant="outline" className="gap-1 bg-background">
          <BellRing className="h-3.5 w-3.5" />
          {titleCase(certification.reminderStatus)}
        </Badge>
      ),
      align: "center",
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: () => (
        <div className="flex justify-center gap-2">
          <HRActionButton
            size="sm"
            variant="outline"
            feedbackTitle="Certification renewal opened"
            feedbackDescription="Renewal tracking was opened for this certification."
          >
            Renew
          </HRActionButton>
          <HRActionButton
            size="sm"
            variant="outline"
            feedbackTitle="Certification notice queued"
            feedbackDescription="The renewal or missing-certification notice was queued."
          >
            Notify
          </HRActionButton>
        </div>
      ),
      align: "center",
    },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card p-0 shadow-sm">
      <div className="border-b border-border/70 bg-muted/20 p-4 md:p-6">
        <h2 className="font-semibold">Certifications</h2>
        <p className="text-sm text-muted-foreground">
          Manage certification status, expiration dates, renewal reminders, and required-for mappings.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={certifications}
        getRowKey={(certification) => certification.id}
        emptyMessage="No certifications found."
        searchPlaceholder="Search certifications..."
        exportFileName="hr-certifications.csv"
        features={{
          sorting: true,
          globalFilter: true,
          pagination: true,
          columnVisibility: true,
          export: true,
          rowSelection: true,
        }}
      />
    </Card>
  );
}
