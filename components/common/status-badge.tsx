import { Badge } from "@/components/ui/badge";

type AlertLevel = "normal" | "warning" | "critical" | "emergency";
type LifecycleStatus = "active" | "inactive" | "decommissioned";
export type StatusBadgeStatus = AlertLevel | LifecycleStatus;

const statusStyles: Record<string, string> = {
  normal: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  critical: "bg-red-100 text-red-800 border-red-200",
  emergency: "bg-red-900 text-red-50 border-red-800",
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-slate-100 text-slate-800 border-slate-200",
  decommissioned: "bg-gray-100 text-gray-800 border-gray-300",
};

interface StatusBadgeProps {
  status: StatusBadgeStatus;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const displayLabel =
    label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Badge
      variant="outline"
      className={statusStyles[status] ?? statusStyles.normal}
    >
      {/* <div className={`w-2 h-2 rounded-full mr-2 ${
        status === 'normal' ? 'bg-green-600' :
        status === 'warning' ? 'bg-yellow-600' :
        status === 'critical' ? 'bg-red-600' :
        'bg-red-900'
      }`} /> */}
      {displayLabel}
    </Badge>
  );
}
