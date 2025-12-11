"use client";

import { cn } from "@/lib/utils";
import { EggyChefMix } from "@/features/mascot/components/eggy-sticker-components";
import { PiggyBank, Plus } from "lucide-react";
import { motion } from "motion/react";
import { DEMO_EGG_BOXES } from "../demo-data";
import { DemoEggBoxCard } from "./demo-egg-box-card";

const SUMMARY_CARDS = [
  {
    label: "ECONOMIES",
    value: "0.00\u20AC",
    sublabel: "economises environ",
    icon: PiggyBank,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

export function DemoFridgeView() {
  return (
    <div className="flex flex-col gap-4">
      {/* Summary Card */}
      <div className="flex gap-3">
        {SUMMARY_CARDS.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 }}
            className={cn(
              "border-neo-border bg-neo-card flex-1 rounded-[var(--radius-neo-xl)]",
              "border-[length:var(--border-neo)] p-4",
              "shadow-[var(--shadow-neo-sm)]",
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-neo-text-muted text-xs font-medium tracking-wide uppercase">
                {card.label}
              </span>
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full",
                  card.bg,
                )}
              >
                <card.icon className={cn("size-4", card.color)} />
              </div>
            </div>
            <div className="text-neo-text text-2xl font-bold">{card.value}</div>
            <p className="text-neo-text-muted text-xs">{card.sublabel}</p>
          </motion.div>
        ))}
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EggyChefMix className="size-12" />
          <div>
            <h3 className="text-neo-text font-bold">Vos boites d'oeufs</h3>
            <p className="text-neo-text-muted text-xs">1 boite active</p>
          </div>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          className={cn(
            "border-neo-border bg-neo-card text-neo-text",
            "flex items-center gap-2 rounded-full",
            "border-[length:var(--border-neo)] px-4 py-2",
            "shadow-[var(--shadow-neo-sm)]",
            "hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-md)]",
          )}
        >
          <Plus className="size-4" />
          <span className="text-sm font-medium">Ajouter</span>
        </motion.button>
      </div>

      {/* Egg Boxes */}
      <div className="space-y-3">
        {DEMO_EGG_BOXES.map((box, index) => (
          <DemoEggBoxCard key={box.id} eggBox={box} index={index} />
        ))}
      </div>
    </div>
  );
}
