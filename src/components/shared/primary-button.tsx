"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PrimaryButtonProps extends React.ComponentProps<typeof Button> {
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  showIcon?: boolean;
  loading?: boolean;
  loadingLabel?: string;
}

export function PrimaryButton({
  icon: Icon,
  iconPosition = "left",
  showIcon = true,
  loading = false,
  loadingLabel,
  disabled,
  children,
  className,
  ...props
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Button
      disabled={isDisabled}
      aria-busy={loading}
      className={cn(className)}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>{loadingLabel || children}</span>
          </span>
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
