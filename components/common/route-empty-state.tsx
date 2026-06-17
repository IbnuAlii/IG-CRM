"use client";

import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

interface RouteEmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export function RouteEmptyState({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
}: RouteEmptyStateProps) {
  return (
    <Empty className="border border-dashed border-border bg-card/50">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      </EmptyHeader>
      {actionLabel && onAction ? (
        <Button onClick={onAction}>{actionLabel}</Button>
      ) : null}
    </Empty>
  );
}
