"use client";

import type * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type CustomerActionButtonProps = React.ComponentProps<typeof Button> & {
  feedbackTitle: string;
  feedbackDescription?: string;
};

export function CustomerActionButton({
  feedbackTitle,
  feedbackDescription,
  onClick,
  children,
  ...props
}: CustomerActionButtonProps) {
  const { toast } = useToast();

  return (
    <Button
      {...props}
      onClick={(event) => {
        onClick?.(event);
        toast({
          title: feedbackTitle,
          description:
            feedbackDescription ?? "Customer portal action completed.",
        });
      }}
    >
      {children}
    </Button>
  );
}
