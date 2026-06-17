"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type RouteLoadingVariant = "table" | "detail" | "cards";

interface RouteLoadingSkeletonProps {
  variant?: RouteLoadingVariant;
  className?: string;
}

export function RouteLoadingSkeleton({
  variant = "table",
  className,
}: RouteLoadingSkeletonProps) {
  if (variant === "detail") {
    return (
      <div className={cn("w-full space-y-6 py-4 md:py-6", className)}>
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-3", className)}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-4 py-4 md:py-6", className)}>
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
