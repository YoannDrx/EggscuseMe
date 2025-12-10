"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoSelectVariants = cva(
  [
    "flex w-full items-center justify-between",
    "bg-neo-input text-neo-text",
    "border-[length:var(--border-neo)] rounded-[var(--radius-neo-xl)]",
    "transition-all duration-200",
    "cursor-pointer",
    "outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-10 px-3 text-sm",
        md: "h-12 px-4 text-base",
        lg: "h-14 px-5 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type NeoSelectProps = VariantProps<typeof neoSelectVariants> & {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  children: React.ReactNode;
  className?: string;
};

type SelectContextValue = {
  value?: string;
  onSelect: (value: string) => void;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

const useSelectContext = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("NeoSelectItem must be used within NeoSelect");
  }
  return context;
};

const NeoSelect = React.forwardRef<HTMLDivElement, NeoSelectProps>(
  (
    {
      value,
      onValueChange,
      placeholder = "Sélectionner...",
      disabled,
      label,
      size = "md",
      children,
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [selectedLabel, setSelectedLabel] = React.useState<string>("");
    const triggerRef = React.useRef<HTMLButtonElement>(null);

    // Close on outside click
    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };

      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [open]);

    const handleSelect = (itemValue: string) => {
      onValueChange?.(itemValue);
      setOpen(false);
    };

    return (
      <SelectContext.Provider value={{ value, onSelect: handleSelect }}>
        <div ref={ref} className="relative w-full">
          {label && (
            <label className="text-neo-text mb-2 ml-1 block text-sm font-bold tracking-wider uppercase">
              {label}
            </label>
          )}

          {/* Trigger */}
          <button
            ref={triggerRef}
            type="button"
            disabled={disabled}
            onClick={() => setOpen(!open)}
            className={cn(
              neoSelectVariants({ size, className }),
              "border-neo-border/30",
              open
                ? "border-neo-border -translate-y-0.5 shadow-[var(--shadow-neo-sm)]"
                : "hover:border-neo-border",
            )}
          >
            <span
              className={cn(
                !value && !selectedLabel && "text-neo-text-muted/60",
              )}
            >
              {selectedLabel || placeholder}
            </span>
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={20} className="text-neo-text-muted" />
            </motion.div>
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "absolute z-50 mt-2 w-full",
                  "bg-neo-card",
                  "border-neo-border rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)]",
                  "shadow-[var(--shadow-neo-lg)]",
                  "overflow-hidden py-2",
                )}
              >
                {React.Children.map(children, async (child) => {
                  if (React.isValidElement<NeoSelectItemProps>(child)) {
                    return React.cloneElement(child, {
                      onLabelChange: (label: string) => {
                        if (child.props.value === value) {
                          setSelectedLabel(label);
                        }
                      },
                    });
                  }
                  return child;
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SelectContext.Provider>
    );
  },
);

NeoSelect.displayName = "NeoSelect";

// Select Item
type NeoSelectItemProps = {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onLabelChange?: (label: string) => void;
};

const NeoSelectItem = React.forwardRef<HTMLDivElement, NeoSelectItemProps>(
  ({ value, children, disabled, className, onLabelChange }, ref) => {
    const { value: selectedValue, onSelect } = useSelectContext();
    const isSelected = selectedValue === value;

    // Update parent with label when selected
    React.useEffect(() => {
      if (isSelected && onLabelChange) {
        onLabelChange(typeof children === "string" ? children : value);
      }
    }, [isSelected, children, value, onLabelChange]);

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        data-slot="neo-select-item"
        onClick={() => !disabled && onSelect(value)}
        className={cn(
          "flex items-center justify-between px-4 py-2.5",
          "cursor-pointer transition-colors duration-150",
          "hover:bg-neo-accent/10",
          isSelected && "bg-neo-accent/20 text-neo-accent font-semibold",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <span>{children}</span>
        {isSelected && (
          <Check size={16} strokeWidth={3} className="text-neo-accent" />
        )}
      </div>
    );
  },
);

NeoSelectItem.displayName = "NeoSelectItem";

export { NeoSelect, NeoSelectItem, neoSelectVariants };
