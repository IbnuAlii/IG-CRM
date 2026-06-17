"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, Wrench } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { RouteControls } from "@/components/dispatcher/routes/route-controls";
import { RouteMap } from "@/components/dispatcher/routes/route-map";
import { RouteReviewPanel } from "@/components/dispatcher/routes/route-review-panel";
import { RouteStopList } from "@/components/dispatcher/routes/route-stop-list";
import { RouteSummaryCards } from "@/components/dispatcher/routes/route-summary-cards";
import {
  buildRouteStops,
  getRouteJobs,
} from "@/components/dispatcher/routes/route-utils";
import { Button } from "@/components/ui/button";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();

export default function DispatcherRoutesPage() {
  const [technicianId, setTechnicianId] = useState("all");
  const [priority, setPriority] = useState("all");

  const technicians = data.employees.filter(
    (employee) => employee.role === "technician",
  );

  const routeJobs = useMemo(() => {
    return getRouteJobs({ jobs: data.jobs, technicianId }).filter((job) => {
      return priority === "all" || job.priority === priority;
    });
  }, [priority, technicianId]);

  const stops = useMemo(() => buildRouteStops(routeJobs), [routeJobs]);
  const selectedTechnician = technicians.find(
    (technician) => technician.id === technicianId,
  );

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Routes"
        description="Optimize technician routes across assigned jobs, urgent stops, travel time, and manual dispatch review."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/dispatcher/technicians">
                <Wrench className="mr-2 h-4 w-4" />
                Technicians
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dispatcher/schedule">
                <CalendarClock className="mr-2 h-4 w-4" />
                Schedule
              </Link>
            </Button>
          </>
        }
      />

      <RouteControls
        technicians={technicians}
        technicianId={technicianId}
        setTechnicianId={setTechnicianId}
        priority={priority}
        setPriority={setPriority}
      />
      <RouteSummaryCards stops={stops} />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
        <RouteMap stops={stops} technician={selectedTechnician} />
        <RouteReviewPanel stops={stops} technician={selectedTechnician} />
      </div>

      <RouteStopList stops={stops} />
    </div>
  );
}
