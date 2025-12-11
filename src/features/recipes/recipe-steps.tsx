"use client";

import {
  NeoCard,
  NeoCardContent,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import { cn } from "@/lib/utils";
import { ClipboardList } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Recipe } from "./types";
import { getInstructionText } from "./lib/recipe-i18n";

type RecipeStepsProps = {
  instructions: Recipe["instructions"];
  className?: string;
};

export function RecipeSteps({ instructions, className }: RecipeStepsProps) {
  const locale = useLocale();
  const t = useTranslations("recipes.detail");

  return (
    <NeoCard variant="elevated" className={cn("", className)}>
      <NeoCardHeader>
        <NeoCardTitle className="flex items-center gap-2">
          <ClipboardList className="size-5" />
          {t("instructions")}
        </NeoCardTitle>
      </NeoCardHeader>
      <NeoCardContent className="space-y-4">
        {instructions.map((instruction) => (
          <div key={instruction.step} className="flex gap-4">
            <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full font-bold">
              {instruction.step}
            </div>
            <div className="flex-1 pt-1">
              <p className="text-foreground leading-relaxed">
                {getInstructionText(instruction, locale)}
              </p>
            </div>
          </div>
        ))}
      </NeoCardContent>
    </NeoCard>
  );
}
