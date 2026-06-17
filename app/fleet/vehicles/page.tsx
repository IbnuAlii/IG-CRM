"use client";

import { useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";
import { getFleetData, type FleetVehicle } from "@/components/fleet/fleet-data";
import { AddVehicleDialog } from "@/components/fleet/vehicles/add-vehicle-dialog";
import { VehicleDirectory } from "@/components/fleet/vehicles/vehicle-directory";
import { VehicleFilters } from "@/components/fleet/vehicles/vehicle-filters";
import { VehicleProfileDialog } from "@/components/fleet/vehicles/vehicle-profile-dialog";
import { VehicleSummaryCards } from "@/components/fleet/vehicles/vehicle-summary-cards";
import { Button } from "@/components/ui/button";

const data = getFleetData();

export default function FleetVehiclesPage() {
  const [status, setStatus] = useState("all");
  const [gpsStatus, setGpsStatus] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | undefined>(
    data.vehicles[0],
  );

  const filteredVehicles = useMemo(() => {
    return data.vehicles.filter((vehicle) => {
      const matchesStatus = status === "all" || vehicle.status === status;
      const matchesGps = gpsStatus === "all" || vehicle.gpsStatus === gpsStatus;
      return matchesStatus && matchesGps;
    });
  }, [gpsStatus, status]);

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Vehicles"
        description="Maintain vehicle profiles, assignments, GPS state, service schedules, insurance, registration, and document expiration reminders."
        actions={
          <>
            <FleetActionButton
              variant="outline"
              feedbackTitle="Vehicle export prepared"
              feedbackDescription="Use the vehicle table export for filtered fleet records."
            >
              <Download className="mr-2 h-4 w-4" />
              Export Vehicles
            </FleetActionButton>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </>
        }
      />

      <VehicleSummaryCards
        vehicles={data.vehicles}
        visibleCount={filteredVehicles.length}
      />
      <VehicleFilters
        status={status}
        setStatus={setStatus}
        gpsStatus={gpsStatus}
        setGpsStatus={setGpsStatus}
      />

      <VehicleDirectory
        vehicles={filteredVehicles}
        onSelectVehicle={(vehicle) => {
          setSelectedVehicle(vehicle);
          setProfileOpen(true);
        }}
      />

      <AddVehicleDialog open={addOpen} onOpenChange={setAddOpen} />
      <VehicleProfileDialog
        vehicle={selectedVehicle}
        open={profileOpen}
        onOpenChange={setProfileOpen}
      />
    </div>
  );
}
