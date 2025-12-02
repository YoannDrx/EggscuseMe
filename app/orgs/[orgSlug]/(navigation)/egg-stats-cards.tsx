import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrgEggBoxesAction } from "@/features/eggs";
import {
  calculateFreshness,
  type FreshnessStatus,
} from "@/features/eggs/lib/freshness-calculator";
import { Coins, Egg, Package, TrendingUp } from "lucide-react";

export async function EggStatsCards() {
  const result = await getOrgEggBoxesAction();
  const eggBoxes = result.data?.eggBoxes ?? [];

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
    <div className="flex w-full items-start gap-4 max-lg:flex-col lg:gap-8">
      <Card className="w-full flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Eggs Tracked</CardTitle>
          <Egg className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEggs}</div>
          <p className="text-muted-foreground text-xs">
            in {totalBoxes} box{totalBoxes !== 1 ? "es" : ""}
          </p>
        </CardContent>
      </Card>

      <Card className="w-full flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Extra-Fresh</CardTitle>
          <Package className="text-fresh-extra size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-fresh-extra text-2xl font-bold">
            {freshnessCounts["extra-fresh"]}
          </div>
          <p className="text-muted-foreground text-xs">
            Perfect for soft-boiled
          </p>
        </CardContent>
      </Card>

      <Card className="w-full flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Eggs Saved</CardTitle>
          <TrendingUp className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalConsumed}</div>
          <p className="text-muted-foreground text-xs">consumed, not wasted</p>
        </CardContent>
      </Card>

      <Card className="w-full flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Money Saved</CardTitle>
          <Coins className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{moneySaved}€</div>
          <p className="text-muted-foreground text-xs">estimated savings</p>
        </CardContent>
      </Card>
    </div>
  );
}
