"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

// Radio Group Context
type RadioGroupContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
};

const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

const useRadioGroup = () => React.useContext(RadioGroupContext);

// Radio Group
export type NeoRadioGroupProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
  children: React.ReactNode;
  className?: string;
};

const NeoRadioGroup = React.forwardRef<HTMLDivElement, NeoRadioGroupProps>(
  (
    {
      value,
      onValueChange,
      disabled,
      size = "md",
      orientation = "vertical",
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <RadioGroupContext.Provider
        value={{ value, onValueChange, disabled, size }}
      >
        <div
          ref={ref}
          role="radiogroup"
          data-slot="neo-radio-group"
          className={cn(
            "flex",
            orientation === "vertical" ? "flex-col gap-3" : "flex-row gap-4",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);

NeoRadioGroup.displayName = "NeoRadioGroup";

// Radio Item Variants
const neoRadioVariants = cva(
  [
    "inline-flex items-center justify-center shrink-0",
    "rounded-full",
    "border-[length:var(--border-neo)]",
    "transition-all duration-200",
    "cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-accent focus-visible:ring-offset-2",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-5",
        md: "size-6",
        lg: "size-7",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const dotSizes = {
  sm: "size-2",
  md: "size-2.5",
  lg: "size-3",
};

export type NeoRadioProps = Omit<React.ComponentProps<"button">, "onChange"> &
  VariantProps<typeof neoRadioVariants> & {
    value: string;
    label?: string;
  };

const NeoRadio = React.forwardRef<HTMLButtonElement, NeoRadioProps>(
  ({ className, value, disabled: itemDisabled, label, ...props }, ref) => {
    const group = useRadioGroup();
    const isChecked = group.value === value;
    const disabled = itemDisabled ?? group.disabled;
    const size = group.size ?? "md";

    const handleClick = () => {
      if (!disabled && group.onValueChange) {
        group.onValueChange(value);
      }
    };

    const radio = (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={isChecked}
        data-slot="neo-radio"
        data-state={isChecked ? "checked" : "unchecked"}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          neoRadioVariants({ size, className }),
          isChecked
            ? "bg-neo-accent border-neo-border shadow-[var(--shadow-neo-sm)]"
            : "bg-neo-input border-neo-border/50 hover:border-neo-border",
          disabled && "cursor-not-allowed opacity-50",
        )}
        {...props}
      >
        <AnimatePresence>
          {isChecked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={cn(
                dotSizes[size],
                "bg-neo-accent-foreground rounded-full",
              )}
            />
          )}
        </AnimatePresence>
      </button>
    );

    if (label) {
      return (
        <label
          className={cn(
            "inline-flex cursor-pointer items-center gap-3",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          {radio}
          <span className="text-neo-text font-medium select-none">{label}</span>
        </label>
      );
    }

    return radio;
  },
);

NeoRadio.displayName = "NeoRadio";

export { NeoRadioGroup, NeoRadio, neoRadioVariants };
