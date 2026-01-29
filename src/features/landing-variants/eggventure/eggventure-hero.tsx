"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { ChevronDown, Sparkles } from "lucide-react";

type EggventureHeroProps = {
  className?: string;
};

export function EggventureHero({ className }: EggventureHeroProps) {
  return (
    <section
      id="prologue"
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden",
        "bg-gradient-to-b from-[var(--egv-dawn)] via-[var(--egv-dawn)] to-[var(--egv-morning)]/20",
        className,
      )}
    >
      {/* Floating decorative eggs */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingEgg delay={0} className="top-[20%] left-[10%]" size="lg" />
        <FloatingEgg delay={1.5} className="top-[30%] right-[15%]" size="md" />
        <FloatingEgg
          delay={0.8}
          className="bottom-[25%] left-[20%]"
          size="sm"
        />
        <FloatingEgg delay={2} className="right-[25%] bottom-[35%]" size="md" />
        <FloatingEgg delay={1.2} className="top-[50%] left-[5%]" size="sm" />
        <FloatingEgg delay={0.5} className="top-[60%] right-[8%]" size="lg" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "mb-8 inline-flex items-center gap-2 rounded-full",
            "bg-[var(--egv-noon)]/20 px-4 py-2",
            "border-2 border-[var(--egv-noon)]/30",
          )}
        >
          <Sparkles className="size-4 text-[var(--egv-sunset)]" />
          <span className="text-sm font-bold text-[var(--egv-night)]">
            Il etait une fois...
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-5xl font-bold text-[var(--egv-night)] sm:text-6xl lg:text-7xl"
        >
          L&apos;aventure d&apos;un{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-[var(--egv-sunset)]">oeuf</span>
            <motion.svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 200 12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <motion.path
                d="M5 8 Q50 2 100 8 T195 6"
                fill="none"
                stroke="var(--egv-noon)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </motion.svg>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-[var(--egv-night)]/70 sm:text-xl"
        >
          De la ponte a votre assiette, suivez le voyage extraordinaire de vos
          oeufs et decouvrez comment ne plus jamais gaspiller.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/auth/signin"
            className={cn(
              "group relative inline-flex items-center gap-2 rounded-full px-8 py-4",
              "bg-[var(--egv-night)] text-[var(--egv-dawn)]",
              "text-lg font-bold",
              "shadow-[4px_4px_0_var(--egv-sunset)]",
              "transition-all hover:translate-x-[2px] hover:translate-y-[2px]",
              "hover:shadow-[2px_2px_0_var(--egv-sunset)]",
            )}
          >
            Commencer l&apos;aventure
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              &rarr;
            </motion.span>
          </Link>

          <a
            href="#frigo"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-6 py-4",
              "border-2 border-[var(--egv-night)]/20 text-[var(--egv-night)]",
              "font-medium transition-colors hover:border-[var(--egv-night)]/40",
            )}
          >
            Decouvrir l&apos;histoire
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.a
          href="#frigo"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-[var(--egv-night)]/50"
        >
          <span className="text-xs font-medium tracking-widest uppercase">
            Scroll
          </span>
          <ChevronDown className="size-5" />
        </motion.a>
      </motion.div>

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--egv-morning)]/30 to-transparent" />
    </section>
  );
}

type FloatingEggProps = {
  delay: number;
  className?: string;
  size: "sm" | "md" | "lg";
};

function FloatingEgg({ delay, className, size }: FloatingEggProps) {
  const sizes = {
    sm: "w-8 h-10",
    md: "w-12 h-16",
    lg: "w-16 h-20",
  };

  return (
    <motion.div
      className={cn("absolute", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.6, y: 0 }}
      transition={{ delay, duration: 0.8 }}
    >
      <motion.svg
        className={sizes[size]}
        viewBox="0 0 40 50"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4 + delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ellipse
          cx="20"
          cy="28"
          rx="18"
          ry="22"
          fill="var(--egv-dawn)"
          stroke="var(--egv-night)"
          strokeWidth="1.5"
          opacity="0.8"
        />
      </motion.svg>
    </motion.div>
  );
}
