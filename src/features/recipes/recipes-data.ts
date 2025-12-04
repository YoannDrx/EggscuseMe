import type { Recipe } from "./types";

/**
 * Local database of egg recipes
 * Each recipe specifies compatible egg freshness levels
 */
export const RECIPES: Recipe[] = [
  // === EXTRA-FRESH RECIPES (raw or runny yolk) ===
  {
    id: "oeufs-coque",
    name: "Oeufs à la coque",
    nameEn: "Soft-boiled eggs",
    description:
      "Le classique du petit-déjeuner, avec des mouillettes beurrées. Jaune coulant parfait !",
    eggsRequired: 2,
    freshness: ["extra-fresh"],
    difficulty: "easy",
    time: 5,
    tags: ["petit-déjeuner", "rapide", "classique"],
  },
  {
    id: "oeufs-poches",
    name: "Oeufs pochés",
    nameEn: "Poached eggs",
    description:
      "Délicats et élégants, parfaits sur un toast à l'avocat ou une salade.",
    eggsRequired: 2,
    freshness: ["extra-fresh"],
    difficulty: "medium",
    time: 10,
    tags: ["brunch", "healthy", "élégant"],
  },
  {
    id: "mayonnaise-maison",
    name: "Mayonnaise maison",
    nameEn: "Homemade mayonnaise",
    description:
      "Onctueuse et savoureuse, bien meilleure que l'industrielle. Se conserve 3 jours au frigo.",
    eggsRequired: 1,
    freshness: ["extra-fresh"],
    difficulty: "medium",
    time: 10,
    tags: ["sauce", "accompagnement", "fait-maison"],
  },
  {
    id: "mousse-chocolat",
    name: "Mousse au chocolat",
    nameEn: "Chocolate mousse",
    description:
      "Un dessert incontournable, aérien et gourmand. Utilisez du bon chocolat !",
    eggsRequired: 4,
    freshness: ["extra-fresh"],
    difficulty: "medium",
    time: 30,
    tags: ["dessert", "chocolat", "gourmand"],
  },
  {
    id: "tiramisu",
    name: "Tiramisu",
    nameEn: "Tiramisu",
    description:
      "Le dessert italien par excellence, avec mascarpone et café. À préparer la veille !",
    eggsRequired: 4,
    freshness: ["extra-fresh"],
    difficulty: "medium",
    time: 30,
    tags: ["dessert", "italien", "café"],
  },

  // === FRESH RECIPES (can be slightly cooked) ===
  {
    id: "oeufs-brouilles",
    name: "Oeufs brouillés",
    nameEn: "Scrambled eggs",
    description:
      "Crémeux à souhait, avec une pointe de ciboulette. Le secret : cuisson douce !",
    eggsRequired: 3,
    freshness: ["extra-fresh", "fresh"],
    difficulty: "easy",
    time: 8,
    tags: ["petit-déjeuner", "rapide", "crémeux"],
  },
  {
    id: "oeufs-plat",
    name: "Oeufs au plat",
    nameEn: "Fried eggs",
    description:
      "Simple et efficace. Blanc bien cuit, jaune coulant. Parfait avec du bacon !",
    eggsRequired: 2,
    freshness: ["extra-fresh", "fresh"],
    difficulty: "easy",
    time: 5,
    tags: ["petit-déjeuner", "rapide", "simple"],
  },
  {
    id: "omelette",
    name: "Omelette",
    nameEn: "Omelette",
    description:
      "Baveuse ou bien cuite, nature ou garnie. La base de la cuisine aux oeufs !",
    eggsRequired: 3,
    freshness: ["extra-fresh", "fresh"],
    difficulty: "easy",
    time: 10,
    tags: ["repas", "polyvalent", "classique"],
  },
  {
    id: "croque-madame",
    name: "Croque-madame",
    nameEn: "Croque-madame",
    description:
      "Le croque-monsieur version luxe avec son oeuf au plat sur le dessus !",
    eggsRequired: 1,
    freshness: ["extra-fresh", "fresh"],
    difficulty: "easy",
    time: 15,
    tags: ["repas", "fromage", "gourmand"],
  },
  {
    id: "shakshuka",
    name: "Shakshuka",
    nameEn: "Shakshuka",
    description:
      "Oeufs pochés dans une sauce tomate épicée. Un plat du Moyen-Orient réconfortant.",
    eggsRequired: 4,
    freshness: ["extra-fresh", "fresh"],
    difficulty: "easy",
    time: 25,
    tags: ["brunch", "épicé", "végétarien"],
  },
  {
    id: "crepes",
    name: "Crêpes",
    nameEn: "Crepes",
    description:
      "Fines et légères, sucrées ou salées. Un incontournable pour toute la famille !",
    eggsRequired: 3,
    freshness: ["extra-fresh", "fresh"],
    difficulty: "easy",
    time: 30,
    tags: ["dessert", "goûter", "famille"],
  },
  {
    id: "gateau-yaourt",
    name: "Gâteau au yaourt",
    nameEn: "Yogurt cake",
    description:
      "Le gâteau préféré des enfants ! Simple, moelleux, impossible à rater.",
    eggsRequired: 3,
    freshness: ["extra-fresh", "fresh"],
    difficulty: "easy",
    time: 45,
    tags: ["dessert", "goûter", "enfants"],
  },

  // === COOK THOROUGHLY RECIPES (hard-boiled, fully cooked) ===
  {
    id: "oeufs-mimosa",
    name: "Oeufs mimosa",
    nameEn: "Deviled eggs",
    description:
      "Classique des buffets et pique-niques. Parfaits pour utiliser des oeufs plus anciens !",
    eggsRequired: 6,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "easy",
    time: 25,
    tags: ["apéritif", "buffet", "anti-gaspi"],
  },
  {
    id: "oeufs-durs",
    name: "Oeufs durs",
    nameEn: "Hard-boiled eggs",
    description:
      "La base pour salades, sandwichs ou à grignoter nature avec du sel.",
    eggsRequired: 4,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "easy",
    time: 12,
    tags: ["préparation", "polyvalent", "meal-prep"],
  },
  {
    id: "quiche-lorraine",
    name: "Quiche lorraine",
    nameEn: "Quiche Lorraine",
    description:
      "Lardons, crème, oeufs : le trio gagnant. Parfaite chaude ou froide.",
    eggsRequired: 4,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "medium",
    time: 60,
    tags: ["repas", "pique-nique", "classique"],
  },
  {
    id: "flan-patissier",
    name: "Flan pâtissier",
    nameEn: "French custard tart",
    description:
      "Crémeux et vanillé, avec ou sans pâte. Un dessert de boulangerie à la maison !",
    eggsRequired: 5,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "medium",
    time: 60,
    tags: ["dessert", "vanille", "boulangerie"],
  },
  {
    id: "clafoutis",
    name: "Clafoutis aux cerises",
    nameEn: "Cherry clafoutis",
    description:
      "Un dessert rustique du Limousin. Fonctionne aussi avec d'autres fruits !",
    eggsRequired: 4,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "easy",
    time: 45,
    tags: ["dessert", "fruits", "traditionnel"],
  },
  {
    id: "salade-nicoise",
    name: "Salade niçoise",
    nameEn: "Niçoise salad",
    description:
      "Thon, oeufs durs, olives, tomates... La fraîcheur du Sud en assiette !",
    eggsRequired: 2,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "easy",
    time: 20,
    tags: ["salade", "été", "healthy"],
  },
  {
    id: "cake-sale",
    name: "Cake salé",
    nameEn: "Savory loaf cake",
    description:
      "Olives, jambon, fromage... Idéal pour les apéros et pique-niques !",
    eggsRequired: 3,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "easy",
    time: 50,
    tags: ["apéritif", "pique-nique", "polyvalent"],
  },
  {
    id: "pain-perdu",
    name: "Pain perdu",
    nameEn: "French toast",
    description:
      "Le meilleur anti-gaspi ! Transforme le pain rassis en délice sucré.",
    eggsRequired: 2,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "easy",
    time: 15,
    tags: ["petit-déjeuner", "anti-gaspi", "sucré"],
  },
];

/**
 * Get a recipe by its ID
 */
export function getRecipeById(id: string): Recipe | undefined {
  return RECIPES.find((r) => r.id === id);
}

/**
 * Get all recipes for a specific freshness level
 */
export function getRecipesForFreshness(
  freshness: Recipe["freshness"][number],
): Recipe[] {
  return RECIPES.filter((r) => r.freshness.includes(freshness));
}

/**
 * Get recipes that can be made with a given number of eggs
 */
export function getRecipesForEggCount(count: number): Recipe[] {
  return RECIPES.filter((r) => r.eggsRequired <= count);
}
