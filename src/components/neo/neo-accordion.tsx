"use client";

import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

// Context
type AccordionContextValue = {
  type: "single" | "multiple";
  value: string[];
  onToggle: (value: string) => void;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(
  null,
);

const useAccordionContext = () => {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within NeoAccordion");
  }
  return context;
};

// Item Context
type AccordionItemContextValue = {
  value: string;
  isOpen: boolean;
};

const AccordionItemContext =
  React.createContext<AccordionItemContextValue | null>(null);

const useAccordionItemContext = () => {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error(
      "AccordionTrigger/Content must be used within NeoAccordionItem",
    );
  }
  return context;
};

// Accordion Root
export type NeoAccordionProps = {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  children: React.ReactNode;
  className?: string;
};

const NeoAccordion = React.forwardRef<HTMLDivElement, NeoAccordionProps>(
  (
    {
      type = "single",
      defaultValue,
      value: controlledValue,
      onValueChange,
      collapsible = true,
      children,
      className,
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState<string[]>(() => {
      if (defaultValue) {
        return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
      }
      return [];
    });

    const value = controlledValue
      ? Array.isArray(controlledValue)
        ? controlledValue
        : [controlledValue]
      : internalValue;

    const handleToggle = (itemValue: string) => {
      let newValue: string[];

      if (type === "single") {
        if (value.includes(itemValue) && collapsible) {
          newValue = [];
        } else {
          newValue = [itemValue];
        }
      } else {
        if (value.includes(itemValue)) {
          newValue = value.filter((v) => v !== itemValue);
        } else {
          newValue = [...value, itemValue];
        }
      }

      setInternalValue(newValue);
      onValueChange?.(type === "single" ? (newValue[0] ?? "") : newValue);
    };

    return (
      <AccordionContext.Provider
        value={{ type, value, onToggle: handleToggle }}
      >
        <div
          ref={ref}
          data-slot="neo-accordion"
          className={cn("flex flex-col gap-2", className)}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);

NeoAccordion.displayName = "NeoAccordion";

// Accordion Item
type NeoAccordionItemProps = React.ComponentProps<"div"> & {
  value: string;
};

const NeoAccordionItem = React.forwardRef<
  HTMLDivElement,
  NeoAccordionItemProps
>(({ value, className, children, ...props }, ref) => {
  const { value: openValues } = useAccordionContext();
  const isOpen = openValues.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div
        ref={ref}
        data-slot="neo-accordion-item"
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "bg-neo-card",
          "border-neo-border/20 border-[length:var(--border-neo)]",
          "rounded-[var(--radius-neo-xl)]",
          "shadow-[var(--shadow-neo-sm)]",
          "overflow-hidden",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
});

NeoAccordionItem.displayName = "NeoAccordionItem";

// Accordion Trigger
type NeoAccordionTriggerProps = React.ComponentProps<"button">;

const NeoAccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  NeoAccordionTriggerProps
>(({ className, children, ...props }, ref) => {
  const { onToggle } = useAccordionContext();
  const { value, isOpen } = useAccordionItemContext();

  return (
    <button
      ref={ref}
      type="button"
      data-slot="neo-accordion-trigger"
      onClick={() => onToggle(value)}
      className={cn(
        "flex w-full items-center justify-between p-4",
        "text-neo-text text-left font-semibold",
        "hover:bg-neo-accent/5",
        "transition-colors duration-200",
        "focus-visible:ring-neo-accent outline-none focus-visible:ring-2 focus-visible:ring-inset",
        className,
      )}
      {...props}
    >
      {children}
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <ChevronDown size={20} className="text-neo-text-muted" />
      </motion.div>
    </button>
  );
});

NeoAccordionTrigger.displayName = "NeoAccordionTrigger";

// Accordion Content
type NeoAccordionContentProps = React.ComponentProps<"div">;

const NeoAccordionContent = React.forwardRef<
  HTMLDivElement,
  NeoAccordionContentProps
>(({ className, children, ...props }, ref) => {
  const { isOpen } = useAccordionItemContext();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          ref={ref}
          data-slot="neo-accordion-content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          className="overflow-hidden"
        >
          <div
            className={cn("text-neo-text-muted px-4 pb-4", className)}
            {...props}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

NeoAccordionContent.displayName = "NeoAccordionContent";

export {
  NeoAccordion,
  NeoAccordionItem,
  NeoAccordionTrigger,
  NeoAccordionContent,
};
