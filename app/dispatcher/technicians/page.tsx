"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, Route } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TechnicianCapacityBoard } from "@/components/dispatcher/technicians/technician-capacity-board";
import { TechnicianDirectory } from "@/components/dispatcher/technicians/technician-directory";
import { TechnicianFilters } from "@/components/dispatcher/technicians/technician-filters";
import { TechnicianSummaryCards } from "@/components/dispatcher/technicians/technician-summary-cards";
import { Button } from "@/components/ui/button";
import { generateAdminDashboardData } from "@/lib/mock-data";

const data = generateAdminDashboardData();

export default function DispatcherTechniciansPage() {
  const [status, setStatus] = useState("all");
  const [skill, setSkill] = useState("all");

  const technicians = data.employees.filter(
    (employee) => employee.role === "technician",
  );

  const skills = useMemo(
    () =>
      Array.from(
        new Set(technicians.flatMap((technician) => technician.skills)),
      ).sort(),
    [technicians],
  );

  const filteredTechnicians = useMemo(() => {
    return technicians.filter((technician) => {
      const matchesStatus = status === "all" || technician.status === status;
      const matchesSkill = skill === "all" || technician.skills.includes(skill);
      return matchesStatus && matchesSkill;
    });
  }, [skill, status, technicians]);

  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <AdminPageHeader
        title="Technicians"
        description="Monitor technician availability, skill coverage, workload, location, and assignment readiness for dispatch decisions."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/dispatcher/routes">
                <Route className="mr-2 h-4 w-4" />
                Optimize Routes
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dispatcher/schedule">
                <CalendarClock className="mr-2 h-4 w-4" />
                Open Schedule
              </Link>
            </Button>
          </>
        }
      />

      <TechnicianSummaryCards
        technicians={technicians}
        jobs={data.jobs}
        visibleCount={filteredTechnicians.length}
      />
      <TechnicianFilters
        status={status}
        setStatus={setStatus}
        skill={skill}
        setSkill={setSkill}
        skills={skills}
      />
      <TechnicianCapacityBoard
        technicians={filteredTechnicians}
        jobs={data.jobs}
      />
      <TechnicianDirectory
        technicians={filteredTechnicians}
        jobs={data.jobs}
      />
    </div>
  );
}
