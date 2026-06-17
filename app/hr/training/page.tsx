"use client";

import { useMemo, useState } from "react";
import { BellRing, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  buildHRCertificationRecords,
  buildHREmployeeRecords,
  buildHRJobEligibilityRecords,
  buildHRTrainingRecords,
} from "@/components/hr/hr-data";
import { AssignTrainingDialog } from "@/components/hr/training/assign-training-dialog";
import { CertificationTable } from "@/components/hr/training/certification-table";
import { JobEligibilityPanel } from "@/components/hr/training/job-eligibility-panel";
import { ReminderPanel } from "@/components/hr/training/reminder-panel";
import { TrainingFilters } from "@/components/hr/training/training-filters";
import { TrainingRecordTable } from "@/components/hr/training/training-record-table";
import { TrainingSummaryCards } from "@/components/hr/training/training-summary-cards";
import { Button } from "@/components/ui/button";
import { HRActionButton } from "@/components/hr/action-button";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();
const employees = buildHREmployeeRecords(data.employees);
const trainingRecords = buildHRTrainingRecords(employees);
const certifications = buildHRCertificationRecords(employees);
const eligibilityRecords = buildHRJobEligibilityRecords(employees, certifications);

export default function HRTrainingPage() {
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [assignOpen, setAssignOpen] = useState(false);

  const filteredTrainingRecords = useMemo(() => {
    return trainingRecords.filter((record) => {
      const matchesCategory = category === "all" || record.category === category;
      const matchesStatus = status === "all" || record.status === status;
      return matchesCategory && matchesStatus;
    });
  }, [category, status]);

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Training"
        description="Track employee training records, certification expirations, renewal reminders, and job eligibility requirements."
        actions={
          <>
            <HRActionButton
              variant="outline"
              feedbackTitle="Training reminders sent"
              feedbackDescription="All pending training and certification reminders were queued."
            >
              <BellRing className="mr-2 h-4 w-4" />
              Send Reminders
            </HRActionButton>
            <Button onClick={() => setAssignOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Assign Training
            </Button>
          </>
        }
      />

      <TrainingSummaryCards
        trainingRecords={filteredTrainingRecords}
        certifications={certifications}
      />
      <TrainingFilters
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
      />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
        <TrainingRecordTable records={filteredTrainingRecords} />
        <ReminderPanel
          trainingRecords={filteredTrainingRecords}
          certifications={certifications}
        />
      </div>

      <CertificationTable certifications={certifications} />
      <JobEligibilityPanel records={eligibilityRecords} />

      <AssignTrainingDialog
        employees={employees}
        open={assignOpen}
        onOpenChange={setAssignOpen}
      />
    </div>
  );
}
