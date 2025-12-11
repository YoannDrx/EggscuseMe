"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoBottomNavVariants = cva(
  [
    "fixed inset-x-0 bottom-0 z-50",
    "rounded-t-[var(--radius-neo-3xl)]",
    "border-t-[length:var(--border-neo)] border-neo-border/30",
    "bg-neo-card/95 backdrop-blur-xl",
    "shadow-[0_-4px_20px_rgba(0,0,0,0.15)]",
    "pb-[env(safe-area-inset-bottom)]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        elevated: "shadow-[0_-8px_30px_rgba(0,0,0,0.25)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Nav Item type
export type NeoBottomNavItem = {
  id: string;
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  /** Render as a floating action button (larger, elevated, accent color) */
  isFab?: boolean;
};

// Root component
export type NeoBottomNavProps = React.ComponentProps<"nav"> &
  VariantProps<typeof neoBottomNavVariants> & {
    items: NeoBottomNavItem[];
    activeId?: string;
    onItemClick?: (item: NeoBottomNavItem) => void;
    showLabels?: boolean;
    pillColor?: string;
  };

const NeoBottomNav = React.forwardRef<HTMLElement, NeoBottomNavProps>(
  (
    {
      className,
      variant,
      items,
      activeId,
      onItemClick,
      showLabels = true,
      pillColor = "bg-neo-accent",
      ...props
    },
    ref,
  ) => {
    const activeIndex = items.findIndex((item) => item.id === activeId);

    return (
      <nav
        ref={ref}
        data-slot="neo-bottom-nav"
        className={cn(neoBottomNavVariants({ variant, className }))}
        {...props}
      >
        <div
          className="relative grid h-20 items-center px-2"
          style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
        >
          {items.map((item) => {
            const isActive = item.id === activeId;
            const Icon = item.icon;

            // FAB (Floating Action Button) rendering
            if (item.isFab) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    item.onClick?.();
                    onItemClick?.(item);
                  }}
                  className={cn(
                    "relative flex flex-col items-center justify-center",
                    "outline-none",
                    "-mt-6", // Elevate above the nav bar
                  )}
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "flex size-14 items-center justify-center rounded-full",
                      "bg-neo-accent",
                      "border-neo-border/30 border-[length:var(--border-neo)]",
                      "shadow-[var(--shadow-neo-lg)]",
                    )}
                  >
                    <Icon
                      className="text-neo-accent-foreground size-7"
                      strokeWidth={2.5}
                    />
                  </motion.div>
                </button>
              );
            }

            // Regular nav item rendering
            const itemContent = (
              <>
                <motion.div
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <Icon
                    className={cn(
                      "size-6 transition-colors duration-200",
                      isActive ? "text-neo-accent" : "text-neo-text-muted",
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </motion.div>
                {showLabels && (
                  <span
                    className={cn(
                      "text-[10px] font-semibold transition-colors duration-200",
                      isActive ? "text-neo-text" : "text-neo-text-muted",
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </>
            );

            const commonClasses = cn(
              "relative flex flex-col items-center justify-center gap-1",
              "outline-none",
              "transition-all duration-200",
              "active:scale-95",
            );

            // Use Link for items with href, button for onClick-only items
            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    item.onClick?.();
                    onItemClick?.(item);
                  }}
                  className={commonClasses}
                >
                  {itemContent}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  item.onClick?.();
                  onItemClick?.(item);
                }}
                className={commonClasses}
              >
                {itemContent}
              </button>
            );
          })}

          {/* Animated pill indicator */}
          {activeIndex >= 0 && (
            <motion.div
              layoutId="neo-nav-pill"
              className={cn(
                "absolute bottom-2 h-1 w-10 rounded-full",
                pillColor,
              )}
              style={{
                left: `calc(${activeIndex * (100 / items.length)}% + ${50 / items.length}% - 20px)`,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          )}
        </div>
      </nav>
    );
  },
);
NeoBottomNav.displayName = "NeoBottomNav";

// Spacer component to prevent content from being hidden behind the nav
const NeoBottomNavSpacer = ({ className }: { className?: string }) => (
  <div className={cn("h-20 md:hidden", className)} />
);

export { NeoBottomNav, NeoBottomNavSpacer };
