import type { AdminEmployeeRole } from "@/types";

export const teamRoleLabels: Record<AdminEmployeeRole, string> = {
  admin: "Admin",
  manager: "Manager",
  dispatcher: "Dispatcher",
  technician: "Technician",
  hr_officer: "HR Officer",
  fleet_manager: "Fleet Manager",
  accountant: "Accountant",
};
