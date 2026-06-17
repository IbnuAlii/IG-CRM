"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";
import { getFleetData, type FleetRouteHistory } from "@/components/fleet/fleet-data";
import { RouteHistoryControls } from "@/components/fleet/routes/route-history-controls";
import { RouteHistorySummaryCards } from "@/components/fleet/routes/route-history-summary-cards";
import { RouteHistoryTable } from "@/components/fleet/routes/route-history-table";
import { RoutePlaybackMap } from "@/components/fleet/routes/route-playback-map";

const data = getFleetData();

export default function FleetRoutesPage() {
  const [vehicleId, setVehicleId] = useState("all");
  const [date, setDate] = useState("all");
  const [selectedRoute, setSelectedRoute] = useState<FleetRouteHistory>(
    data.routeHistories[0],
  );

  const filteredRoutes = useMemo(() => {
    return data.routeHistories.filter((route) => {
      const matchesVehicle = vehicleId === "all" || route.vehicleId === vehicleId;
      const matchesDate = date === "all" || route.date === date;
      return matchesVehicle && matchesDate;
    });
  }, [date, vehicleId]);

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Route History"
        description="Historical GPS playback with stops, timestamps, mileage, duration, speed, behavior events, and route export."
        actions={
          <FleetActionButton
            variant="outline"
            feedbackTitle="Route history export prepared"
            feedbackDescription="Filtered historical routes are ready to export."
          >
            <Download className="mr-2 h-4 w-4" />
            Export Routes
          </FleetActionButton>
        }
      />

      <RouteHistorySummaryCards routes={filteredRoutes} />
      <RouteHistoryControls
        vehicles={data.vehicles}
        vehicleId={vehicleId}
        setVehicleId={setVehicleId}
        date={date}
        setDate={setDate}
      />
      <div className="grid gap-6 2xl:grid-cols-[0.9fr_1.1fr]">
        <RoutePlaybackMap route={selectedRoute} />
        <RouteHistoryTable
          routes={filteredRoutes}
          onSelectRoute={setSelectedRoute}
        />
      </div>
    </div>
  );
}
