"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

// Context
type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within NeoTabs");
  }
  return context;
};

// Tabs Root
export type NeoTabsProps = {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
};

const NeoTabs = React.forwardRef<HTMLDivElement, NeoTabsProps>(
  (
    {
      defaultValue,
      value: controlledValue,
      onValueChange,
      children,
      className,
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const value = controlledValue ?? internalValue;

    const handleValueChange = (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };

    return (
      <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
        <div ref={ref} data-slot="neo-tabs" className={cn("w-full", className)}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);

NeoTabs.displayName = "NeoTabs";

// Tabs List
const neoTabsListVariants = cva(
  [
    "inline-flex items-center gap-1 p-1",
    "bg-neo-input",
    "border-[length:var(--border-neo)] border-neo-border/30",
    "rounded-[var(--radius-neo-xl)]",
  ].join(" "),
  {
    variants: {
      fullWidth: {
        true: "w-full",
        false: "w-fit",
      },
    },
    defaultVariants: {
      fullWidth: false,
    },
  },
);

type NeoTabsListProps = React.ComponentProps<"div"> &
  VariantProps<typeof neoTabsListVariants>;

const NeoTabsList = React.forwardRef<HTMLDivElement, NeoTabsListProps>(
  ({ className, fullWidth, children, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      data-slot="neo-tabs-list"
      className={cn(neoTabsListVariants({ fullWidth, className }))}
      {...props}
    >
      {children}
    </div>
  ),
);

NeoTabsList.displayName = "NeoTabsList";

// Tabs Trigger
type NeoTabsTriggerProps = React.ComponentProps<"button"> & {
  value: string;
};

const NeoTabsTrigger = React.forwardRef<HTMLButtonElement, NeoTabsTriggerProps>(
  ({ className, value, children, disabled, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useTabsContext();
    const isSelected = selectedValue === value;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isSelected}
        data-slot="neo-tabs-trigger"
        data-state={isSelected ? "active" : "inactive"}
        disabled={disabled}
        onClick={() => !disabled && onValueChange(value)}
        className={cn(
          "relative px-4 py-2 text-sm font-semibold",
          "rounded-[var(--radius-neo-lg)]",
          "transition-all duration-200",
          "focus-visible:ring-neo-accent outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
          isSelected
            ? "text-neo-accent-foreground"
            : "text-neo-text-muted hover:text-neo-text",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        {...props}
      >
        {isSelected && (
          <motion.div
            layoutId="neo-tabs-indicator"
            className={cn(
              "absolute inset-0",
              "bg-neo-accent",
              "border-neo-border border-[length:var(--border-neo)]",
              "rounded-[var(--radius-neo-lg)]",
              "shadow-[var(--shadow-neo-sm)]",
            )}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </button>
    );
  },
);

NeoTabsTrigger.displayName = "NeoTabsTrigger";

// Tabs Content
type NeoTabsContentProps = {
  value: string;
  className?: string;
  children?: React.ReactNode;
};

const NeoTabsContent = React.forwardRef<HTMLDivElement, NeoTabsContentProps>(
  ({ className, value, children }, ref) => {
    const { value: selectedValue } = useTabsContext();
    const isSelected = selectedValue === value;

    if (!isSelected) return null;

    return (
      <motion.div
        ref={ref}
        role="tabpanel"
        data-slot="neo-tabs-content"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={cn("mt-4", className)}
      >
        {children}
      </motion.div>
    );
  },
);

NeoTabsContent.displayName = "NeoTabsContent";

export { NeoTabs, NeoTabsList, NeoTabsTrigger, NeoTabsContent };
