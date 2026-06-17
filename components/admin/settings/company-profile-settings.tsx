"use client";

import { Building2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

export function CompanyProfileSettings() {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Building2 className="h-4 w-4 text-primary" />
        <h2 className="font-semibold">Company Profile</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company-name">Company name</Label>
          <Input id="company-name" defaultValue="Northstar HVAC Services" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="support-email">Support email</Label>
          <Input id="support-email" defaultValue="support@northstarhvac.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Main phone</Label>
          <Input id="phone" defaultValue="+1 212 555 0100" />
        </div>
        <div className="space-y-2">
          <Label>Timezone</Label>
          <Select defaultValue="america-new-york">
            <SelectTrigger>
              <SelectValue placeholder="Timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="america-new-york">America/New_York</SelectItem>
              <SelectItem value="america-chicago">America/Chicago</SelectItem>
              <SelectItem value="america-los-angeles">
                America/Los_Angeles
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="terms">Default quote terms</Label>
          <Textarea
            id="terms"
            rows={4}
            defaultValue="Quotes are valid until the stated expiration date. Payment is due upon completion unless otherwise agreed."
          />
        </div>
      </div>
    </Card>
  );
}
