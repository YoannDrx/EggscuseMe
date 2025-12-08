import type { Recipe } from "./types";

/**
 * Complete database of egg recipes with detailed instructions
 * Each recipe specifies compatible egg freshness levels and step-by-step instructions
 */
export const RECIPES: Recipe[] = [
  // ============================================
  // EXTRA-FRESH RECIPES (0-9 days) - Raw or runny yolk
  // ============================================
  {
    id: "oeufs-coque",
    name: "Oeufs à la coque",
    nameEn: "Soft-boiled eggs",
    description:
      "Le classique du petit-déjeuner, avec des mouillettes beurrées. Jaune coulant parfait !",
    descriptionEn:
      "The classic breakfast dish with buttered toast soldiers. Perfect runny yolk!",
    eggsRequired: 2,
    freshness: ["extra-fresh"],
    difficulty: "easy",
    time: 5,
    image:
      "https://images.unsplash.com/photo-1482049016530-d79ae00e6e9b?w=800&h=600&fit=crop&q=80",
    tags: ["petit-déjeuner", "rapide", "classique"],
    tagsEn: ["breakfast", "quick", "classic"],
    servings: 1,
    instructions: [
      {
        step: 1,
        text: "Faire bouillir une casserole d'eau.",
        textEn: "Bring a pot of water to a boil.",
      },
      {
        step: 2,
        text: "Plonger délicatement les oeufs dans l'eau bouillante pendant 3-4 minutes.",
        textEn: "Gently lower the eggs into boiling water for 3-4 minutes.",
      },
      {
        step: 3,
        text: "Les passer rapidement sous l'eau froide pour stopper la cuisson.",
        textEn: "Briefly run them under cold water to stop the cooking.",
      },
      {
        step: 4,
        text: "Casser le haut de la coquille et servir avec des mouillettes beurrées.",
        textEn:
          "Crack the top of the shell and serve with buttered toast soldiers.",
      },
    ],
  },
  {
    id: "oeufs-poches",
    name: "Oeufs pochés",
    nameEn: "Poached eggs",
    description:
      "Délicats et élégants, parfaits sur un toast à l'avocat ou une salade.",
    descriptionEn: "Delicate and elegant, perfect on avocado toast or salad.",
    eggsRequired: 2,
    freshness: ["extra-fresh"],
    difficulty: "medium",
    time: 10,
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop&q=80",
    tags: ["brunch", "healthy", "élégant"],
    tagsEn: ["brunch", "healthy", "elegant"],
    servings: 1,
    instructions: [
      {
        step: 1,
        text: "Chauffer une casserole d'eau avec un trait de vinaigre blanc (sans bouillir à gros bouillons).",
        textEn:
          "Heat a pot of water with a splash of white vinegar (don't let it boil vigorously).",
      },
      {
        step: 2,
        text: "Casser chaque oeuf dans une petite tasse ou ramequin.",
        textEn: "Crack each egg into a small cup or ramekin.",
      },
      {
        step: 3,
        text: "Créer un tourbillon dans l'eau avec une cuillère et verser l'oeuf au centre.",
        textEn:
          "Create a whirlpool in the water with a spoon and pour the egg into the center.",
      },
      {
        step: 4,
        text: "Pocher 2-3 minutes jusqu'à ce que le blanc soit pris.",
        textEn: "Poach for 2-3 minutes until the white is set.",
      },
      {
        step: 5,
        text: "Égoutter sur du papier absorbant et servir sur toast ou salade.",
        textEn: "Drain on paper towels and serve on toast or salad.",
      },
    ],
  },
  {
    id: "mayonnaise-maison",
    name: "Mayonnaise maison",
    nameEn: "Homemade mayonnaise",
    description:
      "Onctueuse et savoureuse, bien meilleure que l'industrielle. Se conserve 3 jours au frigo.",
    descriptionEn:
      "Smooth and flavorful, much better than store-bought. Keeps 3 days in the fridge.",
    eggsRequired: 1,
    freshness: ["extra-fresh"],
    difficulty: "medium",
    time: 10,
    image:
      "https://images.unsplash.com/photo-1587411768638-ec71f8e33b78?w=800&h=600&fit=crop&q=80",
    tags: ["sauce", "accompagnement", "fait-maison"],
    tagsEn: ["sauce", "side", "homemade"],
    servings: 4,
    instructions: [
      {
        step: 1,
        text: "Mettre le jaune d'oeuf, une cuillère à café de moutarde, sel et poivre dans un bol.",
        textEn:
          "Put the egg yolk, a teaspoon of mustard, salt and pepper in a bowl.",
      },
      {
        step: 2,
        text: "Fouetter énergiquement tout en ajoutant l'huile en filet très fin.",
        textEn: "Whisk vigorously while adding oil in a very thin stream.",
      },
      {
        step: 3,
        text: "Continuer jusqu'à obtenir une émulsion épaisse et crémeuse.",
        textEn: "Continue until you get a thick, creamy emulsion.",
      },
      {
        step: 4,
        text: "Ajuster avec un peu de citron ou vinaigre selon votre goût.",
        textEn: "Adjust with a little lemon juice or vinegar to taste.",
      },
    ],
  },
  {
    id: "mousse-chocolat",
    name: "Mousse au chocolat",
    nameEn: "Chocolate mousse",
    description:
      "Un dessert incontournable, aérien et gourmand. Utilisez du bon chocolat !",
    descriptionEn:
      "An essential dessert, light and indulgent. Use good quality chocolate!",
    eggsRequired: 4,
    freshness: ["extra-fresh"],
    difficulty: "medium",
    time: 30,
    image:
      "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800&h=600&fit=crop&q=80",
    tags: ["dessert", "chocolat", "gourmand"],
    tagsEn: ["dessert", "chocolate", "indulgent"],
    servings: 6,
    instructions: [
      {
        step: 1,
        text: "Séparer les blancs des jaunes d'oeufs.",
        textEn: "Separate the egg whites from the yolks.",
      },
      {
        step: 2,
        text: "Faire fondre 200g de chocolat au bain-marie et laisser tiédir.",
        textEn:
          "Melt 200g of chocolate in a double boiler and let it cool slightly.",
      },
      {
        step: 3,
        text: "Incorporer les jaunes d'oeufs au chocolat fondu en mélangeant bien.",
        textEn: "Mix the egg yolks into the melted chocolate, stirring well.",
      },
      {
        step: 4,
        text: "Monter les blancs en neige ferme avec une pincée de sel.",
        textEn:
          "Beat the egg whites until stiff peaks form with a pinch of salt.",
      },
      {
        step: 5,
        text: "Incorporer délicatement les blancs au chocolat en soulevant la masse.",
        textEn:
          "Gently fold the whites into the chocolate, lifting the mixture.",
      },
      {
        step: 6,
        text: "Répartir en verrines et réfrigérer au moins 2 heures.",
        textEn: "Divide into glasses and refrigerate for at least 2 hours.",
      },
    ],
  },
  {
    id: "tiramisu",
    name: "Tiramisu",
    nameEn: "Tiramisu",
    description:
      "Le dessert italien par excellence, avec mascarpone et café. À préparer la veille !",
    descriptionEn:
      "The quintessential Italian dessert with mascarpone and coffee. Best prepared the day before!",
    eggsRequired: 4,
    freshness: ["extra-fresh"],
    difficulty: "medium",
    time: 30,
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop&q=80",
    tags: ["dessert", "italien", "café"],
    tagsEn: ["dessert", "italian", "coffee"],
    servings: 8,
    instructions: [
      {
        step: 1,
        text: "Séparer les blancs des jaunes d'oeufs.",
        textEn: "Separate the egg whites from the yolks.",
      },
      {
        step: 2,
        text: "Fouetter les jaunes avec 100g de sucre jusqu'à blanchiment.",
        textEn: "Whisk the yolks with 100g sugar until pale and fluffy.",
      },
      {
        step: 3,
        text: "Ajouter 500g de mascarpone et bien mélanger.",
        textEn: "Add 500g mascarpone and mix well.",
      },
      {
        step: 4,
        text: "Monter les blancs en neige et les incorporer délicatement.",
        textEn: "Beat the whites until stiff and fold in gently.",
      },
      {
        step: 5,
        text: "Préparer un café fort et laisser refroidir.",
        textEn: "Prepare strong coffee and let it cool.",
      },
      {
        step: 6,
        text: "Tremper rapidement les biscuits dans le café et tapisser le fond du plat.",
        textEn:
          "Quickly dip the ladyfingers in coffee and line the bottom of the dish.",
      },
      {
        step: 7,
        text: "Alterner couches de crème et de biscuits, terminer par la crème.",
        textEn: "Alternate layers of cream and biscuits, ending with cream.",
      },
      {
        step: 8,
        text: "Saupoudrer de cacao et réfrigérer une nuit.",
        textEn: "Dust with cocoa and refrigerate overnight.",
      },
    ],
  },
  {
    id: "oeufs-brouilles",
    name: "Oeufs brouillés crémeux",
    nameEn: "Creamy scrambled eggs",
    description:
      "Crémeux à souhait, avec une pointe de ciboulette. Le secret : cuisson douce !",
    descriptionEn:
      "Perfectly creamy with a hint of chives. The secret: gentle heat!",
    eggsRequired: 3,
    freshness: ["extra-fresh", "fresh"],
    difficulty: "easy",
    time: 8,
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop&q=80",
    tags: ["petit-déjeuner", "rapide", "crémeux"],
    tagsEn: ["breakfast", "quick", "creamy"],
    servings: 2,
    instructions: [
      {
        step: 1,
        text: "Battre les oeufs avec sel, poivre et un peu de crème ou lait.",
        textEn: "Beat the eggs with salt, pepper and a little cream or milk.",
      },
      {
        step: 2,
        text: "Faire fondre une noix de beurre dans une poêle à feu très doux.",
        textEn: "Melt a knob of butter in a pan over very low heat.",
      },
      {
        step: 3,
        text: "Verser les oeufs et remuer constamment avec une spatule.",
        textEn: "Pour in the eggs and stir constantly with a spatula.",
      },
      {
        step: 4,
        text: "Retirer du feu quand c'est encore crémeux (ils finissent de cuire hors feu).",
        textEn:
          "Remove from heat while still creamy (they'll finish cooking off the heat).",
      },
      {
        step: 5,
        text: "Ajouter de la ciboulette ciselée et servir immédiatement.",
        textEn: "Add chopped chives and serve immediately.",
      },
    ],
  },
  {
    id: "oeufs-plat",
    name: "Oeufs au plat",
    nameEn: "Fried eggs",
    description:
      "Simple et efficace. Blanc bien cuit, jaune coulant. Parfait avec du bacon !",
    descriptionEn:
      "Simple and effective. Well-cooked white, runny yolk. Perfect with bacon!",
    eggsRequired: 2,
    freshness: ["extra-fresh", "fresh"],
    difficulty: "easy",
    time: 5,
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop&q=80",
    tags: ["petit-déjeuner", "rapide", "simple"],
    tagsEn: ["breakfast", "quick", "simple"],
    servings: 1,
    instructions: [
      {
        step: 1,
        text: "Faire chauffer un peu de beurre ou d'huile dans une poêle.",
        textEn: "Heat a little butter or oil in a pan.",
      },
      {
        step: 2,
        text: "Casser délicatement les oeufs dans la poêle chaude.",
        textEn: "Gently crack the eggs into the hot pan.",
      },
      {
        step: 3,
        text: "Cuire à feu moyen jusqu'à ce que le blanc soit pris.",
        textEn: "Cook over medium heat until the white is set.",
      },
      {
        step: 4,
        text: "Saler, poivrer et servir immédiatement.",
        textEn: "Season with salt and pepper and serve immediately.",
      },
    ],
  },
  {
    id: "shakshuka",
    name: "Shakshuka",
    nameEn: "Shakshuka",
    description:
      "Oeufs pochés dans une sauce tomate épicée. Un plat du Moyen-Orient réconfortant.",
    descriptionEn:
      "Eggs poached in spicy tomato sauce. A comforting Middle Eastern dish.",
    eggsRequired: 4,
    freshness: ["extra-fresh", "fresh"],
    difficulty: "easy",
    time: 25,
    image:
      "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800&h=600&fit=crop&q=80",
    tags: ["brunch", "épicé", "végétarien"],
    tagsEn: ["brunch", "spicy", "vegetarian"],
    servings: 2,
    instructions: [
      {
        step: 1,
        text: "Faire revenir oignon, ail et poivrons émincés dans l'huile d'olive.",
        textEn: "Sauté sliced onion, garlic and peppers in olive oil.",
      },
      {
        step: 2,
        text: "Ajouter les tomates concassées, cumin, paprika et piment.",
        textEn: "Add crushed tomatoes, cumin, paprika and chili.",
      },
      {
        step: 3,
        text: "Laisser mijoter 10-15 minutes jusqu'à épaississement.",
        textEn: "Let simmer 10-15 minutes until thickened.",
      },
      {
        step: 4,
        text: "Former 4 petits puits et casser un oeuf dans chacun.",
        textEn: "Make 4 small wells and crack an egg into each.",
      },
      {
        step: 5,
        text: "Couvrir et cuire jusqu'à ce que les blancs soient pris mais les jaunes coulants.",
        textEn:
          "Cover and cook until whites are set but yolks are still runny.",
      },
      {
        step: 6,
        text: "Servir avec du pain frais ou de la pita.",
        textEn: "Serve with fresh bread or pita.",
      },
    ],
  },
  {
    id: "oeufs-mollets",
    name: "Oeufs mollets",
    nameEn: "Soft-boiled eggs (medium)",
    description:
      "Le blanc est pris, le jaune reste crémeux. Parfait pour les salades !",
    descriptionEn:
      "The white is set, the yolk stays creamy. Perfect for salads!",
    eggsRequired: 2,
    freshness: ["extra-fresh"],
    difficulty: "easy",
    time: 6,
    image:
      "https://images.unsplash.com/photo-1482049016530-d79ae00e6e9b?w=800&h=600&fit=crop&q=80",
    tags: ["salade", "brunch", "technique"],
    tagsEn: ["salad", "brunch", "technique"],
    servings: 1,
    instructions: [
      {
        step: 1,
        text: "Porter une casserole d'eau à ébullition.",
        textEn: "Bring a pot of water to a boil.",
      },
      {
        step: 2,
        text: "Plonger délicatement les oeufs pendant exactement 6 minutes.",
        textEn: "Gently lower the eggs for exactly 6 minutes.",
      },
      {
        step: 3,
        text: "Les transférer immédiatement dans un bol d'eau glacée.",
        textEn: "Transfer immediately to a bowl of ice water.",
      },
      {
        step: 4,
        text: "Écaler délicatement sous un filet d'eau froide.",
        textEn: "Gently peel under cold running water.",
      },
      {
        step: 5,
        text: "Servir sur salade, asperges ou toast.",
        textEn: "Serve on salad, asparagus or toast.",
      },
    ],
  },
  {
    id: "oeufs-cocotte",
    name: "Oeufs cocotte aux champignons",
    nameEn: "Baked eggs with mushrooms",
    description:
      "Cuits au four dans des ramequins, avec champignons et crème. Réconfortant !",
    descriptionEn: "Baked in ramekins with mushrooms and cream. Comforting!",
    eggsRequired: 2,
    freshness: ["extra-fresh"],
    difficulty: "easy",
    time: 15,
    image:
      "https://images.unsplash.com/photo-1607116667981-b704e7f tried&w=800&h=600&fit=crop&q=80",
    tags: ["brunch", "réconfortant", "champignons"],
    tagsEn: ["brunch", "comfort", "mushrooms"],
    servings: 2,
    instructions: [
      {
        step: 1,
        text: "Préchauffer le four à 180°C.",
        textEn: "Preheat the oven to 180°C (350°F).",
      },
      {
        step: 2,
        text: "Faire revenir les champignons émincés dans du beurre.",
        textEn: "Sauté sliced mushrooms in butter.",
      },
      {
        step: 3,
        text: "Répartir dans des ramequins beurrés avec un peu de crème.",
        textEn: "Divide into buttered ramekins with a little cream.",
      },
      {
        step: 4,
        text: "Casser un oeuf dans chaque ramequin, saler, poivrer.",
        textEn: "Crack an egg into each ramekin, season with salt and pepper.",
      },
      {
        step: 5,
        text: "Cuire au bain-marie au four 8-10 minutes.",
        textEn: "Bake in a water bath for 8-10 minutes.",
      },
      {
        step: 6,
        text: "Le blanc doit être pris et le jaune encore coulant.",
        textEn: "The white should be set and the yolk still runny.",
      },
    ],
  },
  {
    id: "galette-complete",
    name: "Galette complète",
    nameEn: "Complete Breton galette",
    description:
      "La galette bretonne garnie de jambon, fromage et oeuf. Un classique !",
    descriptionEn:
      "Breton buckwheat crepe with ham, cheese and egg. A classic!",
    eggsRequired: 1,
    freshness: ["extra-fresh", "fresh"],
    difficulty: "medium",
    time: 15,
    image:
      "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&h=600&fit=crop&q=80",
    tags: ["repas", "breton", "fromage"],
    tagsEn: ["meal", "breton", "cheese"],
    servings: 1,
    instructions: [
      {
        step: 1,
        text: "Chauffer une galette de sarrasin dans une poêle beurrée.",
        textEn: "Heat a buckwheat galette in a buttered pan.",
      },
      {
        step: 2,
        text: "Disposer une tranche de jambon au centre.",
        textEn: "Place a slice of ham in the center.",
      },
      {
        step: 3,
        text: "Ajouter du fromage râpé (emmental ou gruyère).",
        textEn: "Add grated cheese (emmental or gruyère).",
      },
      {
        step: 4,
        text: "Casser un oeuf au milieu de la galette.",
        textEn: "Crack an egg in the middle of the galette.",
      },
      {
        step: 5,
        text: "Replier les bords pour former un carré.",
        textEn: "Fold the edges to form a square.",
      },
      {
        step: 6,
        text: "Cuire jusqu'à ce que le blanc soit pris et le fromage fondu.",
        textEn: "Cook until the white is set and cheese is melted.",
      },
    ],
  },
  {
    id: "carbonara",
    name: "Spaghetti carbonara",
    nameEn: "Spaghetti carbonara",
    description:
      "La vraie recette italienne avec guanciale, pecorino et jaunes d'oeufs. Pas de crème !",
    descriptionEn:
      "The authentic Italian recipe with guanciale, pecorino and egg yolks. No cream!",
    eggsRequired: 4,
    freshness: ["extra-fresh"],
    difficulty: "medium",
    time: 25,
    image:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=600&fit=crop&q=80",
    tags: ["repas", "italien", "pâtes"],
    tagsEn: ["meal", "italian", "pasta"],
    servings: 4,
    instructions: [
      {
        step: 1,
        text: "Cuire les spaghetti al dente dans une grande casserole d'eau salée.",
        textEn: "Cook spaghetti al dente in a large pot of salted water.",
      },
      {
        step: 2,
        text: "Pendant ce temps, dorer le guanciale (ou pancetta) à la poêle sans matière grasse.",
        textEn: "Meanwhile, brown the guanciale (or pancetta) in a dry pan.",
      },
      {
        step: 3,
        text: "Dans un bol, mélanger 3 jaunes entiers + 1 oeuf entier avec le pecorino râpé.",
        textEn:
          "In a bowl, mix 3 whole yolks + 1 whole egg with grated pecorino.",
      },
      {
        step: 4,
        text: "Égoutter les pâtes en gardant une tasse d'eau de cuisson.",
        textEn: "Drain the pasta, keeping a cup of cooking water.",
      },
      {
        step: 5,
        text: "Hors du feu, mélanger les pâtes avec le guanciale.",
        textEn: "Off the heat, mix the pasta with the guanciale.",
      },
      {
        step: 6,
        text: "Ajouter le mélange oeufs/fromage et remuer vivement.",
        textEn: "Add the egg/cheese mixture and stir quickly.",
      },
      {
        step: 7,
        text: "Détendre avec l'eau de cuisson pour une sauce crémeuse. Poivrer généreusement.",
        textEn:
          "Thin with cooking water for a creamy sauce. Season generously with pepper.",
      },
    ],
  },
  {
    id: "sabayon",
    name: "Sabayon",
    nameEn: "Zabaglione",
    description:
      "Crème mousseuse au vin doux, servie tiède. Un dessert italien raffiné.",
    descriptionEn:
      "Foamy cream with sweet wine, served warm. A refined Italian dessert.",
    eggsRequired: 4,
    freshness: ["extra-fresh"],
    difficulty: "hard",
    time: 20,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=600&fit=crop&q=80",
    tags: ["dessert", "italien", "élégant"],
    tagsEn: ["dessert", "italian", "elegant"],
    servings: 4,
    instructions: [
      {
        step: 1,
        text: "Mettre 4 jaunes d'oeufs et 80g de sucre dans un bol résistant à la chaleur.",
        textEn: "Put 4 egg yolks and 80g sugar in a heat-resistant bowl.",
      },
      {
        step: 2,
        text: "Placer le bol au-dessus d'une casserole d'eau frémissante (bain-marie).",
        textEn: "Place the bowl over a pan of simmering water (double boiler).",
      },
      {
        step: 3,
        text: "Fouetter énergiquement en ajoutant 100ml de vin doux (Marsala).",
        textEn: "Whisk vigorously while adding 100ml sweet wine (Marsala).",
      },
      {
        step: 4,
        text: "Continuer à fouetter jusqu'à ce que le mélange triple de volume.",
        textEn: "Keep whisking until the mixture triples in volume.",
      },
      {
        step: 5,
        text: "Le sabayon est prêt quand il forme un ruban épais.",
        textEn: "The zabaglione is ready when it forms a thick ribbon.",
      },
      {
        step: 6,
        text: "Servir tiède en verrine, nature ou avec des fruits frais.",
        textEn: "Serve warm in glasses, plain or with fresh fruit.",
      },
    ],
  },

  // ============================================
  // FRESH RECIPES (10-21 days) - Well cooked
  // ============================================
  {
    id: "omelette",
    name: "Omelette",
    nameEn: "Omelette",
    description:
      "Baveuse ou bien cuite, nature ou garnie. La base de la cuisine aux oeufs !",
    descriptionEn:
      "Runny or well-done, plain or filled. The foundation of egg cooking!",
    eggsRequired: 3,
    freshness: ["extra-fresh", "fresh"],
    difficulty: "easy",
    time: 10,
    image:
      "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&h=600&fit=crop&q=80",
    tags: ["repas", "polyvalent", "classique"],
    tagsEn: ["meal", "versatile", "classic"],
    servings: 1,
    instructions: [
      {
        step: 1,
        text: "Battre les oeufs avec sel, poivre et un peu de crème (optionnel).",
        textEn:
          "Beat the eggs with salt, pepper and a little cream (optional).",
      },
      {
        step: 2,
        text: "Faire chauffer du beurre dans une poêle à feu moyen-vif.",
        textEn: "Heat butter in a pan over medium-high heat.",
      },
      {
        step: 3,
        text: "Verser les oeufs et remuer rapidement au centre.",
        textEn: "Pour in the eggs and stir quickly in the center.",
      },
      {
        step: 4,
        text: "Quand le dessous est pris, ajouter la garniture (fromage, herbes, jambon...).",
        textEn: "When the bottom is set, add filling (cheese, herbs, ham...).",
      },
      {
        step: 5,
        text: "Plier l'omelette en deux ou trois et la faire glisser sur l'assiette.",
        textEn: "Fold the omelette in half or thirds and slide onto the plate.",
      },
    ],
  },
  {
    id: "croque-madame",
    name: "Croque-madame",
    nameEn: "Croque-madame",
    description:
      "Le croque-monsieur version luxe avec son oeuf au plat sur le dessus !",
    descriptionEn: "The deluxe croque-monsieur with a fried egg on top!",
    eggsRequired: 1,
    freshness: ["extra-fresh", "fresh"],
    difficulty: "easy",
    time: 15,
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=600&fit=crop&q=80",
    tags: ["repas", "fromage", "gourmand"],
    tagsEn: ["meal", "cheese", "indulgent"],
    servings: 1,
    instructions: [
      {
        step: 1,
        text: "Préparer une béchamel épaisse avec beurre, farine et lait.",
        textEn: "Prepare a thick béchamel with butter, flour and milk.",
      },
      {
        step: 2,
        text: "Tartiner les tranches de pain de béchamel.",
        textEn: "Spread the bread slices with béchamel.",
      },
      {
        step: 3,
        text: "Garnir avec jambon et fromage, refermer le sandwich.",
        textEn: "Fill with ham and cheese, close the sandwich.",
      },
      {
        step: 4,
        text: "Dorer à la poêle ou au four jusqu'à ce que le fromage soit fondu.",
        textEn: "Brown in a pan or oven until the cheese is melted.",
      },
      {
        step: 5,
        text: "Cuire un oeuf au plat et le poser sur le croque.",
        textEn: "Fry an egg and place it on top of the croque.",
      },
    ],
  },
  {
    id: "crepes",
    name: "Crêpes",
    nameEn: "Crepes",
    description:
      "Fines et légères, sucrées ou salées. Un incontournable pour toute la famille !",
    descriptionEn:
      "Thin and light, sweet or savory. A must for the whole family!",
    eggsRequired: 3,
    freshness: ["extra-fresh", "fresh"],
    difficulty: "easy",
    time: 30,
    image:
      "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&h=600&fit=crop&q=80",
    tags: ["dessert", "goûter", "famille"],
    tagsEn: ["dessert", "snack", "family"],
    servings: 8,
    instructions: [
      {
        step: 1,
        text: "Mélanger 250g de farine avec une pincée de sel.",
        textEn: "Mix 250g flour with a pinch of salt.",
      },
      {
        step: 2,
        text: "Ajouter les oeufs et mélanger.",
        textEn: "Add the eggs and mix.",
      },
      {
        step: 3,
        text: "Incorporer 50cl de lait progressivement en fouettant.",
        textEn: "Gradually add 50cl milk while whisking.",
      },
      {
        step: 4,
        text: "Laisser reposer la pâte 30 minutes si possible.",
        textEn: "Let the batter rest for 30 minutes if possible.",
      },
      {
        step: 5,
        text: "Cuire de fines crêpes dans une poêle légèrement huilée.",
        textEn: "Cook thin crepes in a lightly oiled pan.",
      },
      {
        step: 6,
        text: "Garnir selon vos envies : sucre, Nutella, citron, jambon-fromage...",
        textEn: "Fill as desired: sugar, Nutella, lemon, ham-cheese...",
      },
    ],
  },
  {
    id: "gateau-yaourt",
    name: "Gâteau au yaourt",
    nameEn: "Yogurt cake",
    description:
      "Le gâteau préféré des enfants ! Simple, moelleux, impossible à rater.",
    descriptionEn:
      "Kids' favorite cake! Simple, fluffy, impossible to mess up.",
    eggsRequired: 3,
    freshness: ["extra-fresh", "fresh"],
    difficulty: "easy",
    time: 45,
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop&q=80",
    tags: ["dessert", "goûter", "enfants"],
    tagsEn: ["dessert", "snack", "kids"],
    servings: 8,
    instructions: [
      {
        step: 1,
        text: "Préchauffer le four à 180°C.",
        textEn: "Preheat the oven to 180°C (350°F).",
      },
      {
        step: 2,
        text: "Vider un yaourt dans un saladier (garder le pot comme mesure).",
        textEn: "Empty a yogurt into a bowl (keep the pot as a measure).",
      },
      {
        step: 3,
        text: "Ajouter 2 pots de sucre, 3 pots de farine, 1/2 pot d'huile.",
        textEn: "Add 2 pots of sugar, 3 pots of flour, 1/2 pot of oil.",
      },
      {
        step: 4,
        text: "Incorporer les oeufs et un sachet de levure.",
        textEn: "Add the eggs and a packet of baking powder.",
      },
      {
        step: 5,
        text: "Mélanger jusqu'à obtenir une pâte lisse.",
        textEn: "Mix until you get a smooth batter.",
      },
      {
        step: 6,
        text: "Verser dans un moule beurré et cuire 30-35 minutes.",
        textEn: "Pour into a buttered pan and bake for 30-35 minutes.",
      },
    ],
  },
  {
    id: "quiche-lorraine",
    name: "Quiche lorraine",
    nameEn: "Quiche Lorraine",
    description:
      "Lardons, crème, oeufs : le trio gagnant. Parfaite chaude ou froide.",
    descriptionEn: "Bacon, cream, eggs: the winning trio. Perfect hot or cold.",
    eggsRequired: 4,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "medium",
    time: 60,
    image:
      "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&h=600&fit=crop&q=80",
    tags: ["repas", "pique-nique", "classique"],
    tagsEn: ["meal", "picnic", "classic"],
    servings: 6,
    instructions: [
      {
        step: 1,
        text: "Préchauffer le four à 180°C.",
        textEn: "Preheat the oven to 180°C (350°F).",
      },
      {
        step: 2,
        text: "Étaler la pâte brisée dans un moule à tarte et piquer le fond.",
        textEn:
          "Roll out the shortcrust pastry in a tart pan and prick the bottom.",
      },
      {
        step: 3,
        text: "Faire dorer les lardons à la poêle sans matière grasse.",
        textEn: "Brown the bacon in a dry pan.",
      },
      {
        step: 4,
        text: "Répartir les lardons sur le fond de tarte.",
        textEn: "Spread the bacon on the tart base.",
      },
      {
        step: 5,
        text: "Battre les oeufs avec 20cl de crème, sel, poivre et muscade.",
        textEn: "Beat the eggs with 20cl cream, salt, pepper and nutmeg.",
      },
      {
        step: 6,
        text: "Verser l'appareil sur les lardons.",
        textEn: "Pour the mixture over the bacon.",
      },
      {
        step: 7,
        text: "Cuire 35-40 minutes jusqu'à ce que la quiche soit dorée.",
        textEn: "Bake 35-40 minutes until the quiche is golden.",
      },
    ],
  },
  {
    id: "flan-patissier",
    name: "Flan pâtissier",
    nameEn: "French custard tart",
    description:
      "Crémeux et vanillé, avec ou sans pâte. Un dessert de boulangerie à la maison !",
    descriptionEn:
      "Creamy and vanilla-scented, with or without crust. A bakery dessert at home!",
    eggsRequired: 5,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "medium",
    time: 60,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop&q=80",
    tags: ["dessert", "vanille", "boulangerie"],
    tagsEn: ["dessert", "vanilla", "bakery"],
    servings: 8,
    instructions: [
      {
        step: 1,
        text: "Préchauffer le four à 180°C.",
        textEn: "Preheat the oven to 180°C (350°F).",
      },
      {
        step: 2,
        text: "Foncer un moule avec une pâte feuilletée (optionnel).",
        textEn: "Line a pan with puff pastry (optional).",
      },
      {
        step: 3,
        text: "Faire chauffer 75cl de lait avec une gousse de vanille fendue.",
        textEn: "Heat 75cl milk with a split vanilla pod.",
      },
      {
        step: 4,
        text: "Fouetter les oeufs avec 150g de sucre et 100g de maïzena.",
        textEn: "Whisk the eggs with 150g sugar and 100g cornstarch.",
      },
      {
        step: 5,
        text: "Verser le lait chaud sur le mélange en fouettant.",
        textEn: "Pour the hot milk over the mixture while whisking.",
      },
      {
        step: 6,
        text: "Remettre sur feu doux et remuer jusqu'à épaississement.",
        textEn: "Return to low heat and stir until thickened.",
      },
      {
        step: 7,
        text: "Verser dans le moule et cuire 40-45 minutes.",
        textEn: "Pour into the pan and bake for 40-45 minutes.",
      },
    ],
  },
  {
    id: "clafoutis",
    name: "Clafoutis aux cerises",
    nameEn: "Cherry clafoutis",
    description:
      "Un dessert rustique du Limousin. Fonctionne aussi avec d'autres fruits !",
    descriptionEn:
      "A rustic dessert from Limousin. Also works with other fruits!",
    eggsRequired: 4,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "easy",
    time: 45,
    image:
      "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&h=600&fit=crop&q=80",
    tags: ["dessert", "fruits", "traditionnel"],
    tagsEn: ["dessert", "fruit", "traditional"],
    servings: 6,
    instructions: [
      {
        step: 1,
        text: "Préchauffer le four à 180°C.",
        textEn: "Preheat the oven to 180°C (350°F).",
      },
      {
        step: 2,
        text: "Beurrer un plat et le saupoudrer de sucre.",
        textEn: "Butter a dish and sprinkle with sugar.",
      },
      {
        step: 3,
        text: "Répartir 500g de cerises lavées (avec ou sans noyaux).",
        textEn: "Spread 500g washed cherries (with or without pits).",
      },
      {
        step: 4,
        text: "Battre les oeufs avec 100g de sucre.",
        textEn: "Beat the eggs with 100g sugar.",
      },
      {
        step: 5,
        text: "Ajouter 60g de farine, 25cl de lait et la vanille.",
        textEn: "Add 60g flour, 25cl milk and vanilla.",
      },
      {
        step: 6,
        text: "Verser l'appareil sur les cerises.",
        textEn: "Pour the batter over the cherries.",
      },
      {
        step: 7,
        text: "Cuire 35-40 minutes jusqu'à ce que ce soit doré.",
        textEn: "Bake 35-40 minutes until golden.",
      },
    ],
  },
  {
    id: "tortilla",
    name: "Tortilla espagnole",
    nameEn: "Spanish tortilla",
    description:
      "L'omelette aux pommes de terre espagnole. Épaisse et généreuse !",
    descriptionEn: "The Spanish potato omelette. Thick and generous!",
    eggsRequired: 4,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "easy",
    time: 35,
    image:
      "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800&h=600&fit=crop&q=80",
    tags: ["repas", "tapas", "espagnol"],
    tagsEn: ["meal", "tapas", "spanish"],
    servings: 4,
    instructions: [
      {
        step: 1,
        text: "Éplucher et couper les pommes de terre en fines rondelles.",
        textEn: "Peel and cut the potatoes into thin slices.",
      },
      {
        step: 2,
        text: "Les faire cuire doucement dans beaucoup d'huile d'olive avec l'oignon émincé.",
        textEn: "Cook them gently in plenty of olive oil with sliced onion.",
      },
      {
        step: 3,
        text: "Égoutter les pommes de terre et les mélanger aux oeufs battus.",
        textEn: "Drain the potatoes and mix them with the beaten eggs.",
      },
      {
        step: 4,
        text: "Saler et laisser reposer 10 minutes.",
        textEn: "Salt and let rest for 10 minutes.",
      },
      {
        step: 5,
        text: "Cuire dans une poêle à feu doux, couvercle.",
        textEn: "Cook in a pan over low heat, covered.",
      },
      {
        step: 6,
        text: "Retourner à mi-cuisson à l'aide d'une assiette.",
        textEn: "Flip halfway through using a plate.",
      },
      {
        step: 7,
        text: "Finir la cuisson de l'autre côté. Servir tiède.",
        textEn: "Finish cooking the other side. Serve warm.",
      },
    ],
  },
  {
    id: "frittata",
    name: "Frittata aux légumes",
    nameEn: "Vegetable frittata",
    description:
      "L'omelette italienne aux légumes, finie au four. Parfaite pour utiliser les restes !",
    descriptionEn:
      "Italian vegetable omelette, finished in the oven. Perfect for using leftovers!",
    eggsRequired: 5,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "easy",
    time: 30,
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=600&fit=crop&q=80",
    tags: ["repas", "végétarien", "anti-gaspi"],
    tagsEn: ["meal", "vegetarian", "anti-waste"],
    servings: 4,
    instructions: [
      {
        step: 1,
        text: "Préchauffer le four à 180°C.",
        textEn: "Preheat the oven to 180°C (350°F).",
      },
      {
        step: 2,
        text: "Faire revenir les légumes au choix dans une poêle allant au four.",
        textEn: "Sauté your choice of vegetables in an oven-safe pan.",
      },
      {
        step: 3,
        text: "Battre les oeufs avec sel, poivre et fromage râpé.",
        textEn: "Beat the eggs with salt, pepper and grated cheese.",
      },
      {
        step: 4,
        text: "Verser les oeufs sur les légumes.",
        textEn: "Pour the eggs over the vegetables.",
      },
      {
        step: 5,
        text: "Cuire 5 minutes sur le feu puis 10-15 minutes au four.",
        textEn: "Cook 5 minutes on the stove then 10-15 minutes in the oven.",
      },
      {
        step: 6,
        text: "Laisser tiédir avant de démouler et servir.",
        textEn: "Let cool slightly before unmolding and serving.",
      },
    ],
  },
  {
    id: "tamagoyaki",
    name: "Tamagoyaki",
    nameEn: "Japanese rolled omelette",
    description:
      "L'omelette roulée japonaise, légèrement sucrée. Parfaite pour les bento !",
    descriptionEn:
      "Japanese rolled omelette, slightly sweet. Perfect for bento boxes!",
    eggsRequired: 3,
    freshness: ["fresh"],
    difficulty: "medium",
    time: 20,
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=600&fit=crop&q=80",
    tags: ["apéritif", "japonais", "bento"],
    tagsEn: ["appetizer", "japanese", "bento"],
    servings: 2,
    instructions: [
      {
        step: 1,
        text: "Battre les oeufs avec une pincée de sel, 1 c.à.s de sucre et 1 c.à.s de sauce soja.",
        textEn:
          "Beat eggs with a pinch of salt, 1 tbsp sugar and 1 tbsp soy sauce.",
      },
      {
        step: 2,
        text: "Huiler légèrement une poêle rectangulaire (ou ronde).",
        textEn: "Lightly oil a rectangular pan (or round).",
      },
      {
        step: 3,
        text: "Verser une fine couche d'oeuf et la laisser prendre.",
        textEn: "Pour a thin layer of egg and let it set.",
      },
      {
        step: 4,
        text: "Rouler l'omelette vers un côté de la poêle.",
        textEn: "Roll the omelette to one side of the pan.",
      },
      {
        step: 5,
        text: "Verser une nouvelle couche, soulever le rouleau pour que l'oeuf passe dessous.",
        textEn: "Pour another layer, lift the roll so egg goes underneath.",
      },
      {
        step: 6,
        text: "Répéter jusqu'à épuisement des oeufs. Couper en tranches.",
        textEn: "Repeat until eggs are used up. Cut into slices.",
      },
    ],
  },
  {
    id: "ile-flottante",
    name: "Île flottante",
    nameEn: "Floating island",
    description:
      "Blancs en neige pochés sur crème anglaise. Un grand classique français !",
    descriptionEn: "Poached meringue floating on custard. A French classic!",
    eggsRequired: 4,
    freshness: ["fresh"],
    difficulty: "medium",
    time: 40,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=600&fit=crop&q=80",
    tags: ["dessert", "vanille", "français"],
    tagsEn: ["dessert", "vanilla", "french"],
    servings: 4,
    instructions: [
      {
        step: 1,
        text: "Séparer les blancs des jaunes.",
        textEn: "Separate the whites from the yolks.",
      },
      {
        step: 2,
        text: "Préparer la crème anglaise : chauffer le lait avec la vanille.",
        textEn: "Make the custard: heat the milk with vanilla.",
      },
      {
        step: 3,
        text: "Fouetter les jaunes avec le sucre, verser le lait chaud en fouettant.",
        textEn: "Whisk yolks with sugar, pour in hot milk while whisking.",
      },
      {
        step: 4,
        text: "Cuire à feu doux en remuant jusqu'à ce que la crème nappe la cuillère.",
        textEn: "Cook over low heat, stirring until custard coats the spoon.",
      },
      {
        step: 5,
        text: "Monter les blancs en neige ferme avec du sucre.",
        textEn: "Beat egg whites until stiff with sugar.",
      },
      {
        step: 6,
        text: "Former des quenelles et les pocher quelques secondes dans l'eau frémissante.",
        textEn:
          "Form quenelles and poach for a few seconds in simmering water.",
      },
      {
        step: 7,
        text: "Déposer les îles sur la crème anglaise froide. Arroser de caramel.",
        textEn: "Place the islands on cold custard. Drizzle with caramel.",
      },
    ],
  },
  {
    id: "riz-cantonais",
    name: "Riz cantonais",
    nameEn: "Cantonese fried rice",
    description:
      "Le classique du restaurant chinois, facile à faire à la maison !",
    descriptionEn: "The Chinese restaurant classic, easy to make at home!",
    eggsRequired: 2,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "easy",
    time: 25,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop&q=80",
    tags: ["repas", "asiatique", "rapide"],
    tagsEn: ["meal", "asian", "quick"],
    servings: 4,
    instructions: [
      {
        step: 1,
        text: "Utiliser du riz cuit et refroidi (idéalement de la veille).",
        textEn: "Use cooked and cooled rice (ideally from the day before).",
      },
      {
        step: 2,
        text: "Battre les oeufs et les cuire en brouillade rapide. Réserver.",
        textEn: "Beat the eggs and cook as quick scramble. Set aside.",
      },
      {
        step: 3,
        text: "Faire sauter oignon, petits pois et dés de jambon dans un wok.",
        textEn: "Stir-fry onion, peas and diced ham in a wok.",
      },
      {
        step: 4,
        text: "Ajouter le riz et faire sauter à feu vif.",
        textEn: "Add the rice and stir-fry over high heat.",
      },
      {
        step: 5,
        text: "Assaisonner avec sauce soja et huile de sésame.",
        textEn: "Season with soy sauce and sesame oil.",
      },
      {
        step: 6,
        text: "Remettre les oeufs brouillés et mélanger. Servir chaud.",
        textEn: "Add back the scrambled eggs and mix. Serve hot.",
      },
    ],
  },

  // ============================================
  // COOK-THOROUGHLY RECIPES (22-28 days) - Anti-waste
  // ============================================
  {
    id: "oeufs-durs",
    name: "Oeufs durs",
    nameEn: "Hard-boiled eggs",
    description:
      "La base pour salades, sandwichs ou à grignoter nature avec du sel.",
    descriptionEn: "The base for salads, sandwiches or as a snack with salt.",
    eggsRequired: 4,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "easy",
    time: 12,
    image:
      "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=800&h=600&fit=crop&q=80",
    tags: ["préparation", "polyvalent", "meal-prep"],
    tagsEn: ["preparation", "versatile", "meal-prep"],
    servings: 4,
    instructions: [
      {
        step: 1,
        text: "Mettre les oeufs dans une casserole d'eau froide.",
        textEn: "Put the eggs in a pot of cold water.",
      },
      {
        step: 2,
        text: "Porter à ébullition.",
        textEn: "Bring to a boil.",
      },
      {
        step: 3,
        text: "Compter 9-10 minutes à partir de l'ébullition.",
        textEn: "Count 9-10 minutes from when it boils.",
      },
      {
        step: 4,
        text: "Plonger immédiatement dans l'eau glacée.",
        textEn: "Immediately plunge into ice water.",
      },
      {
        step: 5,
        text: "Écaler et utiliser ou conserver au frigo jusqu'à 5 jours.",
        textEn: "Peel and use or keep in fridge up to 5 days.",
      },
    ],
  },
  {
    id: "oeufs-mimosa",
    name: "Oeufs mimosa",
    nameEn: "Deviled eggs",
    description:
      "Classique des buffets et pique-niques. Parfaits pour utiliser des oeufs plus anciens !",
    descriptionEn: "Buffet and picnic classic. Perfect for using older eggs!",
    eggsRequired: 6,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "easy",
    time: 25,
    image:
      "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=800&h=600&fit=crop&q=80",
    tags: ["apéritif", "buffet", "anti-gaspi"],
    tagsEn: ["appetizer", "buffet", "anti-waste"],
    servings: 6,
    instructions: [
      {
        step: 1,
        text: "Cuire les oeufs durs (9-10 min), les refroidir et les écaler.",
        textEn: "Hard-boil eggs (9-10 min), cool and peel them.",
      },
      {
        step: 2,
        text: "Les couper en deux dans le sens de la longueur.",
        textEn: "Cut them in half lengthwise.",
      },
      {
        step: 3,
        text: "Retirer les jaunes et les écraser à la fourchette.",
        textEn: "Remove the yolks and mash with a fork.",
      },
      {
        step: 4,
        text: "Mélanger avec mayonnaise, moutarde, sel, poivre et herbes.",
        textEn: "Mix with mayonnaise, mustard, salt, pepper and herbs.",
      },
      {
        step: 5,
        text: "Garnir les blancs avec cette préparation.",
        textEn: "Fill the whites with this mixture.",
      },
      {
        step: 6,
        text: "Décorer avec du paprika et de la ciboulette.",
        textEn: "Decorate with paprika and chives.",
      },
    ],
  },
  {
    id: "salade-nicoise",
    name: "Salade niçoise",
    nameEn: "Niçoise salad",
    description:
      "Thon, oeufs durs, olives, tomates... La fraîcheur du Sud en assiette !",
    descriptionEn:
      "Tuna, hard-boiled eggs, olives, tomatoes... The freshness of the South on a plate!",
    eggsRequired: 2,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "easy",
    time: 20,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80",
    tags: ["salade", "été", "healthy"],
    tagsEn: ["salad", "summer", "healthy"],
    servings: 2,
    instructions: [
      {
        step: 1,
        text: "Cuire les oeufs durs et les couper en quartiers.",
        textEn: "Hard-boil eggs and cut into quarters.",
      },
      {
        step: 2,
        text: "Disposer la salade verte dans un grand plat.",
        textEn: "Arrange lettuce in a large dish.",
      },
      {
        step: 3,
        text: "Ajouter tomates coupées, haricots verts, pommes de terre.",
        textEn: "Add cut tomatoes, green beans, potatoes.",
      },
      {
        step: 4,
        text: "Disposer le thon émietté, les oeufs et les olives noires.",
        textEn: "Add flaked tuna, eggs and black olives.",
      },
      {
        step: 5,
        text: "Assaisonner avec vinaigrette à l'huile d'olive.",
        textEn: "Dress with olive oil vinaigrette.",
      },
    ],
  },
  {
    id: "cake-sale",
    name: "Cake salé",
    nameEn: "Savory loaf cake",
    description:
      "Olives, jambon, fromage... Idéal pour les apéros et pique-niques !",
    descriptionEn: "Olives, ham, cheese... Ideal for appetizers and picnics!",
    eggsRequired: 3,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "easy",
    time: 50,
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80",
    tags: ["apéritif", "pique-nique", "polyvalent"],
    tagsEn: ["appetizer", "picnic", "versatile"],
    servings: 8,
    instructions: [
      {
        step: 1,
        text: "Préchauffer le four à 180°C.",
        textEn: "Preheat the oven to 180°C (350°F).",
      },
      {
        step: 2,
        text: "Mélanger 200g de farine avec un sachet de levure.",
        textEn: "Mix 200g flour with a packet of baking powder.",
      },
      {
        step: 3,
        text: "Ajouter les oeufs, 10cl de lait et 10cl d'huile.",
        textEn: "Add the eggs, 10cl milk and 10cl oil.",
      },
      {
        step: 4,
        text: "Incorporer 100g de fromage râpé et les garnitures choisies.",
        textEn: "Add 100g grated cheese and your chosen fillings.",
      },
      {
        step: 5,
        text: "Verser dans un moule à cake beurré.",
        textEn: "Pour into a buttered loaf pan.",
      },
      {
        step: 6,
        text: "Cuire 40-45 minutes jusqu'à ce que le cake soit doré.",
        textEn: "Bake 40-45 minutes until golden.",
      },
    ],
  },
  {
    id: "pain-perdu",
    name: "Pain perdu",
    nameEn: "French toast",
    description:
      "Le meilleur anti-gaspi ! Transforme le pain rassis en délice sucré.",
    descriptionEn:
      "The best anti-waste recipe! Transforms stale bread into a sweet delight.",
    eggsRequired: 2,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "easy",
    time: 15,
    image:
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&h=600&fit=crop&q=80",
    tags: ["petit-déjeuner", "anti-gaspi", "sucré"],
    tagsEn: ["breakfast", "anti-waste", "sweet"],
    servings: 2,
    instructions: [
      {
        step: 1,
        text: "Battre les oeufs avec 15cl de lait, du sucre et de la vanille.",
        textEn: "Beat eggs with 15cl milk, sugar and vanilla.",
      },
      {
        step: 2,
        text: "Tremper les tranches de pain rassis dans ce mélange.",
        textEn: "Dip stale bread slices in this mixture.",
      },
      {
        step: 3,
        text: "Laisser bien imbiber de chaque côté.",
        textEn: "Let soak well on each side.",
      },
      {
        step: 4,
        text: "Faire dorer à la poêle dans du beurre.",
        textEn: "Brown in a pan with butter.",
      },
      {
        step: 5,
        text: "Servir avec sucre, sirop d'érable ou fruits frais.",
        textEn: "Serve with sugar, maple syrup or fresh fruit.",
      },
    ],
  },
  {
    id: "brownies",
    name: "Brownies au chocolat",
    nameEn: "Chocolate brownies",
    description:
      "Fondants au coeur, croustillants sur le dessus. Le péché mignon !",
    descriptionEn: "Fudgy inside, crispy on top. A guilty pleasure!",
    eggsRequired: 3,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "easy",
    time: 35,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80",
    tags: ["dessert", "chocolat", "gourmand"],
    tagsEn: ["dessert", "chocolate", "indulgent"],
    servings: 12,
    instructions: [
      {
        step: 1,
        text: "Préchauffer le four à 180°C.",
        textEn: "Preheat the oven to 180°C (350°F).",
      },
      {
        step: 2,
        text: "Faire fondre 200g de chocolat avec 150g de beurre.",
        textEn: "Melt 200g chocolate with 150g butter.",
      },
      {
        step: 3,
        text: "Ajouter 200g de sucre et les oeufs un par un.",
        textEn: "Add 200g sugar and the eggs one by one.",
      },
      {
        step: 4,
        text: "Incorporer 80g de farine et des noix ou pépites (optionnel).",
        textEn: "Add 80g flour and nuts or chips (optional).",
      },
      {
        step: 5,
        text: "Verser dans un moule carré beurré.",
        textEn: "Pour into a buttered square pan.",
      },
      {
        step: 6,
        text: "Cuire 20-25 minutes. Le centre doit rester fondant !",
        textEn: "Bake 20-25 minutes. The center should stay fudgy!",
      },
    ],
  },
  {
    id: "gougeres",
    name: "Gougères au fromage",
    nameEn: "Cheese puffs",
    description:
      "Petits choux au fromage, parfaits pour l'apéritif. Croustillants dehors, moelleux dedans.",
    descriptionEn:
      "Small cheese puffs, perfect for appetizers. Crispy outside, soft inside.",
    eggsRequired: 3,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "medium",
    time: 45,
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=600&fit=crop&q=80",
    tags: ["apéritif", "fromage", "français"],
    tagsEn: ["appetizer", "cheese", "french"],
    servings: 20,
    instructions: [
      {
        step: 1,
        text: "Préchauffer le four à 180°C.",
        textEn: "Preheat the oven to 180°C (350°F).",
      },
      {
        step: 2,
        text: "Porter 25cl d'eau avec 100g de beurre à ébullition.",
        textEn: "Bring 25cl water with 100g butter to a boil.",
      },
      {
        step: 3,
        text: "Ajouter 150g de farine d'un coup et remuer vivement.",
        textEn: "Add 150g flour all at once and stir vigorously.",
      },
      {
        step: 4,
        text: "Dessécher sur le feu jusqu'à ce que la pâte se décolle.",
        textEn: "Dry out on heat until the dough pulls away from the pan.",
      },
      {
        step: 5,
        text: "Hors du feu, incorporer les oeufs un par un.",
        textEn: "Off heat, add eggs one by one.",
      },
      {
        step: 6,
        text: "Ajouter 100g de gruyère râpé, sel et poivre.",
        textEn: "Add 100g grated gruyère, salt and pepper.",
      },
      {
        step: 7,
        text: "Dresser des petits tas sur plaque et cuire 25 minutes.",
        textEn: "Pipe small mounds on a baking sheet and bake 25 minutes.",
      },
    ],
  },
  {
    id: "pate-a-choux",
    name: "Pâte à choux",
    nameEn: "Choux pastry",
    description:
      "La base des éclairs, choux et chouquettes. Une technique à maîtriser !",
    descriptionEn:
      "The base for éclairs, cream puffs and chouquettes. A technique to master!",
    eggsRequired: 4,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "medium",
    time: 50,
    image:
      "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&h=600&fit=crop&q=80",
    tags: ["dessert", "boulangerie", "technique"],
    tagsEn: ["dessert", "bakery", "technique"],
    servings: 12,
    instructions: [
      {
        step: 1,
        text: "Porter 25cl d'eau avec 100g de beurre et une pincée de sel à ébullition.",
        textEn:
          "Bring 25cl water with 100g butter and a pinch of salt to a boil.",
      },
      {
        step: 2,
        text: "Retirer du feu et ajouter 150g de farine d'un coup.",
        textEn: "Remove from heat and add 150g flour all at once.",
      },
      {
        step: 3,
        text: "Remuer vivement à la spatule jusqu'à obtenir une boule.",
        textEn: "Stir vigorously with a spatula until a ball forms.",
      },
      {
        step: 4,
        text: "Dessécher sur feu doux 1-2 minutes en remuant.",
        textEn: "Dry out over low heat for 1-2 minutes while stirring.",
      },
      {
        step: 5,
        text: "Laisser tiédir puis incorporer les oeufs un par un.",
        textEn: "Let cool slightly then add eggs one by one.",
      },
      {
        step: 6,
        text: "La pâte doit former un ruban épais qui retombe.",
        textEn: "The dough should form a thick ribbon that falls back.",
      },
      {
        step: 7,
        text: "Dresser et cuire selon la forme souhaitée à 180°C.",
        textEn: "Pipe and bake according to desired shape at 180°C.",
      },
    ],
  },
  {
    id: "oeufs-marines-soja",
    name: "Oeufs marinés au soja",
    nameEn: "Soy-marinated eggs",
    description:
      "Les oeufs des ramen, marinés dans une sauce soja sucrée. Addictifs !",
    descriptionEn: "Ramen eggs, marinated in sweet soy sauce. Addictive!",
    eggsRequired: 4,
    freshness: ["fresh", "cook-thoroughly"],
    difficulty: "easy",
    time: 25,
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop&q=80",
    tags: ["asiatique", "ramen", "umami"],
    tagsEn: ["asian", "ramen", "umami"],
    servings: 4,
    instructions: [
      {
        step: 1,
        text: "Cuire les oeufs mollets (6 min) ou mi-cuits (7 min).",
        textEn: "Soft-boil eggs (6 min) or medium-boil (7 min).",
      },
      {
        step: 2,
        text: "Les refroidir dans l'eau glacée et les écaler délicatement.",
        textEn: "Cool in ice water and peel gently.",
      },
      {
        step: 3,
        text: "Préparer la marinade : 100ml sauce soja, 100ml eau, 50ml mirin, 1 c.à.s sucre.",
        textEn:
          "Prepare marinade: 100ml soy sauce, 100ml water, 50ml mirin, 1 tbsp sugar.",
      },
      {
        step: 4,
        text: "Ajouter ail écrasé et gingembre râpé (optionnel).",
        textEn: "Add crushed garlic and grated ginger (optional).",
      },
      {
        step: 5,
        text: "Mettre les oeufs dans un sac ou bocal avec la marinade.",
        textEn: "Place eggs in a bag or jar with the marinade.",
      },
      {
        step: 6,
        text: "Réfrigérer au moins 4h, idéalement une nuit. Servir avec des ramen.",
        textEn: "Refrigerate at least 4h, ideally overnight. Serve with ramen.",
      },
    ],
  },
  {
    id: "oeufs-vinaigres",
    name: "Oeufs vinaigrés",
    nameEn: "Pickled eggs",
    description:
      "Une méthode de conservation traditionnelle. Parfaits avec une bière !",
    descriptionEn: "A traditional preservation method. Perfect with beer!",
    eggsRequired: 6,
    freshness: ["cook-thoroughly"],
    difficulty: "easy",
    time: 20,
    image:
      "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=800&h=600&fit=crop&q=80",
    tags: ["conserve", "anti-gaspi", "apéritif"],
    tagsEn: ["preserve", "anti-waste", "appetizer"],
    servings: 6,
    instructions: [
      {
        step: 1,
        text: "Cuire les oeufs durs, les refroidir et les écaler.",
        textEn: "Hard-boil eggs, cool and peel them.",
      },
      {
        step: 2,
        text: "Faire bouillir 50cl de vinaigre blanc avec 25cl d'eau et 2 c.à.s de sucre.",
        textEn: "Boil 50cl white vinegar with 25cl water and 2 tbsp sugar.",
      },
      {
        step: 3,
        text: "Ajouter sel, grains de poivre, laurier, moutarde en grains.",
        textEn: "Add salt, peppercorns, bay leaf, mustard seeds.",
      },
      {
        step: 4,
        text: "Mettre les oeufs dans un bocal stérilisé.",
        textEn: "Put the eggs in a sterilized jar.",
      },
      {
        step: 5,
        text: "Verser le vinaigre chaud sur les oeufs et fermer.",
        textEn: "Pour the hot vinegar over the eggs and seal.",
      },
      {
        step: 6,
        text: "Laisser mariner au frigo au moins 2 jours avant de déguster.",
        textEn: "Let marinate in the fridge at least 2 days before eating.",
      },
    ],
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

/**
 * Get all unique tags from recipes
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  RECIPES.forEach((r) => r.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

/**
 * Get recipes by tag
 */
export function getRecipesByTag(tag: string): Recipe[] {
  return RECIPES.filter((r) => r.tags.includes(tag));
}
