"use client";

import { cn } from "@/lib/utils";
import { Clock, Egg, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import type { DemoRecipe } from "../demo-types";

type DemoRecipeCardProps = {
  recipe: DemoRecipe;
  index?: number;
};

const freshnessLabels = {
  "extra-fresh": "Recommande pour des oeufs extra-frais",
  fresh: "Recommande pour des oeufs frais",
  cook: "Ideal pour des oeufs a cuire",
};

const freshnessColors = {
  "extra-fresh": "text-fresh-extra",
  fresh: "text-fresh",
  cook: "text-fresh-cook",
};

const difficultyLabels = {
  easy: "Facile",
  medium: "Moyen",
  hard: "Difficile",
};

export function DemoRecipeCard({ recipe, index = 0 }: DemoRecipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className={cn(
        "border-neo-border bg-neo-card rounded-[var(--radius-neo-xl)]",
        "border-[length:var(--border-neo)] p-4",
        "shadow-[var(--shadow-neo-sm)]",
      )}
    >
      {/* Title */}
      <h4 className="text-neo-text mb-1 font-bold">{recipe.name}</h4>

      {/* Freshness recommendation */}
      <p
        className={cn(
          "mb-2 text-xs font-medium",
          freshnessColors[recipe.freshnessRequired],
        )}
      >
        {freshnessLabels[recipe.freshnessRequired]}
      </p>

      {/* Description */}
      <p className="text-neo-text-muted mb-3 line-clamp-2 text-xs">
        {recipe.description}
      </p>

      {/* Meta info */}
      <div className="mb-3 flex flex-wrap gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-1",
            "bg-neo-bg text-neo-text-muted text-xs",
          )}
        >
          <Clock className="size-3" />
          {recipe.time} min
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-1",
            "bg-neo-bg text-neo-text-muted text-xs",
          )}
        >
          <Egg className="size-3" />
          {recipe.eggsRequired} oeufs
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-1",
            "bg-neo-bg text-neo-text-muted text-xs",
          )}
        >
          <Sparkles className="size-3" />
          {difficultyLabels[recipe.difficulty]}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {recipe.tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              "rounded-full px-2 py-0.5 text-xs",
              "border-neo-border/50 border",
              "text-neo-text-muted",
            )}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
