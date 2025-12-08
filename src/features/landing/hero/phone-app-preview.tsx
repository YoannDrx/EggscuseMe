"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Refrigerator, Timer, ChefHat, BarChart3, User } from "lucide-react";

const eggCards = [
  {
    status: "Extra Frais",
    statusColor: "bg-fresh-extra",
    textColor: "text-fresh-extra",
    suggestion: "Mousse choco",
    quantity: 6,
    daysLeft: "J-4",
    progress: 85,
  },
  {
    status: "Frais",
    statusColor: "bg-fresh",
    textColor: "text-fresh",
    suggestion: "Omelette",
    quantity: 4,
    daysLeft: "J-12",
    progress: 55,
  },
  {
    status: "A cuire",
    statusColor: "bg-fresh-cook",
    textColor: "text-fresh-cook",
    suggestion: "Oeuf dur",
    quantity: 2,
    daysLeft: "J-25",
    progress: 15,
  },
];

const navItems = [
  { icon: Refrigerator, label: "Frigo", active: true },
  { icon: Timer, label: "Timer", active: false },
  { icon: ChefHat, label: "Guide", active: false },
  { icon: BarChart3, label: "Stats", active: false },
];

export function PhoneAppPreview({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Status Bar */}
      <div className="flex h-12 items-center justify-between px-6 pt-8">
        <span className="text-xs font-medium text-stone-400">9:41</span>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-4 rounded-sm bg-stone-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-stone-400" />
          <div className="h-2.5 w-5 rounded-sm border border-stone-400">
            <div className="h-full w-3/4 rounded-sm bg-emerald-400" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h2 className="text-xl font-bold text-white">Mon Frigo</h2>
          <p className="text-xs text-stone-500">3 boites en cours</p>
        </div>
        <div className="flex size-9 items-center justify-center rounded-full bg-amber-400/20">
          <User className="size-4 text-amber-400" />
        </div>
      </div>

      {/* Egg Cards */}
      <div className="flex-1 space-y-3 overflow-hidden px-5 pb-4">
        {eggCards.map((card, index) => (
          <motion.div
            key={card.status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.15, duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 p-4"
          >
            {/* Header Row */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("size-2 rounded-full", card.statusColor)} />
                <span className={cn("text-sm font-bold", card.textColor)}>
                  {card.status}
                </span>
              </div>
              <span className="text-xs text-stone-500">{card.daysLeft}</span>
            </div>

            {/* Content Row */}
            <div className="flex items-end justify-between">
              <span className="text-xs text-stone-400">
                Pour: {card.suggestion}
              </span>
              <span className="text-xl font-bold text-white">
                {card.quantity}{" "}
                <span className="text-xs font-normal text-stone-500">
                  oeufs
                </span>
              </span>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-stone-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${card.progress}%` }}
                transition={{ delay: 0.5 + index * 0.15, duration: 0.6 }}
                className={cn("h-full", card.statusColor)}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAB Button */}
      <div className="absolute right-5 bottom-24">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
          className="flex size-14 items-center justify-center rounded-full bg-amber-400 shadow-lg"
        >
          <span className="text-2xl font-bold text-stone-900">+</span>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-stone-800 bg-stone-900/80 px-2 pt-2 pb-6 backdrop-blur-sm">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl py-2 transition-colors",
                item.active
                  ? "bg-amber-400/20 text-amber-400"
                  : "text-stone-500 hover:text-stone-300",
              )}
            >
              <item.icon className="size-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
