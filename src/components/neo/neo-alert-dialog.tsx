"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Info, X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { NeoButton } from "./neo-button";

const neoAlertDialogVariants = cva(
  [
    "relative w-full max-w-md",
    "rounded-[var(--radius-neo-2xl)]",
    "border-[length:var(--border-neo)]",
    "bg-neo-card",
    "shadow-[var(--shadow-neo-xl)]",
    "p-6",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "border-neo-border/30",
        destructive: "border-destructive/30",
        warning: "border-warning/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const iconMap = {
  default: Info,
  destructive: AlertTriangle,
  warning: AlertTriangle,
};

const iconColorMap = {
  default: "text-neo-accent bg-neo-accent/10",
  destructive: "text-destructive bg-destructive/10",
  warning: "text-warning bg-warning/10",
};

export type NeoAlertDialogProps = VariantProps<
  typeof neoAlertDialogVariants
> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  loading?: boolean;
  showIcon?: boolean;
};

const NeoAlertDialog = ({
  open = false,
  onOpenChange,
  variant = "default",
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Confirm",
  onCancel,
  onConfirm,
  loading = false,
  showIcon = true,
}: NeoAlertDialogProps) => {
  const handleClose = React.useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  const handleCancel = () => {
    onCancel?.();
    handleClose();
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  // Close on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !loading) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, loading, handleClose]);

  // Lock body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const Icon = iconMap[variant ?? "default"];
  const iconColor = iconColorMap[variant ?? "default"];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={loading ? undefined : handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            data-slot="neo-alert-dialog"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className={cn(neoAlertDialogVariants({ variant }))}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className={cn(
                "absolute top-4 right-4",
                "rounded-full p-1.5",
                "text-neo-text-muted",
                "hover:bg-neo-bg hover:text-neo-text",
                "transition-colors duration-200",
                "disabled:opacity-50",
              )}
            >
              <X className="size-4" />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center">
              {showIcon && (
                <div
                  className={cn(
                    "mb-4 flex size-12 items-center justify-center rounded-full",
                    iconColor,
                  )}
                >
                  <Icon className="size-6" />
                </div>
              )}

              <h2 className="text-neo-text text-lg font-bold">{title}</h2>

              {description && (
                <p className="text-neo-text-muted mt-2 text-sm">
                  {description}
                </p>
              )}

              {/* Actions */}
              <div className="mt-6 flex w-full gap-3">
                <NeoButton
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  {cancelText}
                </NeoButton>
                <NeoButton
                  variant={
                    variant === "destructive" ? "destructive" : "primary"
                  }
                  className="flex-1"
                  onClick={handleConfirm}
                  loading={loading}
                >
                  {confirmText}
                </NeoButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export { NeoAlertDialog, neoAlertDialogVariants };
