import { getRecipeById, RECIPES } from "@/features/recipes";
import { RecipeDetailContent } from "@/features/recipes/recipe-detail-content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations("recipes.detail");

  if (!recipe) {
    return {
      title: t("notFoundTitle", { default: "Recipe not found" }),
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
