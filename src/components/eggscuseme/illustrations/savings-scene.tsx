"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Eggy } from "@/features/mascot/components/eggy";

type SavingsSceneProps = {
  className?: string;
};

export function SavingsScene({ className }: SavingsSceneProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Confetti particles */}
      {[...Array(8)].map((_, i) => {
        const colors = [
          "bg-amber-400",
          "bg-emerald-400",
          "bg-pink-400",
          "bg-blue-400",
        ];
        return (
          <motion.div
            key={i}
            className={cn(
              "absolute h-2 w-2 rounded-sm",
              colors[i % colors.length],
            )}
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0, 1, 1, 0],
              rotate: [0, 180, 360],
              y: [0, -20, -40, -60],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeOut",
            }}
          />
        );
      })}

      {/* Eggy celebrating */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
      >
        <Eggy mood="celebrating" size="lg" />
      </motion.div>

      {/* Coins/savings icons */}
      <motion.div
        className="absolute -right-4 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-stone-900"
        animate={{
          y: [0, -5, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        €
      </motion.div>

      <motion.div
        className="absolute top-0 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-xs font-bold text-white"
        animate={{
          y: [0, -8, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        CO₂
      </motion.div>
    </div>
  );
}
