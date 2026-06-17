"use client";

import { BadgeCheck, BriefcaseBusiness, IdCard, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { FleetDriver } from "@/components/fleet/fleet-data";

export function DriverSummaryCards({
  drivers,
}: {
  drivers: FleetDriver[];
}) {
  const active = drivers.filter((driver) => driver.status === "active").length;
  const assigned = drivers.filter((driver) => driver.assignedVehicleId).length;
  const onJobs = drivers.filter((driver) => driver.currentJob).length;

  const cards = [
    { label: "Drivers", value: drivers.length, icon: Users },
    { label: "Active", value: active, icon: BadgeCheck },
    { label: "Assigned", value: assigned, icon: IdCard },
    { label: "On Jobs", value: onJobs, icon: BriefcaseBusiness },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.label} className="border-border/70 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="mt-1 text-2xl font-semibold">{card.value}</p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
