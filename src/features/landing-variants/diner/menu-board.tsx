"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type MenuBoardProps = {
  title: string;
  items: {
    name: string;
    description: string;
    price?: string;
  }[];
  className?: string;
};

export function MenuBoard({ title, items, className }: MenuBoardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -15 }}
      whileInView={{ opacity: 1, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        "relative rounded-xl border-4 border-[var(--diner-chrome)] bg-[#1a1a2e] p-6",
        "shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),_0_4px_20px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      {/* Chrome rivets */}
      <div className="absolute top-3 left-3 size-3 rounded-full bg-[var(--diner-chrome)] shadow-inner" />
      <div className="absolute top-3 right-3 size-3 rounded-full bg-[var(--diner-chrome)] shadow-inner" />
      <div className="absolute bottom-3 left-3 size-3 rounded-full bg-[var(--diner-chrome)] shadow-inner" />
      <div className="absolute right-3 bottom-3 size-3 rounded-full bg-[var(--diner-chrome)] shadow-inner" />

      {/* Title */}
      <h3
        className="font-heading mb-6 text-center text-2xl font-bold text-[var(--diner-neon-yellow)]"
        style={{
          textShadow: "0 0 10px var(--diner-neon-yellow)",
        }}
      >
        {title}
      </h3>

      {/* Items */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start justify-between gap-4"
          >
            <div>
              <h4 className="font-heading text-lg font-bold text-[var(--diner-cream)]">
                {item.name}
              </h4>
              <p className="text-sm text-[var(--diner-cream)]/60">
                {item.description}
              </p>
            </div>
            {item.price && (
              <span className="font-heading shrink-0 text-lg font-bold text-[var(--diner-neon-pink)]">
                {item.price}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
