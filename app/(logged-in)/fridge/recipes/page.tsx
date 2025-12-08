import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { calculateFreshness } from "@/features/eggs/lib/freshness-calculator";
import { getMyFridgeAction } from "@/features/fridge/fridge.action";
import { Eggy } from "@/features/mascot";
import { getRecipeSuggestions, RecipeCard, RECIPES } from "@/features/recipes";
import { RecipeFilters } from "@/features/recipes/components/recipe-filters";
import { RecipeGrid } from "@/features/recipes/components/recipe-grid";
import { ChefHat, Egg, Sparkles } from "lucide-react";
import { Suspense } from "react";

export default function RecipesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Eggy mood="chef" size="lg" />
        <div>
          <h1 className="font-heading text-2xl font-bold">Recettes</h1>
          <p className="text-muted-foreground">
            Des idées pour cuisiner vos œufs selon leur fraîcheur
          </p>
        </div>
      </div>

      {/* Personalized suggestions */}
      <Suspense fallback={<SuggestionsLoading />}>
        <PersonalizedSuggestions />
      </Suspense>

      {/* All recipes */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ChefHat className="text-primary size-5" />
          <h2 className="font-heading text-xl font-semibold">
            Toutes les recettes
          </h2>
          <Badge variant="secondary">{RECIPES.length}</Badge>
        </div>

        {/* Filters */}
        <RecipeFilters />

        {/* Recipe grid with filtering */}
        <RecipeGrid />
      </section>
    </div>
  );
}

async function PersonalizedSuggestions() {
  const result = await getMyFridgeAction();
  const eggBoxes = result.data?.fridge.eggBoxes ?? [];

  if (eggBoxes.length === 0) {
    return (
      <Card variant="sunny" className="bg-muted/50">
        <CardContent className="flex items-center gap-4 py-6">
          <Eggy mood="sad" size="md" />
          <div>
            <p className="font-medium">Pas d&apos;œufs dans votre frigo</p>
            <p className="text-muted-foreground text-sm">
              Ajoutez des boîtes d&apos;œufs pour recevoir des suggestions
              personnalisées !
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
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="text-primary size-5" />
        <h2 className="font-heading text-xl font-semibold">
          {hasUrgent ? "Suggestions anti-gaspi" : "Pour vous"}
        </h2>
        <Badge
          variant={hasUrgent ? "destructive" : "secondary"}
          className="gap-1"
        >
          <Egg className="size-3" />
          {eggBoxesWithFreshness.reduce(
            (sum, box) => sum + box.remaining,
            0,
          )}{" "}
          œufs
        </Badge>
      </div>

      {hasUrgent && (
        <Card variant="sunny" className="border-fresh-cook bg-fresh-cook/5">
          <CardContent className="flex items-start gap-3 py-4">
            <Eggy mood="worried" size="sm" />
            <p className="text-sm">
              <strong>Attention !</strong> Certains de vos œufs arrivent bientôt
              à expiration. Voici des recettes pour les utiliser avant
              qu&apos;il ne soit trop tard !
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}

function SuggestionsLoading() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="bg-muted size-5 animate-pulse rounded" />
        <div className="bg-muted h-6 w-32 animate-pulse rounded" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-muted h-48 animate-pulse rounded-xl" />
        ))}
      </div>
    </section>
  );
}
