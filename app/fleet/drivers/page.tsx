"use client";

import { useMemo, useState } from "react";
import { Download, UserPlus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";
import { getFleetData } from "@/components/fleet/fleet-data";
import { DriverDirectory } from "@/components/fleet/drivers/driver-directory";
import { DriverFilters } from "@/components/fleet/drivers/driver-filters";
import { DriverSummaryCards } from "@/components/fleet/drivers/driver-summary-cards";

const data = getFleetData();

export default function FleetDriversPage() {
  const [status, setStatus] = useState("all");
  const [assignment, setAssignment] = useState("all");

  const filteredDrivers = useMemo(() => {
    return data.drivers.filter((driver) => {
      const matchesStatus = status === "all" || driver.status === status;
      const matchesAssignment =
        assignment === "all" ||
        (assignment === "assigned" && !!driver.assignedVehicleId) ||
        (assignment === "unassigned" && !driver.assignedVehicleId) ||
        (assignment === "job" && !!driver.currentJob);
      return matchesStatus && matchesAssignment;
    });
  }, [assignment, status]);

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Drivers"
        description="Manage driver status, license readiness, vehicle assignment, and active job linkage for fleet operations."
        actions={
          <>
            <FleetActionButton
              variant="outline"
              feedbackTitle="Driver export prepared"
              feedbackDescription="Filtered driver assignment records are ready to export."
            >
              <Download className="mr-2 h-4 w-4" />
              Export Drivers
            </FleetActionButton>
            <FleetActionButton
              feedbackTitle="Driver invite prepared"
              feedbackDescription="Mock driver onboarding workflow is ready for backend wiring."
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Driver
            </FleetActionButton>
          </>
        }
      />

      <DriverSummaryCards drivers={filteredDrivers} />
      <DriverFilters
        status={status}
        setStatus={setStatus}
        assignment={assignment}
        setAssignment={setAssignment}
      />
      <DriverDirectory drivers={filteredDrivers} vehicles={data.vehicles} />
    </div>
  );
}
