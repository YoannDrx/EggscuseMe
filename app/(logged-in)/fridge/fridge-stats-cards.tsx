import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMyFridgeAction } from "@/features/fridge/fridge.action";
import {
  calculateFreshness,
  type FreshnessStatus,
} from "@/features/eggs/lib/freshness-calculator";
import { Coins, Egg, Leaf, TrendingUp } from "lucide-react";

export async function FridgeStatsCards() {
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
      {/* Total Eggs */}
      <Card variant="sunny">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Œufs suivis</CardTitle>
          <div className="bg-primary/10 flex size-9 items-center justify-center rounded-full">
            <Egg className="text-primary size-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="font-heading text-3xl font-bold">{totalEggs}</div>
          <p className="text-muted-foreground text-sm">
            dans {totalBoxes} boîte{totalBoxes !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      {/* Extra-Fresh */}
      <Card variant="sunny">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Extra-frais</CardTitle>
          <div className="bg-fresh-extra/20 flex size-9 items-center justify-center rounded-full">
            <Leaf className="text-fresh-extra size-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="font-heading text-fresh-extra text-3xl font-bold">
            {freshnessCounts["extra-fresh"]}
          </div>
          <p className="text-muted-foreground text-sm">
            Parfaits pour œufs à la coque
          </p>
        </CardContent>
      </Card>

      {/* Eggs Saved */}
      <Card variant="sunny">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Anti-gaspi</CardTitle>
          <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500/10">
            <TrendingUp className="size-5 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="font-heading text-3xl font-bold">{totalConsumed}</div>
          <p className="text-muted-foreground text-sm">
            œufs consommés, pas gaspillés
          </p>
        </CardContent>
      </Card>

      {/* Money Saved */}
      <Card variant="sunny">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Économies</CardTitle>
          <div className="bg-primary/10 flex size-9 items-center justify-center rounded-full">
            <Coins className="text-primary size-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="font-heading text-3xl font-bold">{moneySaved}€</div>
          <p className="text-muted-foreground text-sm">économisés environ</p>
        </CardContent>
      </Card>
    </div>
  );
}
