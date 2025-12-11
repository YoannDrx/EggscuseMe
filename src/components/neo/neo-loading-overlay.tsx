"use client";

import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

export type NeoLoadingOverlayProps = {
  visible: boolean;
  message?: string;
  className?: string;
};

const NeoLoadingOverlay = ({
  visible,
  message,
  className,
}: NeoLoadingOverlayProps) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-slot="neo-loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-0 z-50",
            "flex flex-col items-center justify-center gap-3",
            "rounded-[var(--radius-neo-2xl)]",
            "bg-white/50 backdrop-blur-sm dark:bg-black/50",
            className,
          )}
        >
          <Loader2 size={40} className="text-neo-accent animate-spin" />
          {message && (
            <span className="text-neo-text text-sm font-bold">{message}</span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { NeoLoadingOverlay };
