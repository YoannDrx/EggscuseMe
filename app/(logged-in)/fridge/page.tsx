import { MobileHeader } from "@/components/eggscuseme/navigation/mobile-header";
import { MobileSettingsButton } from "@/components/eggscuseme/navigation/mobile-settings-button";
import { getMyFridgeAction } from "@/features/fridge/fridge.action";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { EggBoxGrid } from "./egg-box-grid";
import { FridgeStatsCards } from "./fridge-stats-cards";

export default function FridgePage() {
  return (
    <Suspense fallback={<FridgePageSkeleton />}>
      <FridgePageContent />
    </Suspense>
  );
}

async function FridgePageContent() {
  const t = await getTranslations("fridge");
  const result = await getMyFridgeAction();
  const fridge = result.data?.fridge;
  const role = result.data?.role ?? "GUEST";
  const eggBoxes = fridge?.eggBoxes ?? [];

  return (
    <div className="bg-neo-bg flex min-h-screen flex-col">
      {/* Mobile Header - Using new standardized component */}
      <MobileHeader
        title={fridge?.name ?? t("defaultName")}
        subtitle={t("boxCount", { count: eggBoxes.length })}
        showBack={false}
        mascot
        mascotMood="happy"
        rightAction={<MobileSettingsButton isOwner={role === "OWNER"} />}
      />

      {/* Main Content */}
      <main className="flex-1 px-[var(--space-page-x)] pt-2 pb-[var(--space-page-y)] sm:px-6 sm:py-[var(--space-page-y)]">
        <div className="mx-auto max-w-7xl space-y-[var(--space-section)]">
          {/* Stats Cards - Horizontal scroll on mobile */}
          <Suspense fallback={<StatsCardsSkeleton />}>
            <FridgeStatsCards />
          </Suspense>

          {/* Egg Boxes Grid */}
          <EggBoxGrid eggBoxes={eggBoxes} canModify={role === "OWNER"} />
        </div>
      </main>
    </div>
  );
}

function FridgePageSkeleton() {
  return (
    <div className="bg-neo-bg flex min-h-screen flex-col">
      {/* Header Skeleton - Mobile only */}
      <div className="border-nav-border bg-nav-bg h-[var(--header-height-mobile)] border-b md:hidden">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="bg-muted size-10 animate-pulse rounded-full" />
            <div className="space-y-2">
              <div className="bg-muted h-5 w-28 animate-pulse rounded" />
              <div className="bg-muted h-3 w-20 animate-pulse rounded" />
            </div>
          </div>
          <div className="bg-muted size-10 animate-pulse rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <main className="flex-1 px-[var(--space-page-x)] py-[var(--space-page-y)] sm:px-6">
        <div className="mx-auto max-w-7xl space-y-[var(--space-section)]">
          <StatsCardsSkeleton />
          <div className="space-y-[var(--space-card-gap)]">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card h-36 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="border-border bg-card h-24 min-w-[140px] shrink-0 animate-pulse rounded-2xl border sm:min-w-0"
        />
      ))}
    </div>
  );
}
