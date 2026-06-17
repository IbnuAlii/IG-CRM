"use client";

import Link from "next/link";
import { Plus, Truck } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FleetAlertPanel } from "@/components/fleet/dashboard/fleet-alert-panel";
import { FleetMapPanel } from "@/components/fleet/dashboard/fleet-map-panel";
import { FleetSummaryCards } from "@/components/fleet/dashboard/fleet-summary-cards";
import { getFleetData } from "@/components/fleet/fleet-data";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";
import { Button } from "@/components/ui/button";

const data = getFleetData();

export default function FleetDashboardPage() {
  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Fleet Dashboard"
        description="Manage vehicles, assignments, maintenance readiness, document expirations, and live GPS status from the Fleet Manager console."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/fleet/vehicles">
                <Truck className="mr-2 h-4 w-4" />
                Vehicles
              </Link>
            </Button>
            <FleetActionButton
              feedbackTitle="Vehicle onboarding started"
              feedbackDescription="Open Vehicles to add full profile, documents, and assignment details."
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </FleetActionButton>
          </>
        }
      />

      <FleetSummaryCards vehicles={data.vehicles} fuelLogs={data.fuelLogs} />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
        <FleetMapPanel vehicles={data.vehicles} />
        <FleetAlertPanel
          vehicles={data.vehicles}
          maintenanceLogs={data.maintenanceLogs}
        />
      </div>
    </div>
  );
}
