"use client";

import { cn } from "@/lib/utils";
import { Egg, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { DEMO_RECIPES } from "../demo-data";
import { DemoRecipeCard } from "./demo-recipe-card";

export function DemoRecipesView() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "inline-flex items-center gap-2 self-start",
          "rounded-full px-3 py-1.5",
          "bg-neo-accent/20 text-neo-accent",
        )}
      >
        <Sparkles className="size-4" />
        <span className="text-sm font-medium">Pour vous</span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
            "bg-neo-card text-neo-text-muted text-xs",
          )}
        >
          <Egg className="size-3" />6 oeufs
        </span>
      </motion.div>

      {/* Recipes list */}
      <div className="space-y-3">
        {DEMO_RECIPES.slice(0, 3).map((recipe, index) => (
          <DemoRecipeCard key={recipe.id} recipe={recipe} index={index} />
        ))}
      </div>
    </div>
  );
}
