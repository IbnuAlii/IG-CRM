"use client";

import { AlertTriangle, BadgeCheck, BellRing, GraduationCap } from "lucide-react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import type { HRCertificationRecord, HRTrainingRecord } from "@/components/hr/hr-data";

export function TrainingSummaryCards({
  trainingRecords,
  certifications,
}: {
  trainingRecords: HRTrainingRecord[];
  certifications: HRCertificationRecord[];
}) {
  const completed = trainingRecords.filter((record) => record.status === "completed").length;
  const overdue = trainingRecords.filter((record) => record.status === "overdue").length;
  const certificationAlerts = certifications.filter((certification) =>
    ["expiring", "expired", "missing"].includes(certification.status),
  ).length;
  const reminders = certifications.filter(
    (certification) => certification.reminderStatus !== "none",
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Training Records"
        value={trainingRecords.length}
        description="Assigned learning items"
        trend={`${completed} completed`}
        icon={GraduationCap}
        tone="blue"
      />
      <AdminStatCard
        label="Overdue"
        value={overdue}
        description="Needs HR follow-up"
        trend="Blocks compliance completion"
        icon={AlertTriangle}
        tone={overdue > 0 ? "red" : "green"}
      />
      <AdminStatCard
        label="Certification Alerts"
        value={certificationAlerts}
        description="Expiring, expired, or missing"
        trend="Linked to job eligibility"
        icon={BadgeCheck}
        tone={certificationAlerts > 0 ? "amber" : "green"}
      />
      <AdminStatCard
        label="Reminders"
        value={reminders}
        description="Queued or sent notices"
        trend="Mock notification state"
        icon={BellRing}
        tone={reminders > 0 ? "amber" : "neutral"}
      />
    </div>
  );
}
