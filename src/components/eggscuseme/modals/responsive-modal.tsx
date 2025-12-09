"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
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
  fullHeightMobile = false,
  showCloseButton = true,
}: ResponsiveModalProps) {
  const isMobile = useIsMobile();

  // Mobile: Use Sheet (bottom sheet)
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className={cn(
            "rounded-t-[var(--radius-sheet)] px-4 pb-8",
            fullHeightMobile ? "h-[90vh]" : "max-h-[85vh]",
            "flex flex-col",
            className,
          )}
        >
          {/* Drag handle */}
          <div className="bg-muted-foreground/30 mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full" />

          <SheetHeader className="shrink-0 text-left">
            <div className="flex items-start justify-between gap-4">
              <div>
                <SheetTitle className="text-lg">{title}</SheetTitle>
                {description && (
                  <SheetDescription className="mt-1">
                    {description}
                  </SheetDescription>
                )}
              </div>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 rounded-full"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="size-4" />
                  <span className="sr-only">Fermer</span>
                </Button>
              )}
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto py-4">{children}</div>

          {/* Footer */}
          {footer && (
            <SheetFooter className="shrink-0 border-t pt-4">
              {footer}
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Use Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="py-4">{children}</div>

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
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
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "..." : confirmLabel}
          </Button>
        </div>
      }
    >
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </ResponsiveModal>
  );
}
