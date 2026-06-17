"use client";

import { UserPlus } from "lucide-react";
import { teamRoleLabels } from "@/components/admin/team/team-role-labels";
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

export function AddEmployeeDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Employee Profile</DialogTitle>
          <DialogDescription>
            Mock HR onboarding form for personal, employment, role, document, and emergency contact details.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="employee-name">Full name</Label>
            <Input id="employee-name" placeholder="Avery Collins" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee-email">Email</Label>
            <Input id="employee-email" type="email" placeholder="avery@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee-phone">Phone</Label>
            <Input id="employee-phone" placeholder="+1 212 555 0100" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee-start">Start date</Label>
            <Input id="employee-start" type="date" />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select defaultValue="technician">
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(teamRoleLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Employment type</Label>
            <Select defaultValue="full_time">
              <SelectTrigger>
                <SelectValue placeholder="Employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full_time">Full time</SelectItem>
                <SelectItem value="part_time">Part time</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee-manager">Manager</Label>
            <Input id="employee-manager" placeholder="Sofia Bennett" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee-location">Work location</Label>
            <Input id="employee-location" placeholder="Main office" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="employee-emergency">Emergency contact</Label>
            <Input id="employee-emergency" placeholder="Name, relationship, phone" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="employee-documents">Document checklist</Label>
            <Textarea
              id="employee-documents"
              placeholder="Government ID, signed contract, certifications, policy acknowledgement"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <HRActionButton
            variant="outline"
            onClick={() => onOpenChange(false)}
            feedbackTitle="Employee draft saved"
            feedbackDescription="The onboarding draft was saved in the mock frontend."
          >
            Save Draft
          </HRActionButton>
          <HRActionButton
            onClick={() => onOpenChange(false)}
            feedbackTitle="Employee profile created"
            feedbackDescription="Welcome email and account setup were queued in the mock workflow."
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Create Employee
          </HRActionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
