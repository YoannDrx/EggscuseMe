"use client";

import { cn } from "@/lib/utils";
import { Package, Utensils, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type DemoQuickActionsProps = {
  open: boolean;
  onClose: () => void;
};

const ACTIONS = [
  {
    id: "add-box",
    icon: Package,
    label: "Ajouter une boite",
    description: "Nouvelle boite d'oeufs a suivre",
    color: "bg-fresh-extra/20 text-fresh-extra",
  },
  {
    id: "consume",
    icon: Utensils,
    label: "Consommer des oeufs",
    description: "Enregistrer une consommation",
    color: "bg-neo-accent/20 text-neo-accent",
  },
];

export function DemoQuickActions({ open, onClose }: DemoQuickActionsProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "absolute inset-x-0 bottom-0 z-50",
              "bg-neo-card rounded-t-[24px]",
              "border-neo-border/30 border-t-[length:var(--border-neo)]",
              "px-4 pt-4 pb-8",
            )}
          >
            {/* Handle */}
            <div className="mb-4 flex justify-center">
              <div className="bg-neo-text-muted/30 h-1 w-12 rounded-full" />
            </div>

            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-neo-text text-lg font-bold">
                Actions rapides
              </h3>
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full",
                  "bg-neo-bg text-neo-text-muted hover:text-neo-text",
                )}
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {ACTIONS.map((action, index) => (
                <motion.button
                  key={action.id}
                  type="button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={onClose}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-[var(--radius-neo-xl)] p-4",
                    "bg-neo-bg border-neo-border/50 border-[length:var(--border-neo)]",
                    "transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-sm)]",
                    "active:translate-y-0",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full",
                      action.color,
                    )}
                  >
                    <action.icon className="size-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-neo-text font-semibold">
                      {action.label}
                    </p>
                    <p className="text-neo-text-muted text-xs">
                      {action.description}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
