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
import type { HREmployeeRecord } from "@/components/hr/hr-data";

export function AssignTrainingDialog({
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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Assign Training</DialogTitle>
          <DialogDescription>
            Mock workflow for assigning a course and scheduling completion reminders.
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
            <Label>Category</Label>
            <Select defaultValue="Safety">
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Safety">Safety</SelectItem>
                <SelectItem value="Compliance">Compliance</SelectItem>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Leadership">Leadership</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="training-course">Course name</Label>
            <Input id="training-course" placeholder="Fall protection refresher" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="training-due">Due date</Label>
            <Input id="training-due" type="date" />
          </div>
          <div className="space-y-2">
            <Label>Reminder</Label>
            <Select defaultValue="7">
              <SelectTrigger>
                <SelectValue placeholder="Reminder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 days before</SelectItem>
                <SelectItem value="7">7 days before</SelectItem>
                <SelectItem value="14">14 days before</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <HRActionButton
            onClick={() => onOpenChange(false)}
            feedbackTitle="Training assigned"
            feedbackDescription="The course assignment and reminder schedule were created in the mock workflow."
          >
            <Send className="mr-2 h-4 w-4" />
            Assign Course
          </HRActionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
