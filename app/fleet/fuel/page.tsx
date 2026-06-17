"use client";

import { useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";
import { getFleetData } from "@/components/fleet/fleet-data";
import { AddFuelDialog } from "@/components/fleet/fuel/add-fuel-dialog";
import { FuelEfficiencyPanel } from "@/components/fleet/fuel/fuel-efficiency-panel";
import { FuelFilters } from "@/components/fleet/fuel/fuel-filters";
import { FuelLogTable } from "@/components/fleet/fuel/fuel-log-table";
import { FuelSummaryCards } from "@/components/fleet/fuel/fuel-summary-cards";
import { Button } from "@/components/ui/button";

const data = getFleetData();

export default function FleetFuelPage() {
  const [vehicleId, setVehicleId] = useState("all");
  const [fuelOpen, setFuelOpen] = useState(false);

  const filteredLogs = useMemo(() => {
    return data.fuelLogs.filter((log) => {
      return vehicleId === "all" || log.vehicleId === vehicleId;
    });
  }, [vehicleId]);

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Fuel"
        description="Track fuel purchases, gallons, cost, vendor, odometer readings, MPG, and fuel cost reporting."
        actions={
          <>
            <FleetActionButton
              variant="outline"
              feedbackTitle="Fuel export prepared"
              feedbackDescription="Use the fuel table export for filtered purchase records."
            >
              <Download className="mr-2 h-4 w-4" />
              Export Fuel
            </FleetActionButton>
            <Button onClick={() => setFuelOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Log Fuel
            </Button>
          </>
        }
      />

      <FuelSummaryCards logs={filteredLogs} vehicles={data.vehicles} />
      <FuelFilters
        vehicles={data.vehicles}
        vehicleId={vehicleId}
        setVehicleId={setVehicleId}
      />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
        <FuelLogTable logs={filteredLogs} />
        <FuelEfficiencyPanel vehicles={data.vehicles} />
      </div>

      <AddFuelDialog
        vehicles={data.vehicles}
        open={fuelOpen}
        onOpenChange={setFuelOpen}
      />
    </div>
  );
}
