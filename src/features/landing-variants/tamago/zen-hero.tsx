"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { OrigamiEgg } from "./origami-egg";

type ZenHeroProps = {
  className?: string;
};

export function ZenHero({ className }: ZenHeroProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden",
        "bg-[var(--zen-washi)]",
        className,
      )}
    >
      {/* Ma - Empty space is intentional */}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        {/* Origami Egg */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="mb-12 flex justify-center"
        >
          <OrigamiEgg />
        </motion.div>

        {/* Title - Minimal */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-serif text-4xl font-light tracking-wide text-[var(--zen-sumi)] sm:text-5xl"
        >
          Tamago
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-4 font-serif text-lg text-[var(--zen-ink-light)]"
        >
          L&apos;art de ne rien gaspiller
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="mx-auto mt-8 h-px w-24 bg-[var(--zen-matcha)]"
        />

        {/* CTA - Subtle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12"
        >
          <Link
            href="/auth/signin"
            className={cn(
              "inline-block px-10 py-4",
              "border border-[var(--zen-sumi)] text-[var(--zen-sumi)]",
              "font-serif text-sm tracking-widest",
              "transition-all duration-500",
              "hover:bg-[var(--zen-sumi)] hover:text-[var(--zen-washi)]",
            )}
          >
            Decouvrir
          </Link>
        </motion.div>
      </div>

      {/* Scroll hint - Very subtle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="h-8 w-px bg-[var(--zen-sumi)]"
        />
      </motion.div>
    </section>
  );
}
