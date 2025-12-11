"use client";

import { cva } from "class-variance-authority";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import { X } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

const neoSheetVariants = cva(
  ["fixed z-[61]", "bg-neo-card", "flex flex-col", "overflow-hidden"].join(" "),
  {
    variants: {
      side: {
        top: [
          "inset-x-0 top-0",
          "rounded-b-[var(--radius-neo-3xl)]",
          "max-h-[85vh]",
          "border-[length:var(--border-neo)] border-neo-border/30",
          "shadow-[var(--shadow-neo-xl)]",
        ].join(" "),
        bottom: [
          "inset-x-0 bottom-0",
          "rounded-t-[var(--radius-neo-3xl)]",
          "max-h-[85dvh]",
          "border-[length:var(--border-neo)] border-neo-border/30",
          "shadow-[var(--shadow-neo-xl)]",
        ].join(" "),
        left: [
          "inset-y-0 left-0",
          "rounded-r-[var(--radius-neo-3xl)]",
          "w-3/4 max-w-sm",
          "border-[length:var(--border-neo)] border-neo-border/30",
          "shadow-[var(--shadow-neo-xl)]",
        ].join(" "),
        right: [
          "inset-y-0 right-0",
          "rounded-l-[var(--radius-neo-3xl)]",
          "w-3/4 max-w-sm",
          "border-[length:var(--border-neo)] border-neo-border/30",
          "shadow-[var(--shadow-neo-xl)]",
        ].join(" "),
        fullscreen: ["inset-0"].join(" "),
      },
    },
    defaultVariants: {
      side: "bottom",
    },
  },
);

// Animation variants for each side
const slideAnimations = {
  top: {
    initial: { y: "-100%" },
    animate: { y: 0 },
    exit: { y: "-100%" },
  },
  bottom: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
  },
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
  },
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
  },
  fullscreen: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
};

export type NeoSheetProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right" | "fullscreen";
  showHandle?: boolean;
  showCloseButton?: boolean;
  title?: string;
  description?: string;
  className?: string;
  draggable?: boolean;
};

const NeoSheet = ({
  open = false,
  onOpenChange,
  children,
  side = "bottom",
  showHandle = true,
  showCloseButton = true,
  title,
  description,
  className,
  draggable = true,
}: NeoSheetProps) => {
  const dragControls = useDragControls();
  const sheetRef = React.useRef<HTMLDivElement>(null);

  const handleClose = React.useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  // Close on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, handleClose]);

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

  const animation = slideAnimations[side];
  const isVertical = side === "top" || side === "bottom";
  const isFullscreen = side === "fullscreen";
  const [mounted, setMounted] = React.useState(false);

  // Wait for client-side mount to use portal
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragEnd = (
    _: never,
    info: { offset: { y: number; x: number } },
  ) => {
    const threshold = 100;
    const offset = isVertical ? info.offset.y : info.offset.x;
    const shouldClose =
      (side === "bottom" && offset > threshold) ||
      (side === "top" && offset < -threshold) ||
      (side === "right" && offset > threshold) ||
      (side === "left" && offset < -threshold);

    if (shouldClose) {
      handleClose();
    }
  };

  // Don't render anything on server or before mount
  if (!mounted) {
    return null;
  }

  const sheetContent = (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            data-slot="neo-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            data-slot="neo-sheet"
            initial={animation.initial}
            animate={animation.animate}
            exit={animation.exit}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 400,
            }}
            drag={draggable && !isFullscreen ? (isVertical ? "y" : "x") : false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={cn(neoSheetVariants({ side, className }))}
          >
            {/* Handle bar (for dragging) */}
            {showHandle && isVertical && !isFullscreen && (
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="flex cursor-grab justify-center py-3 active:cursor-grabbing"
              >
                <div className="bg-neo-border/40 h-1.5 w-12 rounded-full" />
              </div>
            )}

            {/* Header */}
            {(title ?? description) && (
              <div className="border-neo-border/10 flex items-center justify-between border-b px-5 py-4">
                <div>
                  {title && (
                    <h2 className="text-neo-text text-xl font-bold">{title}</h2>
                  )}
                  {description && (
                    <p className="text-neo-text-muted mt-1 text-sm">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Close button - always visible when enabled */}
            {showCloseButton && (
              <button
                type="button"
                onClick={handleClose}
                className={cn(
                  "absolute top-3 right-4 z-10",
                  "rounded-full p-2",
                  "bg-neo-bg text-neo-text-muted",
                  "border-neo-border/20 border-[length:var(--border-neo)]",
                  "shadow-[var(--shadow-neo-sm)]",
                  "hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-md)]",
                  "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                  "transition-all duration-200",
                )}
              >
                <X className="size-5" />
              </button>
            )}

            {/* Content */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              {children}
            </div>

            {/* Safe area padding for mobile */}
            <div className="shrink-0 pb-[env(safe-area-inset-bottom)]" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Use portal to render directly in document.body
  // This fixes position:fixed issues when parent has transform
  return <>{createPortal(sheetContent, document.body)}</>;
};

// Sheet Trigger (helper component)
export type NeoSheetTriggerProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
};

const NeoSheetTrigger = React.forwardRef<
  HTMLButtonElement,
  NeoSheetTriggerProps
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    data-slot="neo-sheet-trigger"
    className={cn("outline-none", className)}
    {...props}
  >
    {children}
  </button>
));
NeoSheetTrigger.displayName = "NeoSheetTrigger";

// Sheet Content wrapper for composability
export type NeoSheetContentProps = React.ComponentProps<"div">;

const NeoSheetContent = React.forwardRef<HTMLDivElement, NeoSheetContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="neo-sheet-content"
      className={cn("space-y-4", className)}
      {...props}
    >
      {children}
    </div>
  ),
);
NeoSheetContent.displayName = "NeoSheetContent";

// Sheet Footer
const NeoSheetFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="neo-sheet-footer"
    className={cn(
      "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
      "border-neo-border/10 border-t pt-4",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));
NeoSheetFooter.displayName = "NeoSheetFooter";

export { NeoSheet, NeoSheetTrigger, NeoSheetContent, NeoSheetFooter };
