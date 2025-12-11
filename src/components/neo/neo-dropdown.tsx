"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronRight } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

// Dropdown Context
type DropdownContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown components must be used within a NeoDropdown");
  }
  return context;
}

// Dropdown Root
export type NeoDropdownProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const NeoDropdown = ({ children, open, onOpenChange }: NeoDropdownProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
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
    <DropdownContext.Provider value={{ open: isOpen, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
};

// Dropdown Trigger
type NeoDropdownTriggerProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
};

const NeoDropdownTrigger = React.forwardRef<
  HTMLButtonElement,
  NeoDropdownTriggerProps
>(({ className, children, asChild, ...props }, ref) => {
  const { open, setOpen } = useDropdownContext();

  const handleClick = () => setOpen(!open);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<{
        onClick?: () => void;
        "aria-expanded"?: boolean;
      }>,
      {
        onClick: handleClick,
        "aria-expanded": open,
      },
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      data-slot="neo-dropdown-trigger"
      aria-expanded={open}
      onClick={handleClick}
      className={cn("outline-none", className)}
      {...props}
    >
      {children}
    </button>
  );
});
NeoDropdownTrigger.displayName = "NeoDropdownTrigger";

// Dropdown Content
const neoDropdownContentVariants = cva(
  [
    "absolute z-50",
    "min-w-[180px]",
    "rounded-[var(--radius-neo-xl)]",
    "border-[length:var(--border-neo)] border-neo-border/30",
    "bg-neo-card",
    "shadow-[var(--shadow-neo-lg)]",
    "p-1.5",
    "origin-top-right",
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
      },
    },
    defaultVariants: {
      align: "end",
      side: "bottom",
    },
  },
);

export type NeoDropdownContentProps = {
  className?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
  children: React.ReactNode;
};

const NeoDropdownContent = ({
  className,
  align,
  side,
  children,
}: NeoDropdownContentProps) => {
  const { open, setOpen } = useDropdownContext();
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
      // Delay to prevent immediate close
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          data-slot="neo-dropdown-content"
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(neoDropdownContentVariants({ align, side, className }))}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Dropdown Item
const neoDropdownItemVariants = cva(
  [
    "relative flex items-center gap-2",
    "w-full px-3 py-2",
    "rounded-[var(--radius-neo-lg)]",
    "text-sm text-neo-text",
    "cursor-pointer select-none",
    "outline-none",
    "transition-all duration-150",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "hover:bg-neo-accent/10",
          "focus:bg-neo-accent/10",
          "active:bg-neo-accent/20",
        ].join(" "),
        destructive: [
          "text-destructive",
          "hover:bg-destructive/10",
          "focus:bg-destructive/10",
          "active:bg-destructive/20",
        ].join(" "),
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      disabled: false,
    },
  },
);

export type NeoDropdownItemProps = React.ComponentProps<"button"> &
  VariantProps<typeof neoDropdownItemVariants> & {
    icon?: React.ReactNode;
    shortcut?: string;
  };

const NeoDropdownItem = React.forwardRef<
  HTMLButtonElement,
  NeoDropdownItemProps
>(
  (
    {
      className,
      variant,
      disabled,
      icon,
      shortcut,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const { setOpen } = useDropdownContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onClick?.(e);
      setOpen(false);
    };

    return (
      <button
        ref={ref}
        type="button"
        data-slot="neo-dropdown-item"
        disabled={disabled ?? false}
        onClick={handleClick}
        className={cn(
          neoDropdownItemVariants({
            variant,
            disabled: disabled ?? false,
            className,
          }),
        )}
        {...props}
      >
        {icon && <span className="size-4 shrink-0">{icon}</span>}
        <span className="flex-1 text-left">{children}</span>
        {shortcut && (
          <span className="text-neo-text-muted ml-auto text-xs">
            {shortcut}
          </span>
        )}
      </button>
    );
  },
);
NeoDropdownItem.displayName = "NeoDropdownItem";

// Dropdown Checkbox Item
export type NeoDropdownCheckboxItemProps = Omit<
  NeoDropdownItemProps,
  "icon"
> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const NeoDropdownCheckboxItem = React.forwardRef<
  HTMLButtonElement,
  NeoDropdownCheckboxItemProps
>(({ checked = false, onCheckedChange, children, onClick, ...props }, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onCheckedChange?.(!checked);
    onClick?.(e);
  };

  return (
    <NeoDropdownItem
      ref={ref}
      onClick={handleClick}
      icon={
        checked ? (
          <Check className="text-neo-accent size-4" />
        ) : (
          <span className="size-4" />
        )
      }
      {...props}
    >
      {children}
    </NeoDropdownItem>
  );
});
NeoDropdownCheckboxItem.displayName = "NeoDropdownCheckboxItem";

// Dropdown Separator
const NeoDropdownSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="neo-dropdown-separator"
    className={cn("bg-neo-border/20 my-1 h-px", className)}
    {...props}
  />
));
NeoDropdownSeparator.displayName = "NeoDropdownSeparator";

// Dropdown Label
const NeoDropdownLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="neo-dropdown-label"
    className={cn(
      "text-neo-text-muted px-3 py-1.5 text-xs font-bold tracking-wide uppercase",
      className,
    )}
    {...props}
  />
));
NeoDropdownLabel.displayName = "NeoDropdownLabel";

// Dropdown Sub (for nested menus)
export type NeoDropdownSubProps = {
  children: React.ReactNode;
  trigger: React.ReactNode;
};

const NeoDropdownSub = ({ children, trigger }: NeoDropdownSubProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        className={cn(
          neoDropdownItemVariants({ variant: "default" }),
          "justify-between",
        )}
      >
        {trigger}
        <ChevronRight className="text-neo-text-muted size-4" />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute top-0 left-full ml-1",
              "min-w-[160px]",
              "rounded-[var(--radius-neo-xl)]",
              "border-neo-border/30 border-[length:var(--border-neo)]",
              "bg-neo-card",
              "shadow-[var(--shadow-neo-lg)]",
              "p-1.5",
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export {
  NeoDropdown,
  NeoDropdownTrigger,
  NeoDropdownContent,
  NeoDropdownItem,
  NeoDropdownCheckboxItem,
  NeoDropdownSeparator,
  NeoDropdownLabel,
  NeoDropdownSub,
};
