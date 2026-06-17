"use client";

export function DashboardSignalBar({
  label,
  value,
  color,
  caption,
}: {
  label: string;
  value: number;
  color: string;
  caption: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">{caption}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
