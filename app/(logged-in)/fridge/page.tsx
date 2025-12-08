import { getMyFridgeAction } from "@/features/fridge/fridge.action";
import { Eggy } from "@/features/mascot";
import { User } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
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
    <div className="bg-background flex min-h-screen flex-col">
      {/* Mobile Header - Hidden on desktop (desktop uses sidebar header) */}
      <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Eggy mood="happy" size="sm" />
            <div>
              <h1 className="text-foreground text-xl font-bold">
                {fridge?.name ?? t("defaultName")}
              </h1>
              <p className="text-muted-foreground text-xs">
                {t("boxCount", { count: eggBoxes.length })}
              </p>
            </div>
          </div>
          <Link
            href="/fridge/settings/profile"
            className="bg-primary/20 hover:bg-primary/30 flex size-9 items-center justify-center rounded-full transition-colors"
          >
            <User className="text-primary size-4" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Stats Cards */}
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
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header Skeleton - Mobile only */}
      <header className="border-border bg-background border-b md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="bg-muted size-10 animate-pulse rounded-full" />
            <div className="space-y-2">
              <div className="bg-muted h-6 w-32 animate-pulse rounded" />
              <div className="bg-muted h-3 w-24 animate-pulse rounded" />
            </div>
          </div>
          <div className="bg-muted size-9 animate-pulse rounded-full" />
        </div>
      </header>

      {/* Content Skeleton */}
      <main className="flex-1 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <StatsCardsSkeleton />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card h-40 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="border-border bg-card h-24 animate-pulse rounded-2xl border"
        />
      ))}
    </div>
  );
}
