"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, LucideIcon } from "lucide-react";

interface SubmitButtonProps extends React.ComponentProps<typeof Button> {
  isPending?: boolean;
  pendingLabel?: string;
  loader?: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  showIcon?: boolean;
}

export function SubmitButton({
  isPending = false,
  disabled,
  className,
  children,
  pendingLabel = "Submitting...",
  loader,
  icon: Icon,
  iconPosition = "left",
  showIcon = true,
  ...props
}: SubmitButtonProps) {
  const isDisabled = disabled || isPending;

  return (
    <Button
      type="submit"
      disabled={isDisabled}
      aria-busy={isPending}
      className={cn("w-full py-6", className)}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {isPending ? (
          <>
            {loader || (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            <span>{pendingLabel}</span>
          </>
        ) : (
          <>
            {showIcon && Icon && iconPosition === "left" && (
              <Icon className="h-4 w-4" aria-hidden="true" />
            )}
            <span>{children}</span>
            {showIcon && Icon && iconPosition === "right" && (
              <Icon className="h-4 w-4" aria-hidden="true" />
            )}
          </>
        )}
      </span>
    </Button>
  );
}
