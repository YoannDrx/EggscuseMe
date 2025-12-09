"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/**
 * Base skeleton component with shimmer animation
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-muted relative overflow-hidden rounded-md",
        "before:absolute before:inset-0",
        "before:translate-x-[-100%] before:animate-[shimmer_2s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        className,
      )}
      aria-busy="true"
      aria-live="polite"
      {...props}
    />
  );
}

/**
 * Skeleton for EggBox cards
 */
export function SkeletonEggBox({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-border bg-card rounded-2xl border p-[var(--space-card-padding)]",
        "flex flex-col gap-3",
        className,
      )}
    >
      {/* Header with icon and title */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Progress bar */}
      <Skeleton className="h-2 w-full rounded-full" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="size-8 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Skeleton for history cards
 */
export function SkeletonHistoryCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-border bg-card rounded-2xl border p-[var(--space-card-padding)]",
        "flex flex-col gap-3",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Name */}
      <Skeleton className="h-5 w-32" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="size-4 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for stats cards
 */
export function SkeletonStatsCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-border bg-card min-w-[140px] rounded-2xl border p-[var(--space-card-padding)]",
        "flex flex-col gap-2",
        className,
      )}
    >
      <Skeleton className="size-10 rounded-xl" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

/**
 * Skeleton for chart containers
 */
export function SkeletonChart({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-border bg-card rounded-2xl border p-4",
        "flex flex-col gap-4",
        className,
      )}
    >
      {/* Title */}
      <div className="flex items-center gap-2">
        <Skeleton className="size-5 rounded" />
        <Skeleton className="h-5 w-32" />
      </div>

      {/* Chart area */}
      <div className="flex h-[250px] items-end gap-2 md:h-[300px]">
        {[...Array(7)].map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t"
            style={{ height: `${30 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for recipe cards
 */
export function SkeletonRecipeCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-border bg-card overflow-hidden rounded-2xl border",
        className,
      )}
    >
      {/* Image */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />

      {/* Content */}
      <div className="space-y-2 p-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for mobile header
 */
export function SkeletonMobileHeader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-nav-border bg-nav-bg h-[var(--header-height-mobile)] border-b md:hidden",
        "flex items-center justify-between px-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="size-10 rounded-full" />
    </div>
  );
}

/**
 * Grid skeleton for multiple cards
 */
export function SkeletonGrid({
  count = 4,
  type = "egg-box",
  className,
}: {
  count?: number;
  type?: "egg-box" | "history" | "stats" | "recipe" | "chart";
  className?: string;
}) {
  const SkeletonComponent = {
    "egg-box": SkeletonEggBox,
    history: SkeletonHistoryCard,
    stats: SkeletonStatsCard,
    recipe: SkeletonRecipeCard,
    chart: SkeletonChart,
  }[type];

  return (
    <motion.div
      className={cn(
        "grid gap-3 md:gap-4",
        type === "stats" && "grid-cols-2 lg:grid-cols-4",
        type === "recipe" && "grid-cols-2 lg:grid-cols-3",
        (type === "egg-box" || type === "history") && "grid-cols-1",
        type === "chart" && "grid-cols-1 lg:grid-cols-2",
        className,
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {[...Array(count)].map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </motion.div>
  );
}

/**
 * Stats cards carousel skeleton
 */
export function SkeletonStatsCarousel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-3 overflow-x-auto pb-2",
        "-mx-4 px-4",
        "scrollbar-none",
        className,
      )}
    >
      {[...Array(4)].map((_, i) => (
        <SkeletonStatsCard key={i} className="shrink-0" />
      ))}
    </div>
  );
}

/**
 * Full page skeleton for dashboard
 */
export function SkeletonDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkeletonMobileHeader />
      <main className="flex-1 px-[var(--space-page-x)] py-[var(--space-page-y)]">
        <div className="space-y-[var(--space-section)]">
          <SkeletonStatsCarousel />
          <SkeletonGrid count={3} type="egg-box" />
        </div>
      </main>
    </div>
  );
}
