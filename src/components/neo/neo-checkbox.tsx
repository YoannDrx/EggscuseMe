"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from 'motion/react';
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoCheckboxVariants = cva(
  // Base styles
  [
    "inline-flex items-center justify-center shrink-0",
    "rounded-[var(--radius-neo-sm)]",
    "border-[length:var(--border-neo)]",
    "transition-all duration-200",
    "cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-accent focus-visible:ring-offset-2",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-5",
        md: "size-6",
        lg: "size-7",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const iconSizes = {
  sm: 12,
  md: 14,
  lg: 18,
};

export type NeoCheckboxProps = Omit<
  React.ComponentProps<"button">,
  "onChange"
> &
  VariantProps<typeof neoCheckboxVariants> & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    label?: string;
  };

const NeoCheckbox = React.forwardRef<HTMLButtonElement, NeoCheckboxProps>(
  (
    {
      className,
      size = "md",
      checked = false,
      onCheckedChange,
      disabled,
      label,
      ...props
    },
    ref,
  ) => {
    const handleClick = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    const checkbox = (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={checked}
        data-slot="neo-checkbox"
        data-state={checked ? "checked" : "unchecked"}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          neoCheckboxVariants({ size, className }),
          checked
            ? "bg-neo-accent border-neo-border shadow-[var(--shadow-neo-sm)]"
            : "bg-neo-input border-neo-border/50 hover:border-neo-border",
          disabled && "cursor-not-allowed opacity-50",
        )}
        {...props}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check
                size={iconSizes[size ?? "md"]}
                strokeWidth={4}
                className="text-neo-accent-foreground"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    );

    if (label) {
      return (
        <label
          className={cn(
            "inline-flex cursor-pointer items-center gap-3",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          {checkbox}
          <span className="text-neo-text font-medium select-none">{label}</span>
        </label>
      );
    }

    return checkbox;
  },
);

NeoCheckbox.displayName = "NeoCheckbox";

export { NeoCheckbox, neoCheckboxVariants };
