"use client";

import { NeoButton, NeoModal, NeoSheet } from "@/components/neo";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type ResponsiveModalProps = {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Modal title */
  title: string;
  /** Modal description */
  description?: string;
  /** Modal content */
  children: ReactNode;
  /** Footer content (buttons, etc.) */
  footer?: ReactNode;
  /** Additional CSS classes for content */
  className?: string;
  /** Full height on mobile (default: true) */
  fullHeightMobile?: boolean;
  /** Show close button */
  showCloseButton?: boolean;
};

/**
 * Responsive modal that adapts to screen size
 * - Mobile: Bottom sheet with drag handle
 * - Desktop: Centered dialog
 */
export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  fullHeightMobile: _ = false,
  showCloseButton = true,
}: ResponsiveModalProps) {
  const isMobile = useIsMobile();

  // Mobile: Use NeoSheet (bottom sheet)
  if (isMobile) {
    return (
      <NeoSheet
        open={open}
        onOpenChange={onOpenChange}
        side="bottom"
        title={title}
        description={description}
        showCloseButton={showCloseButton}
        className={className}
      >
        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-neo-border/30 shrink-0 border-t-[length:var(--border-neo)] pt-4">
            {footer}
          </div>
        )}
      </NeoSheet>
    );
  }

  // Desktop: Use NeoModal
  return (
    <NeoModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      className={cn("sm:max-w-md", className)}
    >
      <div className="py-4">{children}</div>
      {footer && (
        <div className="border-neo-border/30 mt-4 border-t-[length:var(--border-neo)] pt-4">
          {footer}
        </div>
      )}
    </NeoModal>
  );
}

/**
 * Confirmation modal with standard actions
 */
export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
  variant = "default",
  loading = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: "default" | "destructive";
  loading?: boolean;
}) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      showCloseButton={false}
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <NeoButton
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelLabel}
          </NeoButton>
          <NeoButton
            variant={variant === "destructive" ? "destructive" : "primary"}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "..." : confirmLabel}
          </NeoButton>
        </div>
      }
    >
      {description && (
        <p className="text-neo-text-muted text-sm">{description}</p>
      )}
    </ResponsiveModal>
  );
}
