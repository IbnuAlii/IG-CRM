'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Download, SlidersHorizontal } from 'lucide-react';

export type DashboardDateRange = '7d' | '30d' | '90d' | 'ytd';

export type DashboardWidgetKey =
  | 'overview'
  | 'registrations'
  | 'systemHealth'
  | 'revenue'
  | 'planMix'
  | 'tenantOverview'
  | 'alerts';

const dateRangeLabels: Record<DashboardDateRange, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  ytd: 'Year to date',
};

const widgetLabels: Record<DashboardWidgetKey, string> = {
  overview: 'Overview metrics',
  registrations: 'Pending registrations',
  systemHealth: 'System health',
  revenue: 'Revenue trend',
  planMix: 'Tenants by plan',
  tenantOverview: 'Tenant overview',
  alerts: 'Alerts and logs',
};

interface DashboardControlsProps {
  dateRange: DashboardDateRange;
  visibleWidgets: DashboardWidgetKey[];
  onDateRangeChange: (range: DashboardDateRange) => void;
  onWidgetToggle: (widget: DashboardWidgetKey) => void;
  onExport: () => void;
}

export function DashboardControls({
  dateRange,
  visibleWidgets,
  onDateRangeChange,
  onWidgetToggle,
  onExport,
}: DashboardControlsProps) {
  const widgetKeys = Object.keys(widgetLabels) as DashboardWidgetKey[];

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
      <Select value={dateRange} onValueChange={(value) => onDateRangeChange(value as DashboardDateRange)}>
        <SelectTrigger className="w-full sm:w-[170px]" aria-label="Dashboard date range">
          <CalendarDays className="h-4 w-4" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(dateRangeLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Widgets
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Dashboard widgets</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {widgetKeys.map((widget) => (
            <DropdownMenuCheckboxItem
              key={widget}
              checked={visibleWidgets.includes(widget)}
              onCheckedChange={() => onWidgetToggle(widget)}
            >
              {widgetLabels[widget]}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" className="gap-2" onClick={onExport}>
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
}

export { dateRangeLabels, widgetLabels };
