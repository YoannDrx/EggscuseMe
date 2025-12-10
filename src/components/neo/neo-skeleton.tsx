"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoSkeletonVariants = cva(
  [
    "animate-pulse",
    "bg-neo-border/20",
    "border-[1px] border-neo-border/10",
  ].join(" "),
  {
    variants: {
      variant: {
        // Basic rectangular skeleton
        rectangular: "rounded-[var(--radius-neo-md)]",
        // Circular skeleton (for avatars)
        circular: "rounded-full",
        // Text line skeleton
        text: "rounded-[var(--radius-neo-sm)] h-4",
        // Card skeleton
        card: "rounded-[var(--radius-neo-xl)]",
        // Button skeleton
        button: "rounded-[var(--radius-neo-xl)] h-11",
      },
    },
    defaultVariants: {
      variant: "rectangular",
    },
  },
);

export type NeoSkeletonProps = React.ComponentProps<"div"> &
  VariantProps<typeof neoSkeletonVariants> & {
    width?: string | number;
    height?: string | number;
  };

const NeoSkeleton = React.forwardRef<HTMLDivElement, NeoSkeletonProps>(
  ({ className, variant, width, height, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="neo-skeleton"
        className={cn(neoSkeletonVariants({ variant, className }))}
        style={{
          width: width,
          height: height,
          ...style,
        }}
        {...props}
      />
    );
  },
);

NeoSkeleton.displayName = "NeoSkeleton";

// Pre-composed skeleton components for common use cases

type NeoSkeletonTextProps = {
  lines?: number;
  className?: string;
};

const NeoSkeletonText: React.FC<NeoSkeletonTextProps> = ({
  lines = 3,
  className,
}) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <NeoSkeleton
          key={i}
          variant="text"
          className={cn(i === lines - 1 && "w-3/4")}
        />
      ))}
    </div>
  );
};

type NeoSkeletonCardProps = {
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  className?: string;
};

const NeoSkeletonCard: React.FC<NeoSkeletonCardProps> = ({
  showImage = true,
  showTitle = true,
  showDescription = true,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-neo-card p-4",
        "border-neo-border/20 border-[length:var(--border-neo)]",
        "rounded-[var(--radius-neo-xl)]",
        "shadow-[var(--shadow-neo-sm)]",
        className,
      )}
    >
      {showImage && (
        <NeoSkeleton variant="rectangular" className="mb-4 h-32 w-full" />
      )}
      {showTitle && <NeoSkeleton variant="text" className="mb-2 w-3/4" />}
      {showDescription && <NeoSkeletonText lines={2} />}
    </div>
  );
};

type NeoSkeletonAvatarProps = {
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
};

const NeoSkeletonAvatar: React.FC<NeoSkeletonAvatarProps> = ({
  size = "md",
  showName = false,
  className,
}) => {
  const sizeClasses = {
    sm: "size-8",
    md: "size-10",
    lg: "size-12",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <NeoSkeleton variant="circular" className={sizeClasses[size]} />
      {showName && (
        <div className="flex flex-col gap-1">
          <NeoSkeleton variant="text" className="w-24" />
          <NeoSkeleton variant="text" className="w-16" />
        </div>
      )}
    </div>
  );
};

export {
  NeoSkeleton,
  NeoSkeletonText,
  NeoSkeletonCard,
  NeoSkeletonAvatar,
  neoSkeletonVariants,
};
