"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export type CookingType = "soft" | "medium" | "hard";

type CookingOption = {
  id: CookingType;
  label: string;
  description: string;
  time: number; // seconds
  color: string;
};

const cookingOptions: CookingOption[] = [
  {
    id: "soft",
    label: "Coque",
    description: "Blanc pris, jaune coulant",
    time: 180,
    color: "#F97316", // Orange-500
  },
  {
    id: "medium",
    label: "Mollet",
    description: "Jaune crémeux",
    time: 360,
    color: "#EAB308", // Yellow-500
  },
  {
    id: "hard",
    label: "Dur",
    description: "Jaune ferme",
    time: 600,
    color: "#84CC16", // Lime-500 (representing fully cooked/fresh) - actually standard yolk yellow is better, let's stick to theme
  },
];

type CookingSelectorProps = {
  selected: CookingType;
  onSelect: (type: CookingType) => void;
  disabled?: boolean;
};

function EggVisual({
  type,
  isSelected,
}: {
  type: CookingType;
  isSelected: boolean;
}) {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      {/* Egg White Shape */}
      <svg
        viewBox="0 0 100 130"
        className={cn(
          "h-full w-full drop-shadow-sm transition-transform duration-300",
          isSelected ? "scale-110" : "scale-100",
        )}
      >
        <path
          d="M50 5 C 25 5, 5 35, 5 65 C 5 100, 25 125, 50 125 C 75 125, 95 100, 95 65 C 95 35, 75 5, 50 5 Z"
          fill="#FFFFFF"
          stroke={isSelected ? "#1C1917" : "#E5E7EB"}
          strokeWidth="3"
        />
        {/* Cut effect mask or just yolk overlay */}
      </svg>

      {/* Yolk */}
      <div className="absolute inset-0 flex items-center justify-center pt-4">
        <motion.div
          initial={false}
          animate={{
            backgroundColor:
              type === "soft"
                ? "#F97316" // Deep Orange
                : type === "medium"
                  ? "#FBBF24" // Amber
                  : "#FDE047", // Yellow
            scale: isSelected ? 1.1 : 1,
          }}
          className={cn(
            "rounded-full shadow-inner",
            type === "soft" && "h-5 w-5 opacity-90 blur-[1px]", // Runny
            type === "medium" && "h-6 w-6 opacity-95", // Creamy
            type === "hard" && "h-7 w-7 opacity-100", // Solid
          )}
        />
        {/* Shine on yolk for soft/medium */}
        {type !== "hard" && (
          <div className="absolute top-[45%] left-[45%] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-[0.5px]" />
        )}
      </div>
    </div>
  );
}

export function CookingSelector({
  selected,
  onSelect,
  disabled = false,
}: CookingSelectorProps) {
  return (
    <div className="grid w-full grid-cols-3 gap-3">
      {cookingOptions.map((option) => {
        const isSelected = selected === option.id;

        return (
          <motion.button
            key={option.id}
            onClick={() => onSelect(option.id)}
            disabled={disabled}
            className={cn(
              "relative flex flex-col items-center rounded-[1.25rem] border-[length:var(--border-neo)] p-2 py-4 transition-all",
              "focus-visible:ring-neo-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              isSelected
                ? "bg-neo-card border-neo-accent shadow-[var(--shadow-neo-md)]"
                : "bg-neo-bg/50 hover:bg-neo-bg border-transparent",
              disabled && "pointer-events-none opacity-50",
            )}
            whileHover={{ scale: disabled ? 1 : 1.02, y: -2 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
          >
            <div className="mb-2">
              <EggVisual type={option.id} isSelected={isSelected} />
            </div>

            <div className="flex flex-col items-center text-center">
              <span
                className={cn(
                  "text-sm font-bold",
                  isSelected ? "text-neo-text" : "text-neo-text-muted",
                )}
              >
                {option.label}
              </span>
              <span
                className={cn(
                  "mt-1 text-xs font-medium",
                  isSelected
                    ? "text-neo-accent-foreground"
                    : "text-neo-text-muted/70",
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
