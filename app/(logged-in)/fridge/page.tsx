import { getMyFridgeAction } from "@/features/fridge/fridge.action";
import { Eggy } from "@/features/mascot";
import { Timer, ChefHat, BarChart3, User } from "lucide-react";
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
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-stone-800 bg-stone-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Eggy mood="happy" size="sm" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {fridge?.name ?? "Mon Frigo"}
              </h1>
              <p className="text-xs text-stone-500">
                {eggBoxes.length} boite{eggBoxes.length > 1 ? "s" : ""} en cours
              </p>
            </div>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-amber-400/20">
            <User className="size-4 text-amber-400" />
          </div>
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

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-800 bg-stone-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm sm:hidden">
        <div className="grid h-16 grid-cols-4">
          <NavItem href="/fridge" icon={FridgeIcon} label="Frigo" active />
          <NavItem href="/fridge/timer" icon={Timer} label="Timer" />
          <NavItem href="/fridge/guide" icon={ChefHat} label="Guide" />
          <NavItem href="/fridge/stats" icon={BarChart3} label="Stats" />
        </div>
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="h-16 sm:hidden" />
    </div>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-1 transition-colors ${
        active
          ? "bg-amber-400/10 text-amber-400"
          : "text-stone-500 hover:text-stone-300"
      }`}
    >
      <Icon className="size-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}

function FridgeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 2h16a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
      <path d="M3 9h18" />
      <path d="M7 5v2" />
      <path d="M7 12v5" />
    </svg>
  );
}

function FridgePageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-950">
      {/* Header Skeleton */}
      <header className="border-b border-stone-800 bg-stone-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="hidden size-10 animate-pulse rounded-full bg-stone-800 sm:block" />
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
