"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RouteErrorPanelProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function RouteErrorPanel({
  title = "Something went wrong",
  message = "We could not load this page. Please try again.",
  onRetry,
}: RouteErrorPanelProps) {
  return (
    <Card className="flex flex-col items-center gap-4 border-dashed p-10 text-center">
      <AlertCircle className="h-10 w-10 text-destructive" aria-hidden />
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      ) : null}
    </Card>
  );
}
