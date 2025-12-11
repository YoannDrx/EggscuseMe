"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const neoTextVariants = cva(
  // Base styles
  ["font-medium leading-relaxed"].join(" "),
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        black: "font-black",
      },
      muted: {
        true: "text-neo-text-muted",
        false: "text-neo-text",
      },
    },
    defaultVariants: {
      size: "md",
      weight: "medium",
      muted: false,
    },
  },
);

export type NeoTextProps = VariantProps<typeof neoTextVariants> & {
  as?: "p" | "span" | "div" | "label";
  className?: string;
  children?: React.ReactNode;
};

const NeoText = ({
  className,
  size,
  weight,
  muted,
  as: Component = "p",
  children,
  ...props
}: NeoTextProps) => (
  <Component
    data-slot="neo-text"
    className={cn(neoTextVariants({ size, weight, muted, className }))}
    {...props}
  >
    {children}
  </Component>
);
NeoText.displayName = "NeoText";

export { NeoText, neoTextVariants };
