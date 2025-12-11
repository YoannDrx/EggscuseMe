"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { NeoButton } from "@/components/neo";

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className,
}: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 400,
            }}
            className={cn(
              "relative w-full p-6 sm:w-96",
              "rounded-t-[var(--radius-neo-xl)] sm:rounded-[var(--radius-neo-xl)]",
              "bg-neo-card",
              "border-neo-border border-t-[length:var(--border-neo)] sm:border-[length:var(--border-neo)]",
              "shadow-[var(--shadow-neo-lg)]",
              className,
            )}
          >
            {/* Handle bar */}
            <div className="bg-neo-text-muted/30 absolute top-2 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full" />

            {/* Header */}
            {title && (
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-neo-text text-xl font-bold">{title}</h3>
                <NeoButton
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="size-8 rounded-full p-0"
                >
                  <X size={20} />
                </NeoButton>
              </div>
            )}

            {/* Content */}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
