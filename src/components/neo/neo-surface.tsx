"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoSurfaceVariants = cva(
  // Base styles - Neo-soft-brutalisme foundation
  [
    "bg-neo-card",
    "border-[length:var(--border-neo)] border-neo-border/20",
    "rounded-[var(--radius-neo-2xl)]",
    "shadow-[var(--shadow-neo-md)]",
    "transition-all duration-200",
  ].join(" "),
  {
    variants: {
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-5",
        lg: "p-6",
        xl: "p-8",
      },
      clickable: {
        true: [
          "cursor-pointer",
          "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        ].join(" "),
        false: "",
      },
      hoverEffect: {
        true: "hover:-translate-y-1 hover:shadow-[var(--shadow-neo-lg)]",
        false: "",
      },
    },
    defaultVariants: {
      padding: "lg",
      clickable: false,
      hoverEffect: false,
    },
  },
);

export type NeoSurfaceProps = React.ComponentProps<"div"> &
  VariantProps<typeof neoSurfaceVariants> & {
    as?: "div" | "article" | "section" | "aside";
  };

const NeoSurface = React.forwardRef<HTMLDivElement, NeoSurfaceProps>(
  (
    {
      className,
      padding,
      clickable,
      hoverEffect,
      as: Component = "div",
      onClick,
      ...props
    },
    ref,
  ) => {
    // Auto-enable clickable styles if onClick is provided
    const isClickable = clickable ?? !!onClick;
    const hasHoverEffect = hoverEffect ?? isClickable;

    return (
      <Component
        ref={ref as React.Ref<HTMLDivElement>}
        data-slot="neo-surface"
        onClick={onClick}
        className={cn(
          neoSurfaceVariants({
            padding,
            clickable: isClickable,
            hoverEffect: hasHoverEffect,
            className,
          }),
        )}
        {...props}
      />
    );
  },
);
NeoSurface.displayName = "NeoSurface";

export { NeoSurface, neoSurfaceVariants };
