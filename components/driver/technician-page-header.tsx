"use client";

import type { ReactNode } from "react";

interface TechnicianPageHeaderProps {
  badge?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function TechnicianPageHeader({
  badge,
  title,
  description,
  actions,
}: TechnicianPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {badge ? (
          <div className="mb-3 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            {badge}
          </div>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-normal text-foreground md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
          {description}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
