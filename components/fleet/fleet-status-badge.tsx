"use client";

import { Badge } from "@/components/ui/badge";
import type {
  FleetDocumentStatus,
  FleetGpsStatus,
  FleetVehicleStatus,
} from "@/components/fleet/fleet-data";

export function FleetVehicleStatusBadge({
  status,
}: {
  status: FleetVehicleStatus;
}) {
  const label: Record<FleetVehicleStatus, string> = {
    active: "Active",
    in_maintenance: "In Maintenance",
    retired: "Retired",
  };

  return (
    <Badge
      variant={
        status === "active"
          ? "secondary"
          : status === "in_maintenance"
            ? "default"
            : "outline"
      }
    >
      {label[status]}
    </Badge>
  );
}

export function FleetGpsStatusBadge({ status }: { status: FleetGpsStatus }) {
  const label: Record<FleetGpsStatus, string> = {
    moving: "Moving",
    idle: "Idle",
    parked: "Parked",
    offline: "Offline",
  };

  return (
    <Badge variant={status === "offline" ? "destructive" : "secondary"}>
      {label[status]}
    </Badge>
  );
}

export function FleetDocumentStatusBadge({
  status,
}: {
  status: FleetDocumentStatus;
}) {
  const label: Record<FleetDocumentStatus, string> = {
    valid: "Valid",
    expiring: "Expiring",
    expired: "Expired",
  };

  return (
    <Badge
      variant={
        status === "valid"
          ? "secondary"
          : status === "expiring"
            ? "default"
            : "destructive"
      }
    >
      {label[status]}
    </Badge>
  );
}
