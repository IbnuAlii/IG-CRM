"use client";

import { BellRing, MailCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HRActionButton } from "@/components/hr/action-button";
import type { HRCertificationRecord, HRTrainingRecord } from "@/components/hr/hr-data";
import { formatDate, titleCase } from "./training-formatters";

export function ReminderPanel({
  trainingRecords,
  certifications,
}: {
  trainingRecords: HRTrainingRecord[];
  certifications: HRCertificationRecord[];
}) {
  const overdueTraining = trainingRecords.filter((record) => record.status === "overdue");
  const certificationAlerts = certifications.filter((certification) =>
    ["expiring", "expired", "missing"].includes(certification.status),
  );

  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Reminder Queue</h2>
          <p className="text-sm text-muted-foreground">
            Mock notification queue for overdue training and certification renewals.
          </p>
        </div>
        <BellRing className="h-5 w-5 text-primary" />
      </div>

      <div className="space-y-3">
        {overdueTraining.map((record) => (
          <div
            key={record.id}
            className="rounded-lg border border-border/70 bg-background p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">{record.employeeName}</p>
                <p className="text-xs text-muted-foreground">
                  {record.courseName} due {formatDate(record.dueAt)}
                </p>
              </div>
              <Badge variant="destructive">Overdue</Badge>
            </div>
          </div>
        ))}
        {certificationAlerts.map((certification) => (
          <div
            key={certification.id}
            className="rounded-lg border border-border/70 bg-background p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">{certification.employeeName}</p>
                <p className="text-xs text-muted-foreground">
                  {certification.certificationName} - {titleCase(certification.status)}
                </p>
              </div>
              <Badge variant="outline" className="bg-background">
                {titleCase(certification.reminderStatus)}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <HRActionButton
        className="mt-4 w-full"
        feedbackTitle="Pending reminders sent"
        feedbackDescription="Training and certification reminders were queued for delivery."
      >
        <MailCheck className="mr-2 h-4 w-4" />
        Send Pending Reminders
      </HRActionButton>
    </Card>
  );
}
