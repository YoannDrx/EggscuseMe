"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Minus, Plus } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const neoStepperVariants = cva(
  [
    "flex items-center justify-between",
    "bg-neo-card",
    "border-[length:var(--border-neo)] border-neo-border/20",
    "rounded-[var(--radius-neo-2xl)]",
    "shadow-[var(--shadow-neo-sm)]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "p-1.5 gap-2",
        md: "p-2 gap-3",
        lg: "p-2.5 gap-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const neoStepperButtonVariants = cva(
  [
    "flex items-center justify-center",
    "rounded-[var(--radius-neo-xl)]",
    "border-[length:var(--border-neo)] border-neo-border/30",
    "transition-all duration-200",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-9",
        md: "size-11",
        lg: "size-12",
      },
      variant: {
        minus: "bg-neo-input text-neo-text hover:bg-neo-card",
        plus: "bg-neo-accent text-neo-accent-foreground",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type NeoStepperProps = VariantProps<typeof neoStepperVariants> & {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
  disabled?: boolean;
};

const NeoStepper = ({
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  label,
  size = "md",
  className,
  disabled = false,
}: NeoStepperProps) => {
  const handleDecrement = () => {
    if (value > min && !disabled) {
      onChange(Math.max(min, value - step));
    }
  };

  const handleIncrement = () => {
    if (value < max && !disabled) {
      onChange(Math.min(max, value + step));
    }
  };

  const valueSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className="w-full">
      {label && (
        <label className="text-neo-text mb-2 ml-1 block text-xs font-black tracking-wider uppercase">
          {label}
        </label>
      )}
      <div
        data-slot="neo-stepper"
        className={cn(neoStepperVariants({ size, className }))}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className={cn(neoStepperButtonVariants({ size, variant: "minus" }))}
          aria-label="Decrease"
        >
          <Minus
            size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
            strokeWidth={3}
          />
        </motion.button>

        <span
          className={cn(
            "text-neo-text min-w-[3ch] text-center font-black",
            valueSizes[size ?? "md"],
          )}
        >
          {value}
        </span>

        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className={cn(neoStepperButtonVariants({ size, variant: "plus" }))}
          aria-label="Increase"
        >
          <Plus
            size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
            strokeWidth={3}
          />
        </motion.button>
      </div>
    </div>
  );
};

export { NeoStepper, neoStepperVariants };
