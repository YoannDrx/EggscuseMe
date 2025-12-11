"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoLabelVariants = cva("text-neo-text font-medium", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
    required: {
      true: "after:content-['*'] after:ml-0.5 after:text-destructive",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    required: false,
  },
});

export type NeoLabelProps = React.ComponentProps<"label"> &
  VariantProps<typeof neoLabelVariants> & {
    description?: string;
  };

const NeoLabel = React.forwardRef<HTMLLabelElement, NeoLabelProps>(
  ({ className, size, required, description, children, ...props }, ref) => (
    <div className="space-y-1">
      <label
        ref={ref}
        data-slot="neo-label"
        className={cn(neoLabelVariants({ size, required, className }))}
        {...props}
      >
        {children}
      </label>
      {description && (
        <p className="text-neo-text-muted text-xs">{description}</p>
      )}
    </div>
  ),
);
NeoLabel.displayName = "NeoLabel";

export { NeoLabel, neoLabelVariants };
