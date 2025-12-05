"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronRight, Clock, Info } from "lucide-react";
import { useState } from "react";
import { Eggy } from "@/features/mascot/components/eggy";
import { useThemeColors } from "../../theme";
import { BottomSheet, PageHeader } from "../../shared";

type FreshnessLevel = "extra-fresh" | "fresh" | "cook" | "expired";

type Recipe = {
  id: string;
  name: string;
  description: string;
  cookingTime: string;
  difficulty: "facile" | "moyen" | "expert";
};

type FreshnessSection = {
  level: FreshnessLevel;
  label: string;
  days: string;
  color: string;
  bgColor: string;
  description: string;
  recipes: Recipe[];
};

const freshnessSections: FreshnessSection[] = [
  {
    level: "extra-fresh",
    label: "Extra Frais",
    days: "0-9 jours",
    color: "text-fresh-extra",
    bgColor: "bg-fresh-extra",
    description: "Idéal pour les préparations crues et cuissons délicates",
    recipes: [
      {
        id: "1",
        name: "Oeuf à la coque",
        description: "3 min dans l'eau bouillante",
        cookingTime: "3 min",
        difficulty: "facile",
      },
      {
        id: "2",
        name: "Oeuf poché",
        description: "Dans l'eau frémissante avec vinaigre",
        cookingTime: "4 min",
        difficulty: "moyen",
      },
      {
        id: "3",
        name: "Mayonnaise maison",
        description: "Jaune d'oeuf + huile + moutarde",
        cookingTime: "10 min",
        difficulty: "moyen",
      },
      {
        id: "4",
        name: "Mousse au chocolat",
        description: "Blancs montés en neige",
        cookingTime: "20 min",
        difficulty: "moyen",
      },
    ],
  },
  {
    level: "fresh",
    label: "Frais",
    days: "10-21 jours",
    color: "text-fresh",
    bgColor: "bg-fresh",
    description: "Parfait pour les omelettes et la pâtisserie",
    recipes: [
      {
        id: "5",
        name: "Omelette baveuse",
        description: "Cuisson rapide à feu vif",
        cookingTime: "5 min",
        difficulty: "facile",
      },
      {
        id: "6",
        name: "Oeufs brouillés",
        description: "Cuisson douce au bain-marie",
        cookingTime: "8 min",
        difficulty: "facile",
      },
      {
        id: "7",
        name: "Crêpes",
        description: "Pâte reposée 1h minimum",
        cookingTime: "30 min",
        difficulty: "facile",
      },
      {
        id: "8",
        name: "Gâteau au yaourt",
        description: "Le classique des goûters",
        cookingTime: "45 min",
        difficulty: "facile",
      },
    ],
  },
  {
    level: "cook",
    label: "À cuire",
    days: "22-28 jours",
    color: "text-fresh-cook",
    bgColor: "bg-fresh-cook",
    description: "Cuisson à coeur obligatoire",
    recipes: [
      {
        id: "9",
        name: "Oeuf dur",
        description: "10 min dans l'eau bouillante",
        cookingTime: "10 min",
        difficulty: "facile",
      },
      {
        id: "10",
        name: "Oeuf mimosa",
        description: "Oeuf dur farci de mayonnaise",
        cookingTime: "15 min",
        difficulty: "facile",
      },
      {
        id: "11",
        name: "Salade niçoise",
        description: "Avec thon et olives",
        cookingTime: "20 min",
        difficulty: "facile",
      },
    ],
  },
  {
    level: "expired",
    label: "Périmé",
    days: "29+ jours",
    color: "text-expired",
    bgColor: "bg-expired",
    description: "Ne pas consommer - jeter",
    recipes: [],
  },
];

export function GuideView() {
  const colors = useThemeColors();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [expandedSection, setExpandedSection] = useState<FreshnessLevel | null>(
    "extra-fresh",
  );

  const toggleSection = (level: FreshnessLevel) => {
    setExpandedSection((prev) => (prev === level ? null : level));
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Guide"
        subtitle="Recettes selon fraîcheur"
        eggyMood="cooking"
      />

      {/* Content */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-24">
        {/* Intro Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex items-start gap-3 rounded-2xl border p-4",
            colors.card,
            colors.cardBorder,
          )}
        >
          <div className={cn("rounded-full p-2", colors.accentSoft)}>
            <Info size={18} className={colors.accent} />
          </div>
          <div>
            <p className={cn("text-sm", colors.text)}>
              Chaque oeuf a sa recette idéale selon sa fraîcheur.
            </p>
            <p className={cn("mt-1 text-xs", colors.textMuted)}>
              Plus l'oeuf est frais, plus les cuissons délicates sont possibles.
            </p>
          </div>
        </motion.div>

        {/* Freshness Sections */}
        {freshnessSections.map((section, index) => (
          <motion.div
            key={section.level}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "overflow-hidden rounded-2xl border",
              colors.card,
              colors.cardBorder,
            )}
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.level)}
              className={cn(
                "flex w-full items-center justify-between p-4 text-left transition-colors",
                colors.cardHover,
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("h-3 w-3 rounded-full", section.bgColor)} />
                <div>
                  <span className={cn("font-bold", section.color)}>
                    {section.label}
                  </span>
                  <span className={cn("ml-2 text-sm", colors.textMuted)}>
                    {section.days}
                  </span>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expandedSection === section.level ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={20} className={colors.textMuted} />
              </motion.div>
            </button>

            {/* Section Content */}
            <motion.div
              initial={false}
              animate={{
                height: expandedSection === section.level ? "auto" : 0,
                opacity: expandedSection === section.level ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-current/5 p-4">
                <p className={cn("mb-3 text-sm", colors.textMuted)}>
                  {section.description}
                </p>

                {section.recipes.length > 0 ? (
                  <div className="space-y-2">
                    {section.recipes.map((recipe) => (
                      <button
                        key={recipe.id}
                        onClick={() => setSelectedRecipe(recipe)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl p-3 text-left transition-colors",
                          colors.bgSecondary,
                          "hover:opacity-80",
                        )}
                      >
                        <div>
                          <span className={cn("font-medium", colors.text)}>
                            {recipe.name}
                          </span>
                          <div
                            className={cn(
                              "mt-1 flex items-center gap-2 text-xs",
                              colors.textMuted,
                            )}
                          >
                            <Clock size={12} />
                            <span>{recipe.cookingTime}</span>
                            <span className="opacity-50">|</span>
                            <span>{recipe.difficulty}</span>
                          </div>
                        </div>
                        <ChevronRight size={16} className={colors.textMuted} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4 text-center">
                    <Eggy mood="expired-warning" size="sm" className="mb-2" />
                    <p className={cn("text-sm", colors.textMuted)}>
                      Aucune recette - oeufs à jeter
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Recipe Detail Sheet */}
      <BottomSheet
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        title={selectedRecipe?.name}
      >
        {selectedRecipe && (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Eggy mood="cooking" size="md" />
            </div>

            <p className={cn("text-center", colors.text)}>
              {selectedRecipe.description}
            </p>

            <div
              className={cn(
                "flex justify-center gap-4 rounded-xl p-3",
                colors.bgSecondary,
              )}
            >
              <div className="text-center">
                <Clock
                  size={20}
                  className={cn("mx-auto mb-1", colors.accent)}
                />
                <span className={cn("text-sm", colors.text)}>
                  {selectedRecipe.cookingTime}
                </span>
              </div>
              <div className="text-center">
                <Info size={20} className={cn("mx-auto mb-1", colors.accent)} />
                <span className={cn("text-sm", colors.text)}>
                  {selectedRecipe.difficulty}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedRecipe(null)}
              className={cn(
                "w-full rounded-xl py-4 font-bold text-white shadow-md transition-opacity hover:opacity-90",
                colors.accentBg,
              )}
            >
              Compris !
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
