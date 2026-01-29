"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { PixelEggy } from "./pixel-eggy";

type ArcadeHeroProps = {
  className?: string;
};

export function ArcadeHero({ className }: ArcadeHeroProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden",
        "bg-[var(--arcade-dark)]",
        className,
      )}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(var(--arcade-neon-pink) 1px, transparent 1px),
            linear-gradient(90deg, var(--arcade-neon-pink) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--arcade-purple)]/30 via-transparent to-[var(--arcade-dark)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Press Start */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="mb-8"
        >
          <span
            className="font-heading text-sm font-bold tracking-widest text-[var(--arcade-neon-cyan)] uppercase"
            style={{ textShadow: "0 0 10px var(--arcade-neon-cyan)" }}
          >
            Press Start to Play
          </span>
        </motion.div>

        {/* Pixel Eggy */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-8 flex justify-center"
        >
          <PixelEggy className="scale-150" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-heading text-6xl font-bold uppercase sm:text-7xl lg:text-8xl"
        >
          <span
            className="text-[var(--arcade-neon-yellow)]"
            style={{
              textShadow:
                "0 0 10px var(--arcade-neon-yellow), 0 0 20px var(--arcade-neon-yellow), 0 0 40px var(--arcade-neon-yellow)",
            }}
          >
            Egg
          </span>
          <span
            className="text-[var(--arcade-neon-pink)]"
            style={{
              textShadow:
                "0 0 10px var(--arcade-neon-pink), 0 0 20px var(--arcade-neon-pink), 0 0 40px var(--arcade-neon-pink)",
            }}
          >
            Mania
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-heading mt-6 text-xl text-white/80"
        >
          Le jeu qui sauve vos oeufs du game over!
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/auth/signin"
            className={cn(
              "group relative overflow-hidden rounded-lg px-10 py-4",
              "bg-[var(--arcade-neon-green)] text-[var(--arcade-dark)]",
              "font-heading text-xl font-bold uppercase",
              "transition-transform hover:scale-105",
            )}
            style={{
              boxShadow:
                "0 0 20px var(--arcade-neon-green), 0 0 40px var(--arcade-neon-green)",
            }}
          >
            <span className="relative z-10">1 Player</span>
          </Link>

          <a
            href="#powerups"
            className={cn(
              "rounded-lg border-2 border-[var(--arcade-neon-cyan)] px-8 py-4",
              "font-heading text-lg font-bold text-[var(--arcade-neon-cyan)] uppercase",
              "transition-all hover:bg-[var(--arcade-neon-cyan)]/10",
            )}
            style={{
              boxShadow: "0 0 10px var(--arcade-neon-cyan)",
            }}
          >
            How to Play
          </a>
        </motion.div>

        {/* High Score */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <p className="text-xs font-bold tracking-widest text-white/40 uppercase">
            High Score
          </p>
          <p
            className="font-heading mt-1 text-2xl font-bold text-[var(--arcade-neon-yellow)]"
            style={{ textShadow: "0 0 10px var(--arcade-neon-yellow)" }}
          >
            2,400,000 Eggs Saved
          </p>
        </motion.div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--arcade-dark)] to-transparent" />

      {/* Floating coins/stars */}
      <FloatingElements />
    </section>
  );
}

function FloatingElements() {
  const elements = [
    { left: "10%", delay: 0, color: "var(--arcade-neon-yellow)" },
    { left: "25%", delay: 0.5, color: "var(--arcade-neon-pink)" },
    { left: "75%", delay: 1, color: "var(--arcade-neon-cyan)" },
    { left: "90%", delay: 1.5, color: "var(--arcade-neon-green)" },
  ];

  return (
    <>
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute top-1/4"
          style={{ left: el.left }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 3,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="size-4 rotate-45"
            style={{
              backgroundColor: el.color,
              boxShadow: `0 0 10px ${el.color}, 0 0 20px ${el.color}`,
            }}
          />
        </motion.div>
      ))}
    </>
  );
}
