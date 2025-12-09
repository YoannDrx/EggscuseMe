"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Eggy, type EggyMood } from "@/features/mascot/components/eggy";

type FreshnessLevel = {
  days: string;
  label: string;
  color: string;
  bgColor: string;
  mood: EggyMood;
  usage: string;
};

const freshnessLevels: FreshnessLevel[] = [
  {
    days: "0-9",
    label: "Extra-frais",
    color: "text-fresh-extra",
    bgColor: "bg-fresh-extra",
    mood: "fresh-extra",
    usage: "Coque, poché, cru",
  },
  {
    days: "10-21",
    label: "Frais",
    color: "text-fresh",
    bgColor: "bg-fresh",
    mood: "happy",
    usage: "Omelette, brouillés",
  },
  {
    days: "22-28",
    label: "À cuire",
    color: "text-fresh-cook",
    bgColor: "bg-fresh-cook",
    mood: "worried",
    usage: "Dur seulement",
  },
  {
    days: "29+",
    label: "Périmé",
    color: "text-expired",
    bgColor: "bg-expired",
    mood: "expired-warning",
    usage: "À jeter",
  },
];

type FreshnessTimelineProps = {
  className?: string;
};

export function FreshnessTimeline({ className }: FreshnessTimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Timeline bar */}
      <div className="absolute top-16 bottom-16 left-1/2 w-1 -translate-x-1/2 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
        <motion.div
          className="h-full w-full bg-gradient-to-b from-emerald-400 via-amber-400 via-orange-400 to-red-400"
          initial={{ scaleY: 0, originY: 0 }}
          whileInView={{ scaleY: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </div>

      {/* Levels */}
      <div className="relative space-y-8">
        {freshnessLevels.map((level, index) => (
          <motion.div
            key={level.label}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className={cn(
              "flex items-center gap-4",
              index % 2 === 0 ? "flex-row" : "flex-row-reverse",
            )}
          >
            {/* Content card */}
            <div
              className={cn(
                "flex-1 rounded-2xl border bg-white p-4 shadow-sm dark:bg-stone-900",
                "border-stone-200 dark:border-stone-800",
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("h-3 w-3 rounded-full", level.bgColor)} />
                <span className={cn("font-bold", level.color)}>
                  {level.days} jours
                </span>
              </div>
              <h4 className="mt-2 font-bold text-stone-900 dark:text-stone-100">
                {level.label}
              </h4>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                {level.usage}
              </p>
            </div>

            {/* Center dot */}
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                level.bgColor,
              )}
            >
              <Eggy mood={level.mood} size="sm" />
            </div>

            {/* Spacer for alternating layout */}
            <div className="flex-1" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
