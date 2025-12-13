"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoToggleVariants = cva(
  // Base track styles
  [
    "relative inline-flex shrink-0 cursor-pointer items-center",
    "rounded-full",
    "border-[length:var(--border-neo)]",
    "transition-colors duration-200",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-7 w-12",
        md: "h-8 w-14",
        lg: "h-9 w-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const thumbSizes = {
  sm: "size-5",
  md: "size-6",
  lg: "size-7",
};

export type NeoToggleProps = Omit<React.ComponentProps<"button">, "onChange"> &
  VariantProps<typeof neoToggleVariants> & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  };

const NeoToggle = React.forwardRef<HTMLButtonElement, NeoToggleProps>(
  (
    {
      className,
      size = "md",
      checked = false,
      onCheckedChange,
      disabled,
      ...props
    },
    ref,
  ) => {
    const handleClick = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        data-slot="neo-toggle"
        data-state={checked ? "checked" : "unchecked"}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          neoToggleVariants({ size, className }),
          checked
            ? "bg-neo-accent border-neo-border"
            : "bg-neo-input border-neo-border",
          disabled && "cursor-not-allowed opacity-50",
        )}
        {...props}
      >
        <motion.div
          className={cn(
            thumbSizes[size ?? "md"],
            "rounded-full",
            "border-neo-border border-[length:var(--border-neo)]",
            "shadow-[2px_2px_0px_var(--neo-shadow-color)]",
            checked ? "bg-white" : "bg-neo-text-muted",
          )}
          layout
          transition={{
            type: "spring",
            stiffness: 600,
            damping: 30,
          }}
          style={{
            marginLeft: checked ? "auto" : "2px",
            marginRight: checked ? "2px" : "auto",
          }}
        />
      </button>
    );
  },
);

NeoToggle.displayName = "NeoToggle";

export { NeoToggle, neoToggleVariants };
