"use client";

import { cn } from "@/lib/utils";
import { Egg, Flame, PiggyBank, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { DEMO_STATS } from "../demo-data";

const STAT_CARDS = [
  {
    label: "Stock actuel",
    value: DEMO_STATS.totalEggs,
    suffix: "oeufs",
    icon: Egg,
    color: "text-neo-accent",
    bg: "bg-neo-accent/10",
  },
  {
    label: "Consommes",
    value: DEMO_STATS.consumed,
    suffix: "oeufs",
    icon: TrendingUp,
    color: "text-fresh-extra",
    bg: "bg-fresh-extra/10",
  },
  {
    label: "Economies",
    value: DEMO_STATS.savings.toFixed(2),
    suffix: "EUR",
    icon: PiggyBank,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Serie",
    value: DEMO_STATS.streak,
    suffix: "jours",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

export function DemoStatsView() {
  return (
    <div className="flex flex-col gap-3">
      {/* Stat Cards Stack */}
      <div className="flex flex-col gap-2">
        {STAT_CARDS.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className={cn(
              "border-neo-border bg-neo-card rounded-[var(--radius-neo-xl)]",
              "border-[length:var(--border-neo)] p-3",
              "shadow-[var(--shadow-neo-sm)]",
              "flex items-center gap-3",
            )}
          >
            <div
              className={cn(
                "flex size-10 flex-shrink-0 items-center justify-center rounded-full",
                card.bg,
              )}
            >
              <card.icon className={cn("size-5", card.color)} />
            </div>
            <div className="flex-1">
              <p className="text-neo-text-muted text-xs">{card.label}</p>
              <div className="text-neo-text text-xl font-bold">
                {card.value}
                {card.suffix && (
                  <span className="text-neo-text-muted ml-1 text-xs">
                    {card.suffix}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weekly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={cn(
          "border-neo-border bg-neo-card rounded-[var(--radius-neo-xl)]",
          "border-[length:var(--border-neo)] p-4",
          "shadow-[var(--shadow-neo-sm)]",
        )}
      >
        <h4 className="text-neo-text mb-4 text-sm font-bold">Cette semaine</h4>

        {/* Bar Chart */}
        <div className="flex h-24 items-end justify-between gap-2">
          {DEMO_STATS.weeklyData.map((item, index) => {
            const maxValue = Math.max(
              ...DEMO_STATS.weeklyData.map((d) => d.value),
            );
            const heightPercent = (item.value / maxValue) * 100;
            return (
              <div
                key={index}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                  className={cn(
                    "w-full rounded-t-sm",
                    item.value > 0 ? "bg-neo-accent" : "bg-neo-bg",
                  )}
                  style={{ minHeight: item.value > 0 ? 8 : 4 }}
                />
                <span className="text-neo-text-muted text-[10px]">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
