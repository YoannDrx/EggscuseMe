import { getMyFridgeAction } from "@/features/fridge/fridge.action";
import { Eggy } from "@/features/mascot";
import { User } from "lucide-react";
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
  const result = await getMyFridgeAction();
  const fridge = result.data?.fridge;
  const role = result.data?.role ?? "GUEST";
  const eggBoxes = fridge?.eggBoxes ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-stone-950">
      {/* Mobile Header - Hidden on desktop (desktop uses sidebar header) */}
      <header className="sticky top-0 z-40 border-b border-stone-800 bg-stone-950/80 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Eggy mood="happy" size="sm" />
            <div>
              <h1 className="text-xl font-bold text-white">
                {fridge?.name ?? "Mon Frigo"}
              </h1>
              <p className="text-xs text-stone-500">
                {eggBoxes.length} boite{eggBoxes.length > 1 ? "s" : ""} en cours
              </p>
            </div>
          </div>
          <Link
            href="/fridge/settings/profile"
            className="flex size-9 items-center justify-center rounded-full bg-amber-400/20 transition-colors hover:bg-amber-400/30"
          >
            <User className="size-4 text-amber-400" />
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
    <div className="flex min-h-screen flex-col bg-stone-950">
      {/* Header Skeleton - Mobile only */}
      <header className="border-b border-stone-800 bg-stone-950 md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="size-10 animate-pulse rounded-full bg-stone-800" />
            <div className="space-y-2">
              <div className="h-6 w-32 animate-pulse rounded bg-stone-800" />
              <div className="h-3 w-24 animate-pulse rounded bg-stone-800" />
            </div>
          </div>
          <div className="size-9 animate-pulse rounded-full bg-stone-800" />
        </div>
      </header>

      {/* Content Skeleton */}
      <main className="flex-1 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <StatsCardsSkeleton />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl bg-stone-900"
              />
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
          className="h-24 animate-pulse rounded-2xl border border-stone-800 bg-stone-900"
        />
      ))}
    </div>
  );
}
