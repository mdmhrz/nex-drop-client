"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface ResendOtpButtonProps {
  onResend: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  countdownSeconds?: number;
}

export function ResendOtpButton({
  onResend,
  disabled = false,
  isLoading = false,
  countdownSeconds = 60,
}: ResendOtpButtonProps) {
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [isCooldown, setIsCooldown] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCooldown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownSeconds]);

  const handleClick = () => {
    if (!isCooldown && !disabled && !isLoading) {
      onResend();
      setCountdown(countdownSeconds);
      setIsCooldown(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleClick}
      disabled={isCooldown || disabled || isLoading}
      className="text-sm text-muted-foreground hover:text-foreground"
    >
      <RefreshCw className="h-4 w-4 mr-2" />
      {isCooldown ? `Resend in ${formatTime(countdown)}` : "Resend OTP"}
    </Button>
  );
}
