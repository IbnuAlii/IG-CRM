"use client";

import { EmployeeProfilePanel } from "@/components/hr/employees/employee-profile-panel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { HREmployeeRecord } from "@/components/hr/hr-data";

export function EmployeeProfileDialog({
  employee,
  open,
  onOpenChange,
}: {
  employee?: HREmployeeRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Employee Profile</DialogTitle>
          <DialogDescription>
            HR profile, permissions, documents, emergency contact, and attendance snapshot.
          </DialogDescription>
        </DialogHeader>
        <EmployeeProfilePanel employee={employee} />
      </DialogContent>
    </Dialog>
  );
}
