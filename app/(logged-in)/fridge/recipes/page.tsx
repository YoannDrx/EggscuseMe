import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MobileHeader } from "@/components/eggscuseme/navigation/mobile-header";
import { calculateFreshness } from "@/features/eggs/lib/freshness-calculator";
import { getMyFridgeAction } from "@/features/fridge/fridge.action";
import { Eggy } from "@/features/mascot";
import { getRecipeSuggestions, RecipeCard, RECIPES } from "@/features/recipes";
import { RecipeFiltersWithModal } from "@/features/recipes/components/recipe-filters-mobile";
import { RecipeGrid } from "@/features/recipes/components/recipe-grid";
import { ChefHat, Egg, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export default async function RecipesPage() {
  const t = await getTranslations("recipes.dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <MobileHeader
        title={t("title")}
        subtitle={t("count", { count: RECIPES.length })}
        mascot
        mascotMood="chef"
      />

      {/* Desktop Header */}
      <div className="hidden space-y-6 md:block">
        <div className="flex items-center gap-4">
          <Eggy mood="chef" size="lg" />
          <div>
            <h1 className="font-heading text-2xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-[var(--space-page-x)] py-[var(--space-page-y)] md:px-0">
        <div className="space-y-[var(--space-section)]">
          {/* Personalized suggestions */}
          <Suspense fallback={<SuggestionsLoading />}>
            <PersonalizedSuggestions />
          </Suspense>

          {/* All recipes */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChefHat className="text-primary size-5" />
              <h2 className="font-heading text-lg font-semibold md:text-xl">
                {t("allRecipes")}
              </h2>
              <Badge variant="secondary" className="hidden sm:flex">
                {RECIPES.length}
                </Badge>
              </div>
            </div>

            {/* Filters - Responsive with mobile bottom sheet */}
            <RecipeFiltersWithModal />

            {/* Recipe grid with filtering */}
            <RecipeGrid />
          </section>
        </div>
      </main>
    </div>
  );
}

async function PersonalizedSuggestions() {
  const t = await getTranslations("recipes.dashboard");
  const result = await getMyFridgeAction();
  const eggBoxes = result.data?.fridge.eggBoxes ?? [];

  if (eggBoxes.length === 0) {
    return (
      <Card variant="sunny" className="bg-muted/50">
        <CardContent className="flex items-center gap-3 p-4 md:gap-4 md:py-6">
          <Eggy mood="sad" size="md" className="shrink-0" />
          <div className="min-w-0">
            <p className="font-medium">{t("personalized.emptyTitle")}</p>
            <p className="text-muted-foreground text-sm">
              {t("personalized.emptyDescription")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate freshness for each box
  const eggBoxesWithFreshness = eggBoxes.map((box) => {
    const { status, daysRemaining } = calculateFreshness(box.layingDate);
    return {
      id: box.id,
      name: box.name,
      remaining: box.remaining,
      daysRemaining,
      freshness: status,
    };
  });

  const suggestions = getRecipeSuggestions(eggBoxesWithFreshness, 6);
  const hasUrgent = suggestions.some((s) => s.urgency === "high");

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3 md:space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="text-primary size-5" />
        <h2 className="font-heading text-lg font-semibold md:text-xl">
          {hasUrgent ? t("personalized.urgentTitle") : t("personalized.title")}
        </h2>
        <Badge
          variant={hasUrgent ? "destructive" : "secondary"}
          className="gap-1"
        >
          <Egg className="size-3" />
          {t("personalized.totalEggs", {
            count: eggBoxesWithFreshness.reduce(
              (sum, box) => sum + box.remaining,
              0,
            ),
          })}
        </Badge>
      </div>

      {hasUrgent && (
        <Card variant="sunny" className="border-fresh-cook bg-fresh-cook/5">
          <CardContent className="flex items-start gap-3 p-3 md:py-4">
            <Eggy mood="worried" size="sm" className="shrink-0" />
            <p className="text-sm">{t("personalized.urgentNotice")}</p>
          </CardContent>
        </Card>
      )}

      {/* Mobile: 2 columns, scroll horizontally if needed */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        {suggestions.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}

function SuggestionsLoading() {
  return (
    <section className="space-y-3 md:space-y-4">
      <div className="flex items-center gap-2">
        <div className="bg-muted size-5 animate-pulse rounded" />
        <div className="bg-muted h-6 w-32 animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-muted h-40 animate-pulse rounded-xl md:h-48"
          />
        ))}
      </div>
    </section>
  );
}
