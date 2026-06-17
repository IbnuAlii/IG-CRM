"use client";

import type * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type FleetActionButtonProps = React.ComponentProps<typeof Button> & {
  feedbackTitle: string;
  feedbackDescription?: string;
};

export function FleetActionButton({
  feedbackTitle,
  feedbackDescription,
  onClick,
  children,
  ...props
}: FleetActionButtonProps) {
  const { toast } = useToast();

  return (
    <Button
      {...props}
      onClick={(event) => {
        onClick?.(event);
        toast({
          title: feedbackTitle,
          description: feedbackDescription ?? "Mock fleet action completed.",
        });
      }}
    >
      {children}
    </Button>
  );
}
