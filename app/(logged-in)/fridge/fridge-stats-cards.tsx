import { NeoStatCard } from "@/components/neo/neo-stat-card";
import {
  calculateFreshness,
  type FreshnessStatus,
} from "@/features/eggs/lib/freshness-calculator";
import { getMyFridgeAction } from "@/features/fridge/fridge.action";
import { Coins, Egg, Leaf, TrendingUp } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function FridgeStatsCards() {
  const t = await getTranslations("fridge.stats");
  const result = await getMyFridgeAction();
  const eggBoxes = result.data?.fridge.eggBoxes ?? [];

  // Calculate stats
  const totalBoxes = eggBoxes.length;
  const totalEggs = eggBoxes.reduce((sum, box) => sum + box.remaining, 0);
  const totalConsumed = eggBoxes.reduce(
    (sum, box) => sum + (box.quantity - box.remaining),
    0,
  );

  // Count eggs by freshness status
  const freshnessCounts: Record<FreshnessStatus, number> = {
    "extra-fresh": 0,
    fresh: 0,
    "cook-thoroughly": 0,
    expired: 0,
  };

  for (const box of eggBoxes) {
    const freshness = calculateFreshness(box.layingDate);
    freshnessCounts[freshness.status] += box.remaining;
  }

  // Estimate money saved (~0.25€ per egg not wasted)
  const moneySaved = (totalConsumed * 0.25).toFixed(2);

  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <NeoStatCard
        title={t("tracked.title")}
        value={totalEggs}
        icon={<Egg size={20} strokeWidth={2.5} />}
        trendLabel={t("tracked.inBoxes", { count: totalBoxes })}
      />

      <NeoStatCard
        title={t("extraFresh.title")}
        value={freshnessCounts["extra-fresh"]}
        icon={<Leaf size={20} strokeWidth={2.5} />}
        trendLabel={t("extraFresh.description")}
      />

      <NeoStatCard
        title={t("antiWaste.title")}
        value={totalConsumed}
        icon={<TrendingUp size={20} strokeWidth={2.5} />}
        trendLabel={t("antiWaste.description")}
      />

      <NeoStatCard
        title={t("savings.title")}
        value={`${moneySaved}€`}
        icon={<Coins size={20} strokeWidth={2.5} />}
        trendLabel={t("savings.description")}
      />
    </div>
  );
}
