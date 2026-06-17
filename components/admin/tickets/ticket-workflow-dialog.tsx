"use client";

import type { AdminTicket } from "@/types";
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

interface TicketWorkflowDialogProps {
  ticket?: AdminTicket | null;
  open: boolean;
  onClose: () => void;
}

export function TicketWorkflowDialog({
  ticket,
  open,
  onClose,
}: TicketWorkflowDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{ticket ? `Update ${ticket.ticketNumber}` : "Create Ticket"}</DialogTitle>
          <DialogDescription>
            Track complaints, SLA ownership, customer communication, and staff
            assignment from a single support record.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Customer</Label>
              <Select defaultValue={ticket?.customerId ?? "cust_crm_1"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cust_crm_1">Olivia Martin</SelectItem>
                  <SelectItem value="cust_crm_2">Marcus Chen</SelectItem>
                  <SelectItem value="cust_crm_5">Avery Collins</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" defaultValue={ticket?.subject} placeholder="Issue summary" />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select defaultValue={ticket?.priority ?? "medium"}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select defaultValue={ticket?.status ?? "open"}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assigned staff</Label>
              <Select defaultValue={ticket?.assignedTo ?? "Maya Ortiz"}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maya Ortiz">Maya Ortiz</SelectItem>
                  <SelectItem value="Sofia Bennett">Sofia Bennett</SelectItem>
                  <SelectItem value="Ethan Brooks">Ethan Brooks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sla">SLA due</Label>
              <Input id="sla" type="datetime-local" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description / internal note</Label>
            <Textarea
              id="description"
              rows={5}
              placeholder="Customer complaint, troubleshooting steps, attachments, and follow-up notes"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>{ticket ? "Save Update" : "Create Ticket"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
