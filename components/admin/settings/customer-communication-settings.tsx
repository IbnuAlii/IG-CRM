"use client";

import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function CustomerCommunicationSettings() {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Bell className="h-4 w-4 text-primary" />
        <h2 className="font-semibold">Customer Communication</h2>
      </div>
      <div className="space-y-4">
        {[
          "Quote sent",
          "Quote accepted",
          "Job scheduled",
          "Technician en route",
          "Ticket updated",
        ].map((event) => (
          <div
            key={event}
            className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-[1fr_auto_auto]"
          >
            <Label className="text-sm">{event}</Label>
            <Label className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked />
              Email
            </Label>
            <Label className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked={event !== "Quote sent"} />
              SMS
            </Label>
          </div>
        ))}
      </div>
    </Card>
  );
}
