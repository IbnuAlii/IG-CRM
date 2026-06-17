"use client";

import { BarChart3, Download, FileSpreadsheet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";

const reportSections = [
  "Fuel cost",
  "Maintenance cost",
  "Vehicle utilization",
  "Document compliance",
  "Driver behavior",
  "Route and geo-fence events",
];

export function ReportBuilderPanel() {
  return (
    <Card className="border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Report Builder</h2>
          <p className="text-sm text-muted-foreground">
            Configure the mock fleet report package for export.
          </p>
        </div>
        <BarChart3 className="h-5 w-5 text-primary" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Report period</Label>
          <Select defaultValue="month">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="quarter">This quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Format</Label>
          <Select defaultValue="csv">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV workbook</SelectItem>
              <SelectItem value="pdf">PDF summary</SelectItem>
              <SelectItem value="xlsx">XLSX export</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {reportSections.map((section) => (
          <label
            key={section}
            className="flex items-center gap-3 rounded-md border border-border/70 bg-muted/20 p-3 text-sm"
          >
            <Checkbox defaultChecked />
            <span>{section}</span>
          </label>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <FleetActionButton
          feedbackTitle="Fleet report generated"
          feedbackDescription="Mock report package includes costs, utilization, compliance, routes, and geo-fence events."
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Generate Report
        </FleetActionButton>
        <FleetActionButton
          variant="outline"
          feedbackTitle="Fleet report export prepared"
          feedbackDescription="Selected report sections are ready to download."
        >
          <Download className="mr-2 h-4 w-4" />
          Export Package
        </FleetActionButton>
      </div>
    </Card>
  );
}
