"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

const mobileCardVariants = cva(
  [
    "relative rounded-2xl",
    "bg-card text-card-foreground",
    "transition-all duration-200",
  ],
  {
    variants: {
      variant: {
        default: "border border-border shadow-sm",
        elevated: "shadow-md border border-border/50",
        interactive: [
          "border border-border shadow-sm",
          "active:scale-[0.98] active:shadow-none",
          "cursor-pointer",
        ],
        sunny: [
          "border-[1.5px] border-foreground/15",
          "shadow-[3px_3px_0px_oklch(0.25_0.02_270/0.1)]",
          "dark:shadow-[3px_3px_0px_oklch(0.10_0.02_60/0.2)]",
        ],
        "sunny-interactive": [
          "border-[1.5px] border-foreground/15",
          "shadow-[3px_3px_0px_oklch(0.25_0.02_270/0.1)]",
          "dark:shadow-[3px_3px_0px_oklch(0.10_0.02_60/0.2)]",
          "active:translate-x-[2px] active:translate-y-[2px]",
          "active:shadow-[1px_1px_0px_oklch(0.25_0.02_270/0.1)]",
          "cursor-pointer",
        ],
        ghost: "border-none shadow-none bg-transparent",
        outline: "border border-border bg-transparent shadow-none",
      },
      padding: {
        none: "p-0",
        sm: "p-[var(--space-card-padding)]",
        default: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "sm",
    },
  },
);

export type MobileCardProps = HTMLMotionProps<"div"> &
  VariantProps<typeof mobileCardVariants> & {
    /** Press feedback animation */
    pressable?: boolean;
    /** Children */
    children: ReactNode;
  };

/**
 * Mobile-optimized card component
 * - Reduced padding for mobile screens
 * - Touch feedback animations
 * - Multiple style variants
 */
export const MobileCard = forwardRef<HTMLDivElement, MobileCardProps>(
  (
    { className, variant, padding, pressable = false, children, ...props },
    ref,
  ) => {
    const isInteractive =
      pressable || variant === "interactive" || variant === "sunny-interactive";

    return (
      <motion.div
        ref={ref}
        className={cn(mobileCardVariants({ variant, padding }), className)}
        whileTap={isInteractive ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.1 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

MobileCard.displayName = "MobileCard";

/** Card header for mobile cards */
export function MobileCardHeader({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3",
        "border-border/50 mb-3 border-b pb-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Card content for mobile cards */
export function MobileCardContent({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
}

/** Card footer for mobile cards */
export function MobileCardFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3",
        "border-border/50 mt-3 border-t pt-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
