"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type NeoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "full";
  showHandle?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
  className?: string;
};

const sizeClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  full: "sm:max-w-2xl",
};

const NeoModal = React.forwardRef<HTMLDivElement, NeoModalProps>(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      size = "md",
      showHandle = true,
      showCloseButton = true,
      children,
      className,
    },
    ref,
  ) => {
    // Close on escape key
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onOpenChange(false);
        }
      };

      if (open) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }, [open, onOpenChange]);

    return (
      <AnimatePresence>
        {open && (
          <div
            className="fixed inset-0 z-[var(--z-modal)] flex items-end justify-center p-4 sm:items-center"
            data-slot="neo-modal"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-neo-text/60 absolute inset-0 backdrop-blur-sm"
              onClick={() => onOpenChange(false)}
            />

            {/* Modal Content */}
            <motion.div
              ref={ref}
              initial={{ y: "100%", rotate: 5 }}
              animate={{ y: 0, rotate: 0 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 350,
              }}
              className={cn(
                "relative z-10 w-full",
                sizeClasses[size],
                // Neo-brutal styling
                "bg-neo-card text-neo-text",
                "border-neo-border border-[length:var(--border-neo-lg)]",
                "rounded-t-[var(--radius-neo-3xl)] sm:rounded-[var(--radius-neo-2xl)]",
                "shadow-[var(--shadow-neo-xl)]",
                "p-6",
                className,
              )}
            >
              {/* Handle bar (mobile) */}
              {showHandle && (
                <div className="mb-4 flex justify-center sm:hidden">
                  <div className="bg-neo-border/40 h-1.5 w-12 rounded-full" />
                </div>
              )}

              {/* Header */}
              {(title ?? showCloseButton) && (
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {title && (
                      <h2 className="text-neo-text text-2xl font-bold tracking-tight">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="text-neo-text-muted mt-1 text-sm">
                        {description}
                      </p>
                    )}
                  </div>

                  {showCloseButton && (
                    <button
                      onClick={() => onOpenChange(false)}
                      className={cn(
                        "rounded-[var(--radius-neo-md)] p-2",
                        "border-neo-border border-[length:var(--border-neo)]",
                        "text-neo-text hover:bg-destructive/10 hover:text-destructive hover:border-destructive",
                        "transition-colors duration-200",
                      )}
                    >
                      <X size={20} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  },
);

NeoModal.displayName = "NeoModal";

export { NeoModal };
