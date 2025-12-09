"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useThemeColors } from "../theme";

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
  const colors = useThemeColors();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[var(--z-modal)] flex items-end justify-center sm:items-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute inset-0 backdrop-blur-sm",
              colors.modalOverlay,
            )}
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
              "relative w-full rounded-t-[var(--radius-sheet)] p-6 shadow-[var(--shadow-modal)] sm:w-96 sm:rounded-[var(--radius-sheet)]",
              colors.modalBg,
              colors.cardBorder,
              "border-t sm:border",
              className,
            )}
          >
            {/* Handle bar */}
            <div className="absolute top-2 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-current opacity-20" />

            {/* Header */}
            {title && (
              <div className="mb-4 flex items-center justify-between">
                <h3 className={cn("text-xl font-bold", colors.text)}>
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className={cn(
                    "rounded-full p-2 transition-colors",
                    colors.textMuted,
                    "hover:bg-current/10",
                  )}
                >
                  <X size={20} />
                </button>
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
