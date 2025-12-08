import { getRecipeById, RECIPES } from "@/features/recipes";
import { RecipeDetailContent } from "@/features/recipes/recipe-detail-content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ recipeId: string }>;
};

export async function generateStaticParams() {
  return RECIPES.map((recipe) => ({
    recipeId: recipe.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { recipeId } = await params;
  const recipe = getRecipeById(recipeId);

  if (!recipe) {
    return {
      title: "Recette non trouvée",
    };
  }

  return {
    title: recipe.name,
    description: recipe.description,
  };
}

export default async function RecipeDetailPage({ params }: Props) {
  const { recipeId } = await params;
  const recipe = getRecipeById(recipeId);

  if (!recipe) {
    notFound();
  }

  return <RecipeDetailContent recipe={recipe} />;
}
