"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoCardVariants = cva(
  // Base styles
  [
    "rounded-[var(--radius-neo-2xl)]",
    "border-[length:var(--border-neo)]",
    "transition-all duration-200",
  ].join(" "),
  {
    variants: {
      variant: {
        // Default - Static card with shadow
        default: [
          "bg-neo-card text-neo-text",
          "border-neo-border/20",
          "shadow-[var(--shadow-neo-md)]",
        ].join(" "),
        // Elevated - More prominent shadow
        elevated: [
          "bg-neo-card text-neo-text",
          "border-neo-border/30",
          "shadow-[var(--shadow-neo-lg)]",
        ].join(" "),
        // Interactive - Clickable with hover effects
        interactive: [
          "bg-neo-card text-neo-text",
          "border-neo-border/20",
          "shadow-[var(--shadow-neo-md)]",
          "cursor-pointer",
          "hover:-translate-y-1 hover:shadow-[var(--shadow-neo-lg)]",
          "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        ].join(" "),
        // Outline - Transparent with visible border
        outline: ["bg-transparent text-neo-text", "border-neo-border/40"].join(
          " ",
        ),
        // Dashed - Dotted border for add actions
        dashed: [
          "bg-transparent text-neo-text-muted",
          "border-neo-border/30 border-dashed",
          "hover:bg-neo-card/50 hover:border-neo-border/50 hover:text-neo-text",
          "cursor-pointer transition-colors",
        ].join(" "),
        // Accent - Primary color tinted
        accent: [
          "bg-neo-accent/10 text-neo-text",
          "border-neo-accent/40",
          "shadow-[4px_4px_0px_var(--neo-accent)]",
        ].join(" "),
        // Ghost - Minimal styling
        ghost: ["bg-transparent text-neo-text", "border-transparent"].join(" "),
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-5",
        lg: "p-6",
        xl: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  },
);

export type NeoCardProps = React.ComponentProps<"div"> &
  VariantProps<typeof neoCardVariants>;

const NeoCard = React.forwardRef<HTMLDivElement, NeoCardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="neo-card"
      className={cn(neoCardVariants({ variant, padding, className }))}
      {...props}
    />
  ),
);
NeoCard.displayName = "NeoCard";

// Card Header
const NeoCardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="neo-card-header"
    className={cn("flex flex-col gap-1.5", className)}
    {...props}
  />
));
NeoCardHeader.displayName = "NeoCardHeader";

// Card Title
const NeoCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<"h3">
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    data-slot="neo-card-title"
    className={cn("text-neo-text text-xl font-bold tracking-tight", className)}
    {...props}
  />
));
NeoCardTitle.displayName = "NeoCardTitle";

// Card Description
const NeoCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="neo-card-description"
    className={cn("text-neo-text-muted text-sm", className)}
    {...props}
  />
));
NeoCardDescription.displayName = "NeoCardDescription";

// Card Content
const NeoCardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="neo-card-content"
    className={cn("", className)}
    {...props}
  />
));
NeoCardContent.displayName = "NeoCardContent";

// Card Footer
const NeoCardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="neo-card-footer"
    className={cn("flex items-center gap-3 pt-4", className)}
    {...props}
  />
));
NeoCardFooter.displayName = "NeoCardFooter";

export {
  NeoCard,
  NeoCardHeader,
  NeoCardTitle,
  NeoCardDescription,
  NeoCardContent,
  NeoCardFooter,
  neoCardVariants,
};
