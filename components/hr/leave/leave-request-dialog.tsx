"use client";

import { Send } from "lucide-react";
import { HRActionButton } from "@/components/hr/action-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { HREmployeeRecord } from "@/components/hr/hr-data";

export function LeaveRequestDialog({
  employees,
  open,
  onOpenChange,
}: {
  employees: HREmployeeRecord[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit Leave Request</DialogTitle>
          <DialogDescription>
            Mock request form with balance check, manager notification, and calendar block states.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Employee</Label>
            <Select defaultValue={employees[0]?.id}>
              <SelectTrigger>
                <SelectValue placeholder="Employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Leave type</Label>
            <Select defaultValue="vacation">
              <SelectTrigger>
                <SelectValue placeholder="Leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="sick">Sick</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="leave-start">Start date</Label>
            <Input id="leave-start" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leave-end">End date</Label>
            <Input id="leave-end" type="date" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="leave-reason">Reason</Label>
            <Textarea id="leave-reason" placeholder="Add notes for manager review" />
          </div>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-emerald-200">
          Balance check mock: available hours are sufficient. Manager notification will be queued after submission.
        </div>

        <DialogFooter>
          <HRActionButton
            onClick={() => onOpenChange(false)}
            feedbackTitle="Leave request submitted"
            feedbackDescription="Balance check passed and manager notification was queued."
          >
            <Send className="mr-2 h-4 w-4" />
            Submit Request
          </HRActionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
