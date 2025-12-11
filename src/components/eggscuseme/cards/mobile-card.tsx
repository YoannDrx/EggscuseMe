"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, type ReactNode } from "react";

const mobileCardVariants = cva(
  [
    "relative rounded-[var(--radius-neo-xl)]",
    "bg-neo-card text-neo-text",
    "transition-all duration-200",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-[length:var(--border-neo)] border-neo-border",
          "shadow-[var(--shadow-neo-md)]",
        ],
        elevated: [
          "border-[length:var(--border-neo)] border-neo-border",
          "shadow-[var(--shadow-neo-lg)]",
        ],
        interactive: [
          "border-[length:var(--border-neo)] border-neo-border",
          "shadow-[var(--shadow-neo-md)]",
          "hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-lg)]",
          "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
          "cursor-pointer",
        ],
        ghost: "border-none shadow-none bg-transparent",
        outline: [
          "border-[length:var(--border-neo)] border-neo-border",
          "bg-transparent shadow-none",
        ],
      },
      padding: {
        none: "p-0",
        sm: "p-3",
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
    const isInteractive = pressable || variant === "interactive";

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
        "border-neo-border/30 mb-3 border-b-[length:var(--border-neo)] pb-3",
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
        "border-neo-border/30 mt-3 border-t-[length:var(--border-neo)] pt-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
