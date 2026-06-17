"use client";

import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DispatcherPagePlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  metrics: Array<{
    label: string;
    value: string | number;
    detail: string;
  }>;
  primaryHref?: string;
  primaryLabel?: string;
}

export function DispatcherPagePlaceholder({
  title,
  description,
  icon: Icon,
  metrics,
  primaryHref = "/dispatcher/dashboard",
  primaryLabel = "Open Dashboard",
}: DispatcherPagePlaceholderProps) {
  return (
    <div className="w-full py-4 md:py-6 space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border/70 bg-card p-5 shadow-sm md:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <Badge variant="outline" className="mb-3 gap-1.5 bg-background">
            <Icon className="h-3.5 w-3.5" />
            Dispatch Operations
          </Badge>
          <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        <Button asChild className="w-full sm:w-fit">
          <Link href={primaryHref}>
            {primaryLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card
            key={metric.label}
            className="border-border/70 bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {metric.detail}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
