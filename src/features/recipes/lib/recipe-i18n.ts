import type { Recipe, RecipeInstruction } from "../types";

/**
 * Get localized recipe name
 */
export function getRecipeName(recipe: Recipe, locale: string): string {
  return locale === "en" ? recipe.nameEn : recipe.name;
}

/**
 * Get localized recipe description
 */
export function getRecipeDescription(recipe: Recipe, locale: string): string {
  return locale === "en" ? recipe.descriptionEn : recipe.description;
}

/**
 * Get localized recipe tags
 */
export function getRecipeTags(recipe: Recipe, locale: string): string[] {
  return locale === "en" ? recipe.tagsEn : recipe.tags;
}

/**
 * Get localized instruction text
 */
export function getInstructionText(
  instruction: RecipeInstruction,
  locale: string,
): string {
  return locale === "en" ? instruction.textEn : instruction.text;
}

/**
 * Get localized chef tip
 */
export function getRecipeChefTip(
  recipe: Recipe,
  locale: string,
): string | undefined {
  if (!recipe.chefTip) return undefined;
  return locale === "en" ? recipe.chefTipEn : recipe.chefTip;
}

/**
 * Get localized safety note
 */
export function getRecipeSafetyNote(
  recipe: Recipe,
  locale: string,
): string | undefined {
  if (!recipe.safetyNote) return undefined;
  return locale === "en" ? recipe.safetyNoteEn : recipe.safetyNote;
}

/**
 * Get a fully localized recipe object
 */
export function getLocalizedRecipe(
  recipe: Recipe,
  locale: string,
): LocalizedRecipe {
  return {
    ...recipe,
    name: getRecipeName(recipe, locale),
    description: getRecipeDescription(recipe, locale),
    tags: getRecipeTags(recipe, locale),
    instructions: recipe.instructions.map((inst) => ({
      ...inst,
      text: getInstructionText(inst, locale),
    })),
  };
}

/**
 * Localized recipe type (with single language fields)
 */
export type LocalizedRecipe = Omit<
  Recipe,
  "nameEn" | "descriptionEn" | "tagsEn" | "chefTipEn" | "safetyNoteEn"
> & {
  instructions: Omit<RecipeInstruction, "textEn">[];
};
