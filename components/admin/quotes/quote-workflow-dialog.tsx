"use client";

import type { AdminQuote } from "@/types";
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

interface QuoteWorkflowDialogProps {
  quote: AdminQuote | null;
  mode: "create" | "send" | "convert";
  open?: boolean;
  onClose: () => void;
}

export function QuoteWorkflowDialog({
  quote,
  mode,
  open,
  onClose,
}: QuoteWorkflowDialogProps) {
  const isCreate = mode === "create";
  const title = isCreate
    ? "Create Quote"
    : mode === "convert"
      ? `Convert ${quote?.quoteNumber ?? "Quote"}`
      : `Send ${quote?.quoteNumber ?? "Quote"}`;

  return (
    <Dialog
      open={open ?? (isCreate || !!quote)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "convert"
              ? "Create a schedulable job from an accepted quote and keep the original quote linked."
              : "Build customer-facing pricing with line items, taxes, terms, and delivery tracking."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Customer</Label>
              <Select defaultValue={quote?.customerId ?? "cust_crm_1"}>
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
              <Label htmlFor="service-type">Service type</Label>
              <Input
                id="service-type"
                defaultValue={quote?.serviceType}
                placeholder="Preventive maintenance"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valid-until">Valid until</Label>
              <Input id="valid-until" type="date" />
            </div>
            <div className="space-y-2">
              <Label>Owner</Label>
              <Select defaultValue={quote?.assignedTo ?? "Maya Ortiz"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maya Ortiz">Maya Ortiz</SelectItem>
                  <SelectItem value="Sofia Bennett">Sofia Bennett</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border border-border">
            <div className="grid grid-cols-[1fr_80px_110px] gap-3 border-b border-border bg-muted/30 p-3 text-xs font-medium uppercase text-muted-foreground">
              <span>Description</span>
              <span>Qty</span>
              <span>Unit Price</span>
            </div>
            {(quote?.lineItems ?? [{ id: "new", description: "", quantity: 1, unitPrice: 0, taxable: true }]).map(
              (item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_80px_110px] gap-3 p-3"
                >
                  <Input defaultValue={item.description} placeholder="Line item" />
                  <Input defaultValue={item.quantity} type="number" />
                  <Input defaultValue={item.unitPrice} type="number" />
                </div>
              ),
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Notes and terms</Label>
            <Textarea
              id="terms"
              rows={4}
              placeholder="Payment terms, warranty language, and customer instructions"
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
            {mode === "convert" ? "Create Job" : "Send Quote"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
