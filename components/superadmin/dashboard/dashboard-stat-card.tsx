'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type StatTone = 'blue' | 'green' | 'amber' | 'red' | 'neutral';

const toneClasses: Record<
  StatTone,
  {
    card: string;
    icon: string;
    dot: string;
    divider: string;
    trend: string;
  }
> = {
  blue: {
    card: 'border-blue-200 bg-blue-50/30 shadow-blue-100/60 dark:border-blue-900 dark:bg-blue-950/10',
    icon: 'bg-blue-100 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900',
    dot: 'bg-blue-600',
    divider: 'border-blue-100 dark:border-blue-900/70',
    trend: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
  },
  green: {
    card: 'border-green-200 bg-green-50/30 shadow-green-100/60 dark:border-green-900 dark:bg-green-950/10',
    icon: 'bg-green-100 text-green-700 ring-green-200 dark:bg-green-950/40 dark:text-green-300 dark:ring-green-900',
    dot: 'bg-green-600',
    divider: 'border-green-100 dark:border-green-900/70',
    trend: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900',
  },
  amber: {
    card: 'border-amber-200 bg-amber-50/30 shadow-amber-100/60 dark:border-amber-900 dark:bg-amber-950/10',
    icon: 'bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900',
    dot: 'bg-amber-600',
    divider: 'border-amber-100 dark:border-amber-900/70',
    trend: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
  },
  red: {
    card: 'border-red-200 bg-red-50/30 shadow-red-100/60 dark:border-red-900 dark:bg-red-950/10',
    icon: 'bg-red-100 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900',
    dot: 'bg-red-600',
    divider: 'border-red-100 dark:border-red-900/70',
    trend: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900',
  },
  neutral: {
    card: 'border-border/80 bg-card shadow-muted/40',
    icon: 'bg-muted text-muted-foreground ring-border',
    dot: 'bg-muted-foreground',
    divider: 'border-border/70',
    trend: 'bg-muted text-muted-foreground border-border',
  },
};

interface DashboardStatCardProps {
  label: string;
  value: string | number;
  description: string;
  trend: string;
  icon: LucideIcon;
  tone?: StatTone;
  presentation?: 'simple' | 'tinted';
}

export function DashboardStatCard({
  label,
  value,
  description,
  trend,
  icon: Icon,
  tone = 'neutral',
  presentation = 'simple',
}: DashboardStatCardProps) {
  const toneClass = toneClasses[tone];

  if (presentation === 'tinted') {
    return (
      <Card className={cn('min-w-0 overflow-hidden p-5 shadow-sm transition-shadow hover:shadow-md', toneClass.card)}>
        <div className="flex items-start gap-4">
          <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 shadow-sm sm:h-12 sm:w-12', toneClass.icon)}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <p className="break-words text-sm font-semibold leading-5 text-muted-foreground">{label}</p>
            <p className="mt-2 break-words text-3xl font-semibold leading-tight tracking-tight text-foreground">{value}</p>
          </div>
        </div>

        <div className={cn('mt-6 border-t pt-4', toneClass.divider)}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <span className={cn('h-2 w-2 shrink-0 rounded-full', toneClass.dot)} />
              <p className="text-xs leading-5 text-muted-foreground">{description}</p>
            </div>
            <span className={cn('w-fit rounded-md border px-2.5 py-1 text-xs font-medium leading-5', toneClass.trend)}>
              {trend}
            </span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="min-w-0 overflow-hidden border-border/70 bg-card p-5 shadow-sm transition-shadow hover:border-primary/25 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium leading-5 text-muted-foreground">{label}</p>
          <p className="break-words pt-3 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ring-1', toneClass.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <p className="text-xs leading-5 text-muted-foreground">{description}</p>
        <p className={cn('break-words text-xs font-medium leading-5', toneClass.dot.replace('bg-', 'text-'))}>{trend}</p>
      </div>
    </Card>
  );
}
