import { buttonVariants } from "@/components/ui/button";
import { getMyFridgeAction } from "@/features/fridge/fridge.action";
import { Eggy } from "@/features/mascot";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { Timer } from "lucide-react";
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
    <Layout size="lg">
      <LayoutHeader>
        <div className="flex items-center gap-3">
          <Eggy mood="happy" size="md" className="hidden sm:block" />
          <div>
            <LayoutTitle className="font-heading">
              {fridge?.name ?? "Mon Frigo"}
            </LayoutTitle>
            <LayoutDescription>
              {role === "OWNER"
                ? "Suivez vos œufs et réduisez le gaspillage alimentaire"
                : `Frigo partagé par ${fridge?.owner.name ?? "un ami"}`}
            </LayoutDescription>
          </div>
        </div>
      </LayoutHeader>
      <LayoutActions>
        <Link
          href="/fridge/timer"
          className={buttonVariants({ variant: "neubrutalism-outline" })}
        >
          <Timer className="mr-2 size-4" />
          Minuteur
        </Link>
      </LayoutActions>
      <LayoutContent className="flex flex-col gap-6 lg:gap-8">
        <Suspense fallback={<StatsCardsSkeleton />}>
          <FridgeStatsCards />
        </Suspense>
        <EggBoxGrid eggBoxes={eggBoxes} canModify={role === "OWNER"} />
      </LayoutContent>
    </Layout>
  );
}

function FridgePageSkeleton() {
  return (
    <Layout size="lg">
      <LayoutHeader>
        <div className="flex items-center gap-3">
          <div className="bg-muted hidden size-12 animate-pulse rounded-full sm:block" />
          <div className="space-y-2">
            <div className="bg-muted h-8 w-48 animate-pulse rounded" />
            <div className="bg-muted h-4 w-64 animate-pulse rounded" />
          </div>
        </div>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-6 lg:gap-8">
        <StatsCardsSkeleton />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-muted h-48 animate-pulse rounded-2xl" />
          ))}
        </div>
      </LayoutContent>
    </Layout>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-muted h-32 animate-pulse rounded-2xl" />
      ))}
    </div>
  );
}
