"use client";

import { useMemo, useState } from "react";
import { Bell, Download } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";
import { getFleetData, type FleetGpsStatus } from "@/components/fleet/fleet-data";
import { TrackingControls } from "@/components/fleet/tracking/tracking-controls";
import { TrackingMapPanel } from "@/components/fleet/tracking/tracking-map-panel";
import { TrackingRefreshPanel } from "@/components/fleet/tracking/tracking-refresh-panel";
import { TrackingSummaryCards } from "@/components/fleet/tracking/tracking-summary-cards";
import { VehicleLocationTable } from "@/components/fleet/tracking/vehicle-location-table";

const data = getFleetData();

export default function FleetTrackingPage() {
  const [vehicleId, setVehicleId] = useState("all");
  const [gpsStatus, setGpsStatus] = useState<"all" | FleetGpsStatus>("all");

  const filteredVehicles = useMemo(() => {
    return data.vehicles.filter((vehicle) => {
      const matchesVehicle = vehicleId === "all" || vehicle.id === vehicleId;
      const matchesStatus =
        gpsStatus === "all" || vehicle.gpsStatus === gpsStatus;
      return matchesVehicle && matchesStatus;
    });
  }, [gpsStatus, vehicleId]);

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="GPS Tracking"
        description="Live vehicle locations, speed, direction, driver assignment, current job context, refresh state, and offline alerts."
        actions={
          <>
            <FleetActionButton
              variant="outline"
              feedbackTitle="Tracking export prepared"
              feedbackDescription="Filtered GPS tracking records are ready to export."
            >
              <Download className="mr-2 h-4 w-4" />
              Export GPS
            </FleetActionButton>
            <FleetActionButton
              feedbackTitle="Offline alert rule saved"
              feedbackDescription="Mock alert rule will notify dispatch when a GPS device goes offline."
            >
              <Bell className="mr-2 h-4 w-4" />
              Alert Rule
            </FleetActionButton>
          </>
        }
      />

      <TrackingSummaryCards vehicles={filteredVehicles} />
      <TrackingControls
        vehicles={data.vehicles}
        vehicleId={vehicleId}
        setVehicleId={setVehicleId}
        gpsStatus={gpsStatus}
        setGpsStatus={setGpsStatus}
      />
      <TrackingMapPanel vehicles={filteredVehicles} />
      <div className="grid gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
        <VehicleLocationTable
          vehicles={filteredVehicles}
          drivers={data.drivers}
        />
        <TrackingRefreshPanel vehicles={filteredVehicles} />
      </div>
    </div>
  );
}
