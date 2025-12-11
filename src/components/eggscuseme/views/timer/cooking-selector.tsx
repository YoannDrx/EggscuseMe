"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export type CookingType = "soft" | "medium" | "hard";

type CookingOption = {
  id: CookingType;
  label: string;
  description: string;
  time: number; // seconds
};

const cookingOptions: CookingOption[] = [
  {
    id: "soft",
    label: "Coque",
    description: "Blanc pris, jaune coulant",
    time: 180,
  },
  { id: "medium", label: "Mollet", description: "Jaune crémeux", time: 360 },
  { id: "hard", label: "Dur", description: "Jaune ferme", time: 600 },
];

type CookingSelectorProps = {
  selected: CookingType;
  onSelect: (type: CookingType) => void;
  disabled?: boolean;
};

export function CookingSelector({
  selected,
  onSelect,
  disabled = false,
}: CookingSelectorProps) {
  return (
    <div className="relative flex w-full gap-2">
      {cookingOptions.map((option) => {
        const isSelected = selected === option.id;

        return (
          <motion.button
            key={option.id}
            onClick={() => onSelect(option.id)}
            disabled={disabled}
            className={cn(
              "relative flex-1 rounded-[var(--radius-neo-xl)] px-3 py-4 transition-colors",
              "focus-visible:ring-neo-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              isSelected ? "text-neo-accent-foreground" : "text-neo-text",
              disabled && "pointer-events-none opacity-50",
            )}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
          >
            {isSelected && (
              <motion.div
                layoutId="cooking-selector-pill"
                className="bg-neo-accent border-neo-border absolute inset-0 rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)] shadow-[var(--shadow-neo-md)]"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                }}
              />
            )}

            <div className="relative z-10 text-center">
              <span className="block text-lg font-bold">{option.label}</span>
              <span
                className={cn(
                  "block text-xs",
                  isSelected
                    ? "text-neo-accent-foreground/80"
                    : "text-neo-text-muted",
                )}
              >
                {option.description}
              </span>
              <span
                className={cn(
                  "mt-1 block text-sm font-medium",
                  isSelected
                    ? "text-neo-accent-foreground/90"
                    : "text-neo-text-muted",
                )}
              >
                {Math.floor(option.time / 60)} min
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

export function getCookingTime(type: CookingType): number {
  const option = cookingOptions.find((o) => o.id === type);
  return option?.time ?? 360;
}
