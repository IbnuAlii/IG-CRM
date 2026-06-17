"use client";

import type * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type AccountantActionButtonProps = React.ComponentProps<typeof Button> & {
  feedbackTitle: string;
  feedbackDescription?: string;
};

export function AccountantActionButton({
  feedbackTitle,
  feedbackDescription,
  onClick,
  children,
  ...props
}: AccountantActionButtonProps) {
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
            "Accounting workflow updated.",
        });
      }}
    >
      {children}
    </Button>
  );
}
