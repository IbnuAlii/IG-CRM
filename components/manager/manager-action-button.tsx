"use client";

import type * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ManagerActionButtonProps = React.ComponentProps<typeof Button> & {
  feedbackTitle: string;
  feedbackDescription?: string;
};

export function ManagerActionButton({
  feedbackTitle,
  feedbackDescription,
  onClick,
  children,
  ...props
}: ManagerActionButtonProps) {
  const { toast } = useToast();

  return (
    <Button
      {...props}
      onClick={(event) => {
        onClick?.(event);
        toast({
          title: feedbackTitle,
          description: feedbackDescription ?? "Manager workflow updated for frontend handoff.",
        });
      }}
    >
      {children}
    </Button>
  );
}
