"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoTextareaVariants = cva(
  [
    "w-full",
    "rounded-[var(--radius-neo-xl)]",
    "border-[length:var(--border-neo)] border-neo-border/30",
    "bg-neo-input text-neo-text",
    "placeholder:text-neo-text-muted",
    "text-sm",
    "transition-all duration-200",
    "outline-none",
    "resize-none",
    // Focus
    "focus:border-neo-accent/50",
    "focus:shadow-[var(--shadow-neo-md)]",
    "focus:-translate-y-0.5",
    // Disabled
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        filled: "bg-neo-bg border-transparent focus:border-neo-accent/50",
      },
      textareaSize: {
        sm: "px-3 py-2 text-sm min-h-[80px]",
        md: "px-4 py-3 text-sm min-h-[120px]",
        lg: "px-4 py-3 text-base min-h-[160px]",
      },
    },
    defaultVariants: {
      variant: "default",
      textareaSize: "md",
    },
  },
);

export type NeoTextareaProps = Omit<React.ComponentProps<"textarea">, "size"> &
  VariantProps<typeof neoTextareaVariants> & {
    label?: string;
    error?: boolean;
    errorMessage?: string;
    helperText?: string;
  };

const NeoTextarea = React.forwardRef<HTMLTextAreaElement, NeoTextareaProps>(
  (
    {
      className,
      variant,
      textareaSize,
      label,
      error,
      errorMessage,
      helperText,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-neo-text block text-sm font-medium"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          data-slot="neo-textarea"
          className={cn(
            neoTextareaVariants({ variant, textareaSize }),
            error && "border-destructive/50 focus:border-destructive",
            className,
          )}
          {...props}
        />
        {(errorMessage ?? helperText) && (
          <p
            className={cn(
              "text-xs",
              error ? "text-destructive" : "text-neo-text-muted",
            )}
          >
            {errorMessage ?? helperText}
          </p>
        )}
      </div>
    );
  },
);
NeoTextarea.displayName = "NeoTextarea";

export { NeoTextarea, neoTextareaVariants };
