"use client";

import { Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DispatchDefaultsSettings() {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Settings className="h-4 w-4 text-primary" />
        <h2 className="font-semibold">Dispatch Defaults</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="workday-start">Workday start</Label>
          <Input id="workday-start" type="time" defaultValue="08:00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="workday-end">Workday end</Label>
          <Input id="workday-end" type="time" defaultValue="17:00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="default-duration">Default job duration</Label>
          <Input id="default-duration" type="number" defaultValue="90" />
        </div>
        <div className="space-y-2">
          <Label>Emergency escalation</Label>
          <Select defaultValue="manager-dispatcher">
            <SelectTrigger>
              <SelectValue placeholder="Escalation rule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manager-dispatcher">
                Manager and dispatcher
              </SelectItem>
              <SelectItem value="manager-only">Manager only</SelectItem>
              <SelectItem value="admin-manager">Admin and manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
