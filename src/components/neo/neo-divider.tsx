"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoDividerVariants = cva("", {
  variants: {
    variant: {
      solid: "border-neo-border/30",
      dashed: "border-neo-border/30 border-dashed",
      dotted: "border-neo-border/30 border-dotted",
    },
    orientation: {
      horizontal: "w-full border-t-[2px]",
      vertical: "h-full border-l-[2px]",
    },
    spacing: {
      none: "",
      sm: "",
      md: "",
      lg: "",
    },
  },
  compoundVariants: [
    { orientation: "horizontal", spacing: "sm", className: "my-2" },
    { orientation: "horizontal", spacing: "md", className: "my-4" },
    { orientation: "horizontal", spacing: "lg", className: "my-6" },
    { orientation: "vertical", spacing: "sm", className: "mx-2" },
    { orientation: "vertical", spacing: "md", className: "mx-4" },
    { orientation: "vertical", spacing: "lg", className: "mx-6" },
  ],
  defaultVariants: {
    variant: "solid",
    orientation: "horizontal",
    spacing: "md",
  },
});

export type NeoDividerProps = React.ComponentProps<"div"> &
  VariantProps<typeof neoDividerVariants> & {
    label?: string;
    icon?: React.ReactNode;
  };

const NeoDivider = React.forwardRef<HTMLDivElement, NeoDividerProps>(
  (
    { className, variant, orientation, spacing, label, icon, ...props },
    ref,
  ) => {
    // Simple divider without label
    if (!label && !icon) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation={orientation ?? "horizontal"}
          data-slot="neo-divider"
          className={cn(
            neoDividerVariants({ variant, orientation, spacing, className }),
          )}
          {...props}
        />
      );
    }

    // Divider with label or icon
    return (
      <div
        ref={ref}
        role="separator"
        data-slot="neo-divider"
        className={cn(
          "flex items-center gap-4",
          orientation === "vertical" && "flex-col",
          spacing === "sm" && (orientation === "horizontal" ? "my-2" : "mx-2"),
          spacing === "md" && (orientation === "horizontal" ? "my-4" : "mx-4"),
          spacing === "lg" && (orientation === "horizontal" ? "my-6" : "mx-6"),
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "flex-1",
            orientation === "horizontal"
              ? `border-t-[2px] ${variant === "dashed" ? "border-dashed" : variant === "dotted" ? "border-dotted" : ""}`
              : `h-full border-l-[2px] ${variant === "dashed" ? "border-dashed" : variant === "dotted" ? "border-dotted" : ""}`,
            "border-neo-border/30",
          )}
        />

        {(label ?? icon) && (
          <div className="text-neo-text-muted flex items-center gap-2 text-sm font-medium">
            {icon}
            {label}
          </div>
        )}

        <div
          className={cn(
            "flex-1",
            orientation === "horizontal"
              ? `border-t-[2px] ${variant === "dashed" ? "border-dashed" : variant === "dotted" ? "border-dotted" : ""}`
              : `h-full border-l-[2px] ${variant === "dashed" ? "border-dashed" : variant === "dotted" ? "border-dotted" : ""}`,
            "border-neo-border/30",
          )}
        />
      </div>
    );
  },
);

NeoDivider.displayName = "NeoDivider";

export { NeoDivider, neoDividerVariants };
