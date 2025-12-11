"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const neoTagVariants = cva(
  [
    "inline-flex items-center gap-1.5",
    "rounded-full",
    "border-[length:var(--border-neo)]",
    "font-bold",
    "transition-all duration-200",
    "select-none whitespace-nowrap",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "px-3 py-1 text-xs",
        md: "px-4 py-1.5 text-sm",
        lg: "px-5 py-2 text-sm",
      },
      selected: {
        true: [
          "bg-neo-accent text-neo-accent-foreground",
          "border-neo-border",
          "shadow-[2px_2px_0px_var(--neo-shadow-color)]",
        ].join(" "),
        false: [
          "bg-neo-card text-neo-text",
          "border-neo-border/30",
          "hover:-translate-y-0.5",
          "hover:shadow-[2px_2px_0px_var(--neo-shadow-color)]",
        ].join(" "),
      },
      clickable: {
        true: "cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      selected: false,
      clickable: true,
    },
  },
);

export type NeoTagProps = VariantProps<typeof neoTagVariants> & {
  label: string;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
  disabled?: boolean;
};

const NeoTag = ({
  label,
  selected,
  size,
  onClick,
  onRemove,
  className,
  disabled = false,
}: NeoTagProps) => {
  const isClickable = !!onClick && !disabled;

  const handleClick = () => {
    if (isClickable) {
      onClick();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove && !disabled) {
      onRemove();
    }
  };

  return (
    <button
      type="button"
      data-slot="neo-tag"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        neoTagVariants({
          size,
          selected,
          clickable: isClickable,
          className,
        }),
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={handleRemove}
          className={cn(
            "hover:bg-neo-border/20 -mr-0.5 rounded-full p-0.5",
            "transition-colors",
          )}
          aria-label={`Remove ${label}`}
        >
          <X size={size === "sm" ? 12 : 14} strokeWidth={3} />
        </button>
      )}
    </button>
  );
};

export { NeoTag, neoTagVariants };
