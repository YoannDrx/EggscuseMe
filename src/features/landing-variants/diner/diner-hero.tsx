"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { NeonSign } from "./neon-sign";
import { CheckeredPattern } from "./checkered-pattern";

type DinerHeroProps = {
  className?: string;
};

export function DinerHero({ className }: DinerHeroProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden",
        "bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#1a1a2e]",
        className,
      )}
    >
      {/* Checkered floor at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1/3">
        <CheckeredPattern />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[#1a1a2e]" />
      </div>

      {/* Decorative neon lines */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--diner-neon-pink)] to-transparent opacity-30"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-2/3 right-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--diner-turquoise)] to-transparent opacity-30"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Neon Open Sign */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div
            className="mx-auto inline-block rounded-lg border-4 border-[var(--diner-neon-pink)] px-6 py-2"
            style={{
              boxShadow:
                "0 0 10px var(--diner-neon-pink), 0 0 20px var(--diner-neon-pink), inset 0 0 10px var(--diner-neon-pink)",
            }}
          >
            <span
              className="font-heading text-xl font-bold tracking-widest text-[var(--diner-neon-pink)] uppercase"
              style={{
                textShadow: "0 0 10px var(--diner-neon-pink)",
              }}
            >
              Open 24h
            </span>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <NeonSign text="Sunny Side" color="yellow" size="lg" />
          <div className="mt-2">
            <NeonSign text="Diner" color="pink" size="lg" />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-heading mt-8 text-xl text-[var(--diner-cream)] sm:text-2xl"
        >
          La fraicheur de vos oeufs, servie avec style
        </motion.p>

        {/* Animated Egg */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="my-12"
        >
          <SunnySideEgg />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/auth/signin"
            className={cn(
              "group relative inline-flex items-center gap-2 rounded-full px-8 py-4",
              "bg-[var(--diner-red)] text-white",
              "font-heading text-lg font-bold tracking-wider uppercase",
              "border-4 border-[var(--diner-chrome)]",
              "shadow-[4px_4px_0_var(--diner-chrome)]",
              "transition-all hover:translate-x-[2px] hover:translate-y-[2px]",
              "hover:shadow-[2px_2px_0_var(--diner-chrome)]",
            )}
          >
            Prendre une table
          </Link>

          <a
            href="#menu"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-6 py-4",
              "border-2 border-[var(--diner-turquoise)] text-[var(--diner-turquoise)]",
              "font-heading font-bold tracking-wider uppercase",
              "transition-colors hover:bg-[var(--diner-turquoise)]/10",
            )}
          >
            Voir le menu
          </a>
        </motion.div>
      </div>

      {/* Jukebox decoration hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
      >
        <div className="font-heading text-sm tracking-widest text-[var(--diner-cream)]/50 uppercase">
          Scroll pour decouvrir
        </div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-2 text-[var(--diner-cream)]/50"
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
}

function SunnySideEgg() {
  return (
    <motion.svg
      width="200"
      height="150"
      viewBox="0 0 200 150"
      fill="none"
      className="mx-auto"
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Pan */}
      <ellipse
        cx="100"
        cy="120"
        rx="90"
        ry="25"
        fill="#333"
        stroke="var(--diner-chrome)"
        strokeWidth="3"
      />

      {/* Egg white */}
      <ellipse cx="100" cy="85" rx="70" ry="50" fill="white" opacity="0.95" />

      {/* Egg yolk */}
      <motion.ellipse
        cx="100"
        cy="80"
        rx="30"
        ry="28"
        fill="var(--diner-neon-yellow)"
        animate={{
          filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        style={{
          filter: "drop-shadow(0 0 10px var(--diner-neon-yellow))",
        }}
      />

      {/* Yolk highlight */}
      <ellipse cx="90" cy="72" rx="8" ry="6" fill="white" opacity="0.4" />

      {/* Steam */}
      <motion.g
        animate={{
          y: [0, -20],
          opacity: [0.6, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      >
        <path
          d="M80 40 Q75 30 80 20 Q85 10 80 0"
          stroke="white"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M100 35 Q95 25 100 15 Q105 5 100 -5"
          stroke="white"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M120 40 Q115 30 120 20 Q125 10 120 0"
          stroke="white"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
      </motion.g>
    </motion.svg>
  );
}
