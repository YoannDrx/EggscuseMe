"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
};

const COLORS = [
  "#fbbf24", // amber-400
  "#f97316", // orange-500
  "#10b981", // emerald-500
  "#f472b6", // pink-400
  "#60a5fa", // blue-400
  "#a78bfa", // violet-400
];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 300,
    y: -Math.random() * 200 - 50,
    rotation: Math.random() * 720 - 360,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: Math.random() * 8 + 4,
    delay: Math.random() * 0.2,
  }));
}

type ConfettiBurstProps = {
  trigger: boolean;
  onComplete?: () => void;
  particleCount?: number;
  className?: string;
};

export function ConfettiBurst({
  trigger,
  onComplete,
  particleCount = 30,
  className,
}: ConfettiBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      setParticles(generateParticles(particleCount));

      const timer = setTimeout(() => {
        setIsActive(false);
        setParticles([]);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [trigger, isActive, particleCount, onComplete]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-[var(--z-toast)] overflow-hidden",
        className,
      )}
    >
      <AnimatePresence>
        {isActive && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  rotate: 0,
                  opacity: 1,
                }}
                animate={{
                  x: particle.x,
                  y: particle.y,
                  scale: 1,
                  rotate: particle.rotation,
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: particle.delay,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                style={{
                  position: "absolute",
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Hook to trigger confetti
 */
export function useConfetti() {
  const [trigger, setTrigger] = useState(false);

  const fire = useCallback(() => {
    setTrigger(true);
  }, []);

  const reset = useCallback(() => {
    setTrigger(false);
  }, []);

  return { trigger, fire, reset };
}
