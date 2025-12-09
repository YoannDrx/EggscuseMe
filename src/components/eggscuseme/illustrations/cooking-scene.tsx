"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Eggy } from "@/features/mascot/components/eggy";

type CookingSceneProps = {
  className?: string;
};

export function CookingScene({ className }: CookingSceneProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Steam particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute -top-4 h-2 w-2 rounded-full bg-stone-300 dark:bg-stone-600"
          style={{ left: `${40 + i * 10}%` }}
          animate={{
            y: [0, -20, -40],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Pan shape */}
      <motion.div
        className="absolute bottom-0 h-4 w-32 rounded-b-full bg-stone-400 dark:bg-stone-600"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      />

      {/* Eggy cooking */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      >
        <Eggy mood="cooking" size="lg" />
      </motion.div>
    </div>
  );
}
