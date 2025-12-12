"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoButtonVariants = cva(
  // Base styles - Neo-soft-brutalisme foundation
  [
    "inline-flex items-center justify-center gap-2.5",
    "font-bold select-none whitespace-nowrap",
    "border-[length:var(--border-neo)] rounded-[var(--radius-neo-xl)]",
    "transition-all duration-200 ease-out",
    "outline-none focus-visible:ring-2 focus-visible:ring-neo-accent focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary - Amber accent with press effect
        primary: [
          "bg-neo-accent text-neo-accent-foreground",
          "border-neo-border",
          "shadow-[var(--shadow-neo-md)]",
          "hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-lg)]",
          "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        ].join(" "),
        // Secondary - Card background with press effect
        secondary: [
          "bg-neo-card text-neo-text",
          "border-neo-border",
          "shadow-[var(--shadow-neo-md)]",
          "hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-lg)]",
          "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        ].join(" "),
        // Outline - Transparent with border
        outline: [
          "bg-transparent text-neo-text",
          "border-neo-border",
          "shadow-[var(--shadow-neo-md)]",
          "hover:bg-neo-card hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-lg)]",
          "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        ].join(" "),
        // Ghost - No border, subtle hover
        ghost: [
          "bg-transparent text-neo-text-muted",
          "border-transparent",
          "hover:text-neo-text hover:bg-neo-card/50",
        ].join(" "),
        // Destructive - Red variant
        destructive: [
          "bg-destructive text-destructive-foreground",
          "border-neo-border",
          "shadow-[var(--shadow-neo-md)]",
          "hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-lg)]",
          "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        ].join(" "),
        // Success - Green variant
        success: [
          "bg-success text-success-foreground",
          "border-neo-border",
          "shadow-[var(--shadow-neo-md)]",
          "hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-lg)]",
          "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        ].join(" "),
        // Icon - Square button for icons only
        icon: [
          "bg-neo-card text-neo-text",
          "border-neo-border",
          "shadow-[var(--shadow-neo-sm)]",
          "hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-md)]",
          "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
          "aspect-square p-0",
        ].join(" "),
      },
      size: {
        sm: "h-9 px-4 text-sm [&_svg]:size-4",
        md: "h-11 px-5 text-sm [&_svg]:size-5",
        lg: "h-[52px] px-6 text-base [&_svg]:size-5",
        xl: "h-14 px-8 text-lg [&_svg]:size-6",
        icon: "size-11 [&_svg]:size-5",
      },
      rounded: {
        default: "rounded-[var(--radius-neo-xl)]",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      rounded: "default",
    },
  },
);

export type NeoButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof neoButtonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
  };

const NeoButton = React.forwardRef<HTMLButtonElement, NeoButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      asChild = false,
      loading = false,
      disabled,
      type: providedType,
      icon,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isIconVariant = variant === "icon";
    const actualSize = isIconVariant ? "icon" : size;

    // When asChild is true, pass children directly (Slot needs a single element child)
    const content = asChild ? (
      children
    ) : loading ? (
      <>
        <Loader2 className="animate-spin" />
        {!isIconVariant && children}
      </>
    ) : (
      <>
        {icon}
        {children}
      </>
    );

    return (
      <Comp
        ref={ref}
        {...(!asChild && {
          "data-slot": "neo-button",
          type: providedType ?? "button",
        })}
        className={cn(
          neoButtonVariants({ variant, size: actualSize, rounded, className }),
        )}
        disabled={disabled ?? loading}
        {...props}
      >
        {content}
      </Comp>
    );
  },
);

NeoButton.displayName = "NeoButton";

export { NeoButton, neoButtonVariants };
