"use client";

import type * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type TechnicianActionButtonProps = React.ComponentProps<typeof Button> & {
  feedbackTitle: string;
  feedbackDescription?: string;
};

export function TechnicianActionButton({
  feedbackTitle,
  feedbackDescription,
  onClick,
  children,
  ...props
}: TechnicianActionButtonProps) {
  const { toast } = useToast();

  return (
    <Button
      {...props}
      onClick={(event) => {
        onClick?.(event);
        toast({
          title: feedbackTitle,
          description:
            feedbackDescription ??
            "Technician workflow updated.",
        });
      }}
    >
      {children}
    </Button>
  );
}
