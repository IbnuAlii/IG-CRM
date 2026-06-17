"use client";

import { useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";
import { getFleetData } from "@/components/fleet/fleet-data";
import { AddMaintenanceDialog } from "@/components/fleet/maintenance/add-maintenance-dialog";
import { MaintenanceFilters } from "@/components/fleet/maintenance/maintenance-filters";
import { MaintenanceLogTable } from "@/components/fleet/maintenance/maintenance-log-table";
import { MaintenanceSummaryCards } from "@/components/fleet/maintenance/maintenance-summary-cards";
import { ServiceReminderPanel } from "@/components/fleet/maintenance/service-reminder-panel";
import { Button } from "@/components/ui/button";

const data = getFleetData();

export default function FleetMaintenancePage() {
  const [vehicleId, setVehicleId] = useState("all");
  const [type, setType] = useState("all");
  const [logOpen, setLogOpen] = useState(false);

  const filteredLogs = useMemo(() => {
    return data.maintenanceLogs.filter((log) => {
      const matchesVehicle = vehicleId === "all" || log.vehicleId === vehicleId;
      const matchesType = type === "all" || log.type === type;
      return matchesVehicle && matchesType;
    });
  }, [type, vehicleId]);

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Maintenance"
        description="Log service activities, track vendors and costs, attach receipts, monitor upcoming service, and send maintenance reminders."
        actions={
          <>
            <FleetActionButton
              variant="outline"
              feedbackTitle="Maintenance export prepared"
              feedbackDescription="Use the maintenance table export for filtered service records."
            >
              <Download className="mr-2 h-4 w-4" />
              Export Logs
            </FleetActionButton>
            <Button onClick={() => setLogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Log Maintenance
            </Button>
          </>
        }
      />

      <MaintenanceSummaryCards
        logs={filteredLogs}
        vehicles={data.vehicles}
      />
      <MaintenanceFilters
        vehicles={data.vehicles}
        vehicleId={vehicleId}
        setVehicleId={setVehicleId}
        type={type}
        setType={setType}
      />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
        <MaintenanceLogTable logs={filteredLogs} />
        <ServiceReminderPanel vehicles={data.vehicles} />
      </div>

      <AddMaintenanceDialog
        vehicles={data.vehicles}
        open={logOpen}
        onOpenChange={setLogOpen}
      />
    </div>
  );
}
