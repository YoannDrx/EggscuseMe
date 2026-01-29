"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type FallingPetalsProps = {
  className?: string;
  count?: number;
};

export function FallingPetals({ className, count = 15 }: FallingPetalsProps) {
  const petals = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 6,
    size: 8 + Math.random() * 8,
  }));

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden",
        className,
      )}
    >
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{ left: petal.left, top: "-20px" }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, 30, -20, 40, 0],
            rotate: [0, 180, 360, 540, 720],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 20 20"
            fill="none"
          >
            <ellipse
              cx="10"
              cy="10"
              rx="8"
              ry="5"
              fill="var(--zen-sakura)"
              opacity="0.7"
              transform="rotate(45 10 10)"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
