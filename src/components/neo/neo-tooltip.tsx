"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type NeoTooltipProps = {
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  delay?: number;
  children: React.ReactNode;
  className?: string;
};

const positionClasses = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowClasses = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-neo-border border-x-transparent border-b-transparent",
  bottom:
    "bottom-full left-1/2 -translate-x-1/2 border-b-neo-border border-x-transparent border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 border-l-neo-border border-y-transparent border-r-transparent",
  right:
    "right-full top-1/2 -translate-y-1/2 border-r-neo-border border-y-transparent border-l-transparent",
};

const animationVariants = {
  top: { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 } },
  bottom: { initial: { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 } },
  left: { initial: { opacity: 0, x: 5 }, animate: { opacity: 1, x: 0 } },
  right: { initial: { opacity: 0, x: -5 }, animate: { opacity: 1, x: 0 } },
};

const NeoTooltip = React.forwardRef<HTMLDivElement, NeoTooltipProps>(
  ({ content, side = "top", delay = 200, children, className }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(true);
      }, delay);
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsOpen(false);
    };

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <div
        ref={ref}
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {children}

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={animationVariants[side].initial}
              animate={animationVariants[side].animate}
              exit={animationVariants[side].initial}
              transition={{ duration: 0.15 }}
              className={cn(
                "pointer-events-none absolute z-50",
                positionClasses[side],
              )}
            >
              <div
                data-slot="neo-tooltip"
                className={cn(
                  "px-3 py-2 text-sm font-medium whitespace-nowrap",
                  "bg-neo-card text-neo-text",
                  "border-neo-border border-[length:var(--border-neo)]",
                  "rounded-[var(--radius-neo-md)]",
                  "shadow-[var(--shadow-neo-sm)]",
                  className,
                )}
              >
                {content}
              </div>
              {/* Arrow */}
              <div
                className={cn(
                  "absolute h-0 w-0",
                  "border-[6px]",
                  arrowClasses[side],
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

NeoTooltip.displayName = "NeoTooltip";

export { NeoTooltip };
