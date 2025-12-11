"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from 'motion/react';
import * as React from "react";

import { cn } from "@/lib/utils";

const neoProgressVariants = cva(
  [
    "relative w-full overflow-hidden rounded-full",
    "border-[length:var(--border-neo)]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-2",
        md: "h-3",
        lg: "h-4",
        xl: "h-6",
      },
      variant: {
        default: "bg-neo-input border-neo-border/30",
        accent: "bg-neo-accent/20 border-neo-accent/40",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

export type NeoProgressProps = React.ComponentProps<"div"> &
  VariantProps<typeof neoProgressVariants> & {
    value?: number;
    max?: number;
    color?:
      | "default"
      | "success"
      | "warning"
      | "destructive"
      | "accent"
      | "freshness";
    freshnessStatus?: "extra-fresh" | "fresh" | "cook" | "expired";
    showValue?: boolean;
    animated?: boolean;
    label?: string;
  };

const colorClasses = {
  default: "bg-neo-accent",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  accent: "bg-neo-accent",
  freshness: "", // Handled by freshnessStatus
};

const freshnessColorClasses = {
  "extra-fresh": "bg-fresh-extra",
  fresh: "bg-fresh",
  cook: "bg-fresh-cook",
  expired: "bg-expired",
};

const NeoProgress = React.forwardRef<HTMLDivElement, NeoProgressProps>(
  (
    {
      className,
      size = "md",
      variant,
      value = 0,
      max = 100,
      color = "default",
      freshnessStatus,
      showValue,
      animated = true,
      label,
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const fillColor =
      color === "freshness" && freshnessStatus
        ? freshnessColorClasses[freshnessStatus]
        : colorClasses[color];

    return (
      <div className="w-full">
        {(label ?? showValue) && (
          <div className="mb-2 flex items-center justify-between">
            {label && (
              <span className="text-neo-text text-sm font-bold">{label}</span>
            )}
            {showValue && (
              <span className="text-neo-text-muted text-sm font-medium">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}

        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          data-slot="neo-progress"
          className={cn(neoProgressVariants({ size, variant, className }))}
          {...props}
        >
          <motion.div
            className={cn(
              "h-full rounded-full",
              fillColor,
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
            )}
            initial={animated ? { width: 0 } : false}
            animate={{ width: `${percentage}%` }}
            transition={{
              duration: animated ? 0.5 : 0,
              ease: "easeOut",
            }}
          />
        </div>
      </div>
    );
  },
);

NeoProgress.displayName = "NeoProgress";

export { NeoProgress, neoProgressVariants };
