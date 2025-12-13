"use client";

import { AnimatePresence, motion, useDragControls } from "motion/react";
import { X } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

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

// iOS-style spring configuration
const IOS_SPRING = {
  type: "spring" as const,
  damping: 30,
  stiffness: 400,
  mass: 0.8,
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
  const constraintsRef = React.useRef<HTMLDivElement>(null);

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

  // Lock body scroll when open - iOS style
  React.useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
    };
  }, [open]);

  const isVertical = side === "top" || side === "bottom";
  const isFullscreen = side === "fullscreen";
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragEnd = (
    _: never,
    info: { offset: { y: number; x: number }; velocity: { y: number } },
  ) => {
    const threshold = 80;
    const velocityThreshold = 300;
    const offset = isVertical ? info.offset.y : info.offset.x;
    const velocity = info.velocity.y;

    const shouldClose =
      (side === "bottom" &&
        (offset > threshold || velocity > velocityThreshold)) ||
      (side === "top" &&
        (offset < -threshold || velocity < -velocityThreshold)) ||
      (side === "right" && offset > threshold) ||
      (side === "left" && offset < -threshold);

    if (shouldClose) {
      handleClose();
    }
  };

  if (!mounted) {
    return null;
  }

  const sheetContent = (
    <AnimatePresence mode="wait">
      {open && (
        <div
          ref={constraintsRef}
          data-slot="neo-sheet-root"
          className="fixed inset-0 z-50"
        >
          {/* Backdrop */}
          <motion.div
            data-slot="neo-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50"
          />

          {/* Sheet - positioned from bottom */}
          <motion.div
            data-slot="neo-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={IOS_SPRING}
            drag={draggable && !isFullscreen && isVertical ? "y" : false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.35 }}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            className={cn(
              "absolute inset-x-0 bottom-0",
              "bg-neo-card flex flex-col",
              "rounded-t-[24px]",
              "shadow-[0_-8px_30px_rgba(0,0,0,0.25)]",
              "max-h-[calc(100dvh-env(safe-area-inset-top)-20px)]",
              className,
            )}
          >
            {/* Handle bar - iOS style */}
            {showHandle && isVertical && !isFullscreen && (
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="flex shrink-0 cursor-grab justify-center py-3 active:cursor-grabbing"
              >
                <div className="h-1 w-10 rounded-full bg-white/30" />
              </div>
            )}

            {/* Header */}
            {(title ?? description) && (
              <div className="shrink-0 px-5 pb-2">
                {title && (
                  <h2 className="text-neo-text text-lg font-semibold">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-neo-text-muted mt-0.5 text-sm">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Close button */}
            {showCloseButton && (
              <button
                type="button"
                onClick={handleClose}
                className={cn(
                  "absolute top-2.5 right-3 z-50",
                  "flex size-8 items-center justify-center rounded-full",
                  "text-neo-text-muted bg-white/10",
                  "transition-all duration-150",
                  "active:scale-90 active:bg-white/20",
                )}
              >
                <X className="size-5" strokeWidth={2.5} />
              </button>
            )}

            {/* Content */}
            <div className="min-h-0 w-full flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-5 pb-2">
              {children}
            </div>

            {/* Safe area padding for bottom bar */}
            <div
              className="shrink-0"
              style={{
                paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
              }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

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
