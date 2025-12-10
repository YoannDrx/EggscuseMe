"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoAvatarVariants = cva(
  [
    "relative inline-flex items-center justify-center overflow-hidden",
    "border-[length:var(--border-neo)]",
    "bg-neo-accent/20",
    "shadow-[var(--shadow-neo-sm)]",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "size-6 text-xs",
        sm: "size-8 text-sm",
        md: "size-10 text-base",
        lg: "size-12 text-lg",
        xl: "size-16 text-xl",
        "2xl": "size-20 text-2xl",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-[var(--radius-neo-md)]",
        rounded: "rounded-[var(--radius-neo-lg)]",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "circle",
    },
  },
);

const statusSizes = {
  xs: "size-2",
  sm: "size-2.5",
  md: "size-3",
  lg: "size-3.5",
  xl: "size-4",
  "2xl": "size-5",
};

const statusColors = {
  online: "bg-success",
  offline: "bg-neo-text-muted",
  busy: "bg-destructive",
  away: "bg-warning",
};

export type NeoAvatarProps = React.ComponentProps<"div"> &
  VariantProps<typeof neoAvatarVariants> & {
    src?: string;
    alt?: string;
    fallback?: string;
    status?: "online" | "offline" | "busy" | "away";
  };

const NeoAvatar = React.forwardRef<HTMLDivElement, NeoAvatarProps>(
  (
    { className, size = "md", shape, src, alt, fallback, status, ...props },
    ref,
  ) => {
    const [imageError, setImageError] = React.useState(false);

    const showFallback = !src || imageError;

    // Generate initials from fallback or alt
    const initials = React.useMemo(() => {
      const text = fallback ?? alt ?? "";
      return text
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }, [fallback, alt]);

    return (
      <div
        ref={ref}
        data-slot="neo-avatar"
        className={cn(
          neoAvatarVariants({ size, shape, className }),
          "border-neo-border",
        )}
        {...props}
      >
        {showFallback ? (
          <span className="text-neo-accent font-bold select-none">
            {initials}
          </span>
        ) : (
          <img
            src={src}
            alt={alt ?? "Avatar"}
            onError={() => setImageError(true)}
            className="size-full object-cover"
          />
        )}

        {status && (
          <span
            className={cn(
              "absolute right-0 bottom-0",
              statusSizes[size ?? "md"],
              statusColors[status],
              "rounded-full",
              "border-neo-card border-[2px]",
              "ring-neo-card ring-2",
            )}
          />
        )}
      </div>
    );
  },
);

NeoAvatar.displayName = "NeoAvatar";

export { NeoAvatar, neoAvatarVariants };
