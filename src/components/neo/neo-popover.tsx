"use client";

import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from 'motion/react';
import * as React from "react";

import { cn } from "@/lib/utils";

// Popover Context
type PopoverContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

function usePopoverContext() {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("Popover components must be used within a NeoPopover");
  }
  return context;
}

// Popover Root
export type NeoPopoverProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const NeoPopover = ({ children, open, onOpenChange }: NeoPopoverProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange],
  );

  // Close on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, setOpen]);

  return (
    <PopoverContext.Provider value={{ open: isOpen, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
};

// Popover Trigger
const NeoPopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, children, ...props }, ref) => {
  const { open, setOpen, triggerRef } = usePopoverContext();

  // Merge refs
  const mergedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current =
        node;
    },
    [ref, triggerRef],
  );

  return (
    <button
      ref={mergedRef}
      type="button"
      data-slot="neo-popover-trigger"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className={cn("outline-none", className)}
      {...props}
    >
      {children}
    </button>
  );
});
NeoPopoverTrigger.displayName = "NeoPopoverTrigger";

// Popover Content Variants
const neoPopoverContentVariants = cva(
  [
    "absolute z-50",
    "min-w-[200px]",
    "rounded-[var(--radius-neo-xl)]",
    "border-[length:var(--border-neo)] border-neo-border/30",
    "bg-neo-card",
    "shadow-[var(--shadow-neo-lg)]",
    "p-4",
  ].join(" "),
  {
    variants: {
      align: {
        start: "left-0",
        center: "left-1/2 -translate-x-1/2",
        end: "right-0",
      },
      side: {
        top: "bottom-full mb-2",
        bottom: "top-full mt-2",
        left: "right-full mr-2 top-0",
        right: "left-full ml-2 top-0",
      },
    },
    defaultVariants: {
      align: "center",
      side: "bottom",
    },
  },
);

export type NeoPopoverContentProps = {
  className?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
};

const NeoPopoverContent = ({
  className,
  align,
  side,
  children,
}: NeoPopoverContentProps) => {
  const { open, setOpen } = usePopoverContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open, setOpen]);

  const animationVariants = {
    top: { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } },
    bottom: { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 8 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 } },
  };

  const animation = animationVariants[side ?? "bottom"];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          data-slot="neo-popover-content"
          initial={animation.initial}
          animate={animation.animate}
          exit={animation.initial}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(neoPopoverContentVariants({ align, side, className }))}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Popover Close (helper button to close)
const NeoPopoverClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, onClick, ...props }, ref) => {
  const { setOpen } = usePopoverContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    setOpen(false);
  };

  return (
    <button
      ref={ref}
      type="button"
      data-slot="neo-popover-close"
      onClick={handleClick}
      className={cn("outline-none", className)}
      {...props}
    />
  );
});
NeoPopoverClose.displayName = "NeoPopoverClose";

export {
  NeoPopover,
  NeoPopoverTrigger,
  NeoPopoverContent,
  NeoPopoverClose,
  neoPopoverContentVariants,
};
