"use client";

import { useState } from "react";
import { Download, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FleetActionButton } from "@/components/fleet/fleet-action-button";
import { getFleetData } from "@/components/fleet/fleet-data";
import { AddGeofenceDialog } from "@/components/fleet/geofences/add-geofence-dialog";
import { GeofenceEventTable } from "@/components/fleet/geofences/geofence-event-table";
import { GeofenceMapPanel } from "@/components/fleet/geofences/geofence-map-panel";
import { GeofenceSummaryCards } from "@/components/fleet/geofences/geofence-summary-cards";
import { GeofenceTable } from "@/components/fleet/geofences/geofence-table";
import { Button } from "@/components/ui/button";

const data = getFleetData();

export default function FleetGeofencesPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Geo-fences"
        description="Create and monitor circular or polygonal alert zones around customers, jobs, yards, and priority service areas."
        actions={
          <>
            <FleetActionButton
              variant="outline"
              feedbackTitle="Geo-fence export prepared"
              feedbackDescription="Geo-fence definitions and events are ready to export."
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </FleetActionButton>
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Geo-fence
            </Button>
          </>
        }
      />

      <GeofenceSummaryCards
        geofences={data.geofences}
        events={data.geofenceEvents}
      />
      <GeofenceMapPanel
        geofences={data.geofences}
        vehicles={data.vehicles}
      />
      <div className="grid gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
        <GeofenceTable geofences={data.geofences} />
        <GeofenceEventTable events={data.geofenceEvents} />
      </div>
      <AddGeofenceDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
