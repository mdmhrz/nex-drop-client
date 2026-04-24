"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  error?: string;
  beforeAppend?: React.ReactNode;
  afterAppend?: React.ReactNode;
  containerClassName?: string;
  showPasswordToggle?: boolean;
  field?: ControllerRenderProps<FieldValues, string>;
  defaultLabelUp?: boolean;
}

export function InputField({
  label,
  error,
  beforeAppend,
  afterAppend,
  containerClassName,
  className,
  value,
  type,
  showPasswordToggle = false,
  field,
  defaultLabelUp = false,
  ...props
}: InputFieldProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [hasContent, setHasContent] = React.useState(defaultLabelUp);
  const [isLabelUp, setIsLabelUp] = React.useState(defaultLabelUp);
  const inputId = React.useId();
  const internalRef = React.useRef<HTMLInputElement>(null);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setIsLabelUp(true);
    setHasContent(!!e.target.value);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    const hasValue = !!e.target.value;
    setHasContent(hasValue);
    setIsLabelUp(hasValue);
    field?.onBlur();
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hasValue = !!e.target.value;
    setHasContent(hasValue);
    setIsLabelUp(hasValue);
    field?.onChange(e);
    props.onChange?.(e);
  };

  // Check input value on mount and when props change
  React.useEffect(() => {
    const inputValue = field?.value ?? value ?? props.defaultValue;
    const hasValue = !!inputValue;
    if (hasValue) {
      setTimeout(() => {
        setHasContent(hasValue);
        setIsLabelUp(hasValue);
      }, 0);
    }
  }, [field?.value, value, props.defaultValue]);

  // Check input value from ref after mount (for uncontrolled inputs)
  React.useEffect(() => {
    const checkValue = () => {
      if (internalRef.current) {
        const hasValue = !!internalRef.current.value;
        setHasContent(hasValue);
        setIsLabelUp(hasValue);
      }
    };

    checkValue();

    const inputEl = internalRef.current;
    if (inputEl) {
      inputEl.addEventListener('input', checkValue);
      return () => inputEl.removeEventListener('input', checkValue);
    }
  }, []);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={cn("relative", containerClassName)}>
      <div className="relative">
        {beforeAppend && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {beforeAppend}
          </div>
        )}

        <Input
          id={inputId}
          ref={internalRef}
          type={inputType}
          className={cn(
            "w-full border border-input bg-background px-3 py-6 text-sm",
            "transition-all duration-300 ease-out",
            "placeholder:text-transparent",
            "focus:outline-none ",
            beforeAppend && "pl-10",
            (afterAppend || showPasswordToggle) && "pr-10",
            error && "border-destructive focus:ring-destructive",
            className
          )}
          value={field?.value ?? value}
          {...field}
          {...props}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
        />

        <label
          htmlFor={inputId}
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
            "pointer-events-none transition-all duration-300 ease-out",
            "origin-left",
            beforeAppend && "left-10",
            (isFocused || hasContent) && "-translate-y-9 scale-75",
            isLabelUp && "bg-background px-1 ",
            isLabelUp && "border border-input ",
            isLabelUp && (beforeAppend ? "left-7" : "left-0"),
            error && "text-destructive"
          )}
        >
          {label}
        </label>

        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}

        {afterAppend && !showPasswordToggle && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {afterAppend}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
