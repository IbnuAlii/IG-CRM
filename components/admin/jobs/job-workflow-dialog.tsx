"use client";

import type { AdminJob } from "@/types";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";

interface JobWorkflowDialogProps {
  job: AdminJob | null;
  mode: "create" | "assign";
  open?: boolean;
  onClose: () => void;
}

export function JobWorkflowDialog({
  job,
  mode,
  open,
  onClose,
}: JobWorkflowDialogProps) {
  const isCreate = mode === "create";

  return (
    <Dialog
      open={open ?? (isCreate || !!job)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "assign"
              ? `Assign ${job?.jobNumber ?? "Job"}`
              : "Create Job"}
          </DialogTitle>
          <DialogDescription>
            Schedule service work with customer, priority, technician,
            duration, instructions, and conflict-aware assignment fields.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Customer</Label>
              <Select defaultValue={job?.customerId ?? "cust_crm_1"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cust_crm_1">Olivia Martin</SelectItem>
                  <SelectItem value="cust_crm_2">Marcus Chen</SelectItem>
                  <SelectItem value="cust_crm_3">Priya Shah</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-service">Service type</Label>
              <Input
                id="job-service"
                defaultValue={job?.serviceType}
                placeholder="HVAC repair"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduled-date">Scheduled date</Label>
              <Input id="scheduled-date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduled-time">Scheduled time</Label>
              <Input id="scheduled-time" type="time" />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select defaultValue={job?.priority ?? "normal"}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Technician</Label>
              <Select defaultValue={job?.technicianId ?? "unassigned"}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign technician" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="emp_2">Ethan Brooks</SelectItem>
                  <SelectItem value="emp_3">Nora Kim</SelectItem>
                  <SelectItem value="emp_4">Caleb Reed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Additional technicians</Label>
              <Select defaultValue="none">
                <SelectTrigger>
                  <SelectValue placeholder="Team assignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No additional technician</SelectItem>
                  <SelectItem value="emp_2_emp_3">Ethan Brooks + Nora Kim</SelectItem>
                  <SelectItem value="emp_3_emp_4">Nora Kim + Caleb Reed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Estimated duration</Label>
              <Input
                id="duration"
                type="number"
                defaultValue={job?.estimatedDurationMinutes ?? 90}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Service address</Label>
              <Input id="address" defaultValue={job?.address} />
            </div>
            <div className="space-y-2">
              <Label>Recurrence</Label>
              <Select defaultValue={job?.recurring ? "weekly" : "none"}>
                <SelectTrigger>
                  <SelectValue placeholder="Repeat schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Does not repeat</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="custom">Custom cadence</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dependency</Label>
              <Select defaultValue="none">
                <SelectTrigger>
                  <SelectValue placeholder="Dependency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No dependency</SelectItem>
                  <SelectItem value="job_1">After JOB-2088</SelectItem>
                  <SelectItem value="job_3">After JOB-2090</SelectItem>
                  <SelectItem value="parts">After parts confirmation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-3 rounded-lg border border-border/70 bg-muted/20 p-4 md:grid-cols-3">
            {[
              ["Validate availability", "Check technician capacity and conflicts"],
              ["Notify customer", "Send confirmation or emergency ETA"],
              ["Attach files", "Photos, documents, or signed forms required"],
            ].map(([label, description]) => (
              <label key={label} className="flex items-start gap-3 text-sm">
                <Checkbox defaultChecked={label !== "Attach files"} />
                <span>
                  <span className="block font-medium">{label}</span>
                  <span className="text-xs text-muted-foreground">
                    {description}
                  </span>
                </span>
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              defaultValue={job?.description}
              placeholder="Describe the work to be completed"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructions">Special instructions</Label>
            <Textarea
              id="instructions"
              rows={3}
              defaultValue={job?.specialInstructions}
              placeholder="Access notes, customer preferences, parts, or safety notes"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" onClick={onClose}>
            Save Draft
          </Button>
          <Button onClick={onClose}>
            {mode === "assign" ? "Assign Job" : "Create Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
