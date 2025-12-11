"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from 'motion/react';
import * as React from "react";

import { cn } from "@/lib/utils";

const neoSwitchVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer",
    "rounded-full",
    "border-[length:var(--border-neo)] border-neo-border/30",
    "transition-all duration-200",
    // Disabled
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-6 w-11",
        md: "h-7 w-13",
        lg: "h-8 w-15",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const thumbSizes = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

const thumbPositions = {
  sm: { off: 2, on: 22 },
  md: { off: 2, on: 26 },
  lg: { off: 2, on: 32 },
};

export type NeoSwitchProps = Omit<React.ComponentProps<"button">, "onChange"> &
  VariantProps<typeof neoSwitchVariants> & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    label?: string;
  };

const NeoSwitch = React.forwardRef<HTMLButtonElement, NeoSwitchProps>(
  (
    {
      className,
      size = "md",
      checked = false,
      onCheckedChange,
      label,
      disabled,
      ...props
    },
    ref,
  ) => {
    const handleClick = () => {
      if (!disabled) {
        onCheckedChange?.(!checked);
      }
    };

    const thumbSize = thumbSizes[size ?? "md"];
    const positions = thumbPositions[size ?? "md"];

    return (
      <div className="flex items-center gap-3">
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          data-slot="neo-switch"
          disabled={disabled}
          onClick={handleClick}
          className={cn(
            neoSwitchVariants({ size }),
            checked
              ? "bg-neo-accent shadow-[var(--shadow-neo-sm)]"
              : "bg-neo-bg",
            className,
          )}
          {...props}
        >
          <motion.span
            className={cn(
              "absolute top-1/2 -translate-y-1/2",
              "rounded-full",
              "border-neo-border/30 border-[length:var(--border-neo)]",
              "shadow-[var(--shadow-neo-sm)]",
              thumbSize,
              checked ? "bg-neo-card" : "bg-neo-card",
            )}
            animate={{
              x: checked ? positions.on : positions.off,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          />
        </button>
        {label && (
          <span className="text-neo-text text-sm font-medium">{label}</span>
        )}
      </div>
    );
  },
);
NeoSwitch.displayName = "NeoSwitch";

export { NeoSwitch, neoSwitchVariants };
