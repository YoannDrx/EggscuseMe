"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoTitleVariants = cva(
  // Base styles
  ["font-bold tracking-tight", "text-neo-text"].join(" "),
  {
    variants: {
      size: {
        xs: "text-lg",
        sm: "text-xl",
        md: "text-2xl",
        lg: "text-3xl sm:text-4xl",
        xl: "text-4xl sm:text-5xl",
        "2xl": "text-5xl sm:text-6xl",
      },
      underline: {
        none: "",
        // Highlight effect - yellow background behind text
        highlight: "relative inline-block neo-title-highlight",
        // Dashed underline
        dashed: "border-b-[3px] border-dashed border-neo-border pb-1",
        // Solid underline with accent color
        solid: "border-b-[3px] border-neo-accent pb-1",
      },
      color: {
        default: "text-neo-text",
        primary: "text-neo-accent",
        muted: "text-neo-text-muted",
      },
    },
    defaultVariants: {
      size: "lg",
      underline: "none",
      color: "default",
    },
  },
);

type TitleElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p";

export type NeoTitleProps<T extends TitleElement = "h2"> = {
  as?: T;
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof neoTitleVariants> &
  Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const NeoTitle = React.forwardRef<HTMLHeadingElement, NeoTitleProps>(
  (
    {
      as: Component = "h2",
      size,
      underline,
      color,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref as React.Ref<HTMLHeadingElement>}
        data-slot="neo-title"
        className={cn(neoTitleVariants({ size, underline, color, className }))}
        {...props}
      >
        {children}
        {/* Highlight pseudo-element rendered via CSS */}
      </Component>
    );
  },
);

NeoTitle.displayName = "NeoTitle";

export { NeoTitle, neoTitleVariants };
