"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoInputVariants = cva(
  // Base styles
  [
    "flex w-full",
    "bg-neo-input text-neo-text",
    "border-[length:var(--border-neo)] rounded-[var(--radius-neo-xl)]",
    "transition-all duration-200",
    "outline-none",
    "placeholder:text-neo-text-muted/60",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
  ].join(" "),
  {
    variants: {
      variant: {
        // Default - Simple border
        default: [
          "border-neo-border/30",
          "focus:border-neo-border",
          "focus:shadow-[var(--shadow-neo-sm)]",
          "focus:-translate-y-0.5 focus:-translate-x-0.5",
        ].join(" "),
        // Filled - Subtle background
        filled: [
          "bg-neo-bg border-neo-border/20",
          "focus:border-neo-border",
          "focus:shadow-[var(--shadow-neo-sm)]",
          "focus:-translate-y-0.5 focus:-translate-x-0.5",
        ].join(" "),
      },
      inputSize: {
        sm: "h-10 px-3 text-sm",
        md: "h-12 px-4 text-base",
        lg: "h-14 px-5 text-lg",
      },
      error: {
        true: [
          "border-destructive",
          "focus:border-destructive",
          "focus:shadow-[3px_3px_0px_var(--destructive)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  },
);

export type NeoInputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof neoInputVariants> & {
    label?: string;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    error?: boolean;
    errorMessage?: string;
  };

const NeoInput = React.forwardRef<HTMLInputElement, NeoInputProps>(
  (
    {
      className,
      variant,
      inputSize,
      error,
      errorMessage,
      label,
      icon,
      iconPosition = "left",
      type = "text",
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const actualType = isPassword && showPassword ? "text" : type;

    const hasIcon = !!icon;
    const iconPaddingLeft = hasIcon && iconPosition === "left" ? "pl-12" : "";
    const iconPaddingRight =
      (hasIcon && iconPosition === "right") || isPassword ? "pr-12" : "";

    return (
      <div className="w-full">
        {label && (
          <label
            className={cn(
              "mb-2 ml-1 block text-sm font-bold tracking-wider uppercase",
              "text-neo-text",
            )}
          >
            {label}
          </label>
        )}
        <div className="group relative">
          <input
            ref={ref}
            type={actualType}
            data-slot="neo-input"
            className={cn(
              neoInputVariants({ variant, inputSize, error, className }),
              iconPaddingLeft,
              iconPaddingRight,
            )}
            {...props}
          />
          {icon && (
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2",
                "text-neo-text-muted group-focus-within:text-neo-text",
                "transition-colors duration-200",
                "[&_svg]:size-5",
                iconPosition === "left" ? "left-4" : "right-4",
              )}
            >
              {icon}
            </div>
          )}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                "absolute top-1/2 right-4 -translate-y-1/2",
                "text-neo-text-muted hover:text-neo-text",
                "transition-colors duration-200",
              )}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={20} strokeWidth={2} />
              ) : (
                <Eye size={20} strokeWidth={2} />
              )}
            </button>
          )}
        </div>
        {error && errorMessage && (
          <p className="text-destructive mt-1.5 ml-1 text-sm font-medium">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

NeoInput.displayName = "NeoInput";

export { NeoInput, neoInputVariants };
