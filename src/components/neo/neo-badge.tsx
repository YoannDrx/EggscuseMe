"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoBadgeVariants = cva(
  // Base styles - Sticker effect
  [
    "inline-flex items-center justify-center gap-1",
    "font-bold whitespace-nowrap",
    "border-[1.5px] rounded-[var(--radius-neo-md)]",
    "transition-all duration-200",
    "[&_svg]:size-3.5 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        // Default - Primary accent
        default: [
          "bg-neo-accent text-neo-accent-foreground",
          "border-neo-border/40",
          "shadow-[var(--shadow-neo-sm)]",
        ].join(" "),
        // Secondary - Subtle
        secondary: [
          "bg-neo-card text-neo-text",
          "border-neo-border/30",
          "shadow-[var(--shadow-neo-sm)]",
        ].join(" "),
        // Outline - Transparent
        outline: ["bg-transparent text-neo-text", "border-neo-border/50"].join(
          " ",
        ),
        // Freshness variants for EggscuseMe
        "fresh-extra": [
          "bg-fresh-extra/20 text-fresh-extra",
          "border-fresh-extra/60",
          "shadow-[2px_2px_0px_var(--fresh-extra)]",
        ].join(" "),
        fresh: [
          "bg-fresh/20 text-fresh-foreground",
          "border-fresh/60",
          "shadow-[2px_2px_0px_var(--fresh)]",
        ].join(" "),
        "fresh-cook": [
          "bg-fresh-cook/20 text-fresh-cook",
          "border-fresh-cook/60",
          "shadow-[2px_2px_0px_var(--fresh-cook)]",
        ].join(" "),
        expired: [
          "bg-expired/20 text-expired",
          "border-expired/60",
          "shadow-[2px_2px_0px_var(--expired)]",
        ].join(" "),
        // Status variants
        success: [
          "bg-success/20 text-success",
          "border-success/60",
          "shadow-[2px_2px_0px_var(--success)]",
        ].join(" "),
        warning: [
          "bg-warning/20 text-warning-foreground",
          "border-warning/60",
          "shadow-[2px_2px_0px_var(--warning)]",
        ].join(" "),
        destructive: [
          "bg-destructive/20 text-destructive",
          "border-destructive/60",
          "shadow-[2px_2px_0px_var(--destructive)]",
        ].join(" "),
        info: [
          "bg-info/20 text-info",
          "border-info/60",
          "shadow-[2px_2px_0px_var(--info)]",
        ].join(" "),
      },
      size: {
        sm: "h-5 px-2 text-xs",
        md: "h-6 px-2.5 text-sm",
        lg: "h-7 px-3 text-sm",
      },
      rotate: {
        true: "rotate-[-2deg] hover:rotate-0",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      rotate: false,
    },
  },
);

export type NeoBadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof neoBadgeVariants> & {
    icon?: React.ReactNode;
    showCheck?: boolean;
  };

const NeoBadge = React.forwardRef<HTMLSpanElement, NeoBadgeProps>(
  (
    { className, variant, size, rotate, icon, showCheck, children, ...props },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        data-slot="neo-badge"
        className={cn(neoBadgeVariants({ variant, size, rotate, className }))}
        {...props}
      >
        {showCheck && <Check strokeWidth={4} />}
        {icon}
        {children}
      </span>
    );
  },
);

NeoBadge.displayName = "NeoBadge";

export { NeoBadge, neoBadgeVariants };
