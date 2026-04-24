"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  className?: string;
}

export function OtpInput({ value = "", onChange, length = 6, className }: OtpInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(newValue)) return;

    // Take only the last character if multiple are pasted
    const char = newValue.slice(-1);

    // Update the value
    const newValueArray = value.split("");
    newValueArray[index] = char;
    const newOtp = newValueArray.join("");
    onChange(newOtp);

    // Move to next input if a character was entered
    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Only allow numbers
    const numericPastedData = pastedData.replace(/\D/g, "").slice(0, length);

    if (numericPastedData) {
      onChange(numericPastedData);

      // Focus the next empty input or the last input
      const nextIndex = Math.min(numericPastedData.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className={cn("flex gap-2 w-full", className)}>
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          className={cn(
            "flex-1 h-12 text-center text-lg font-semibold border-input",
            value[index] && "border-primary"
          )}
        />
      ))}
    </div>
  );
}
