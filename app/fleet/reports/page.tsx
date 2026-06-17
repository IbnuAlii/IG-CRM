"use client";

import { Download, FileSpreadsheet } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";
import { getFleetData } from "@/components/fleet/fleet-data";
import { BehaviorReportPanel } from "@/components/fleet/reports/behavior-report-panel";
import { ComplianceReportTable } from "@/components/fleet/reports/compliance-report-table";
import { CostReportTable } from "@/components/fleet/reports/cost-report-table";
import { ReportBuilderPanel } from "@/components/fleet/reports/report-builder-panel";
import { ReportSummaryCards } from "@/components/fleet/reports/report-summary-cards";

const data = getFleetData();

export default function FleetReportsPage() {
  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Fleet Reports"
        description="Generate vehicle cost, fuel, maintenance, utilization, document compliance, driver behavior, route history, and geo-fence reports."
        actions={
          <>
            <FleetActionButton
              variant="outline"
              feedbackTitle="Report schedule saved"
              feedbackDescription="Mock weekly fleet report schedule is ready for backend wiring."
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Schedule
            </FleetActionButton>
            <FleetActionButton
              feedbackTitle="Fleet report export prepared"
              feedbackDescription="Full report package is ready to export."
            >
              <Download className="mr-2 h-4 w-4" />
              Export All
            </FleetActionButton>
          </>
        }
      />

      <ReportSummaryCards
        vehicles={data.vehicles}
        fuelLogs={data.fuelLogs}
        maintenanceLogs={data.maintenanceLogs}
        routes={data.routeHistories}
      />

      <div className="grid gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
        <ReportBuilderPanel />
        <BehaviorReportPanel
          routes={data.routeHistories}
          geofenceEvents={data.geofenceEvents}
        />
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
        <CostReportTable
          vehicles={data.vehicles}
          fuelLogs={data.fuelLogs}
          maintenanceLogs={data.maintenanceLogs}
        />
        <ComplianceReportTable vehicles={data.vehicles} />
      </div>
    </div>
  );
}
