"use client";

import type * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type HRActionButtonProps = React.ComponentProps<typeof Button> & {
  feedbackTitle: string;
  feedbackDescription?: string;
};

export function HRActionButton({
  feedbackTitle,
  feedbackDescription,
  onClick,
  children,
  ...props
}: HRActionButtonProps) {
  const { toast } = useToast();

  return (
    <Button
      {...props}
      onClick={(event) => {
        onClick?.(event);
        toast({
          title: feedbackTitle,
          description: feedbackDescription ?? "Mock action completed in the frontend.",
        });
      }}
    >
      {children}
    </Button>
  );
}
