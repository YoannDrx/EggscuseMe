"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

export type NeoDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  side?: "left" | "right";
  children: React.ReactNode;
  className?: string;
};

const NeoDrawer = ({
  isOpen,
  onClose,
  title,
  side = "right",
  children,
  className,
}: NeoDrawerProps) => {
  const slideDirection = side === "right" ? "100%" : "-100%";

  return (
    <AnimatePresence>
      {isOpen && (
        <div data-slot="neo-drawer" className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: slideDirection }}
            animate={{ x: 0 }}
            exit={{ x: slideDirection }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "relative z-10 flex h-full w-full flex-col overflow-y-auto sm:w-80",
              side === "right" ? "ml-auto" : "mr-auto",
              side === "right"
                ? "border-l-[length:var(--border-neo)]"
                : "border-r-[length:var(--border-neo)]",
              "border-neo-border/30",
              "bg-neo-card",
              className,
            )}
          >
            {/* Header */}
            {title && (
              <div
                className={cn(
                  "flex shrink-0 items-center justify-between p-4",
                  "border-neo-border/20 border-b-[length:var(--border-neo)]",
                )}
              >
                <h3 className="text-neo-text text-xl font-black">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(
                    "text-neo-text-muted hover:text-neo-text",
                    "hover:bg-neo-bg rounded-xl p-2",
                    "transition-colors",
                  )}
                  aria-label="Close drawer"
                >
                  <X size={24} strokeWidth={2.5} />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 p-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export { NeoDrawer };
