"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";

type EditorialHeroProps = {
  className?: string;
};

export function EditorialHero({ className }: EditorialHeroProps) {
  return (
    <section
      className={cn("relative min-h-screen bg-[var(--lab-paper)]", className)}
    >
      {/* Editorial Grid Layout */}
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-5">
        {/* Left Column - Main Content */}
        <div className="col-span-3 flex flex-col justify-center px-6 py-24 lg:px-12">
          {/* Issue Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="text-sm font-medium tracking-[0.3em] text-[var(--lab-ink)]/40 uppercase">
              Volume 01 &mdash; Edition 2024
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-6xl leading-[1.1] font-bold text-[var(--lab-ink)] sm:text-7xl lg:text-8xl"
          >
            La Science
            <br />
            de l&apos;Oeuf
            <span className="text-[var(--lab-gold)]">.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 max-w-lg font-serif text-xl leading-relaxed text-[var(--lab-ink)]/70"
          >
            Un guide complet pour comprendre, conserver et sublimer vos oeufs.
            De la ferme a votre assiette, decouvrez l&apos;art de la fraicheur.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center gap-6"
          >
            <Link
              href="/auth/signin"
              className={cn(
                "group inline-flex items-center gap-3 bg-[var(--lab-ink)] px-8 py-4",
                "text-sm font-medium tracking-widest text-[var(--lab-paper)] uppercase",
                "transition-all hover:bg-[var(--lab-charcoal)]",
              )}
            >
              Lire le guide
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                &rarr;
              </motion.span>
            </Link>

            <a
              href="#science"
              className="text-sm font-medium tracking-widest text-[var(--lab-ink)]/60 uppercase underline underline-offset-4 transition-colors hover:text-[var(--lab-ink)]"
            >
              Explorer
            </a>
          </motion.div>
        </div>

        {/* Right Column - Featured Image */}
        <div className="relative col-span-2 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <EditorialEggIllustration />
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute top-1/4 right-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-right"
            >
              <span className="font-serif text-9xl font-bold text-[var(--lab-gold)]/20">
                01
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[var(--lab-ink)]/20 to-transparent" />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-[var(--lab-ink)]/40"
        >
          <span className="text-xs font-medium tracking-widest uppercase">
            Scroll
          </span>
          <div className="h-8 w-px bg-current" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function EditorialEggIllustration() {
  return (
    <svg
      width="400"
      height="500"
      viewBox="0 0 400 500"
      fill="none"
      className="w-full max-w-md"
    >
      {/* Background circle */}
      <circle
        cx="200"
        cy="250"
        r="180"
        fill="var(--lab-cream)"
        stroke="var(--lab-ink)"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Egg shape */}
      <ellipse
        cx="200"
        cy="250"
        rx="100"
        ry="130"
        fill="var(--lab-paper)"
        stroke="var(--lab-ink)"
        strokeWidth="2"
      />

      {/* Inner decoration */}
      <ellipse
        cx="200"
        cy="250"
        rx="70"
        ry="95"
        fill="none"
        stroke="var(--lab-gold)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* Center yolk */}
      <circle cx="200" cy="240" r="35" fill="var(--lab-gold)" opacity="0.8" />

      {/* Highlight */}
      <circle cx="190" cy="230" r="10" fill="white" opacity="0.6" />

      {/* Decorative lines */}
      <line
        x1="100"
        y1="100"
        x2="130"
        y2="130"
        stroke="var(--lab-ink)"
        strokeWidth="1"
        opacity="0.3"
      />
      <line
        x1="300"
        y1="100"
        x2="270"
        y2="130"
        stroke="var(--lab-ink)"
        strokeWidth="1"
        opacity="0.3"
      />
      <line
        x1="100"
        y1="400"
        x2="130"
        y2="370"
        stroke="var(--lab-ink)"
        strokeWidth="1"
        opacity="0.3"
      />
      <line
        x1="300"
        y1="400"
        x2="270"
        y2="370"
        stroke="var(--lab-ink)"
        strokeWidth="1"
        opacity="0.3"
      />

      {/* Scientific labels */}
      <text
        x="320"
        y="240"
        fontSize="10"
        fontFamily="serif"
        fill="var(--lab-ink)"
        opacity="0.5"
      >
        Vitellus
      </text>
      <line
        x1="235"
        y1="240"
        x2="310"
        y2="240"
        stroke="var(--lab-ink)"
        strokeWidth="0.5"
        opacity="0.3"
      />

      <text
        x="320"
        y="180"
        fontSize="10"
        fontFamily="serif"
        fill="var(--lab-ink)"
        opacity="0.5"
      >
        Albumen
      </text>
      <line
        x1="260"
        y1="180"
        x2="310"
        y2="180"
        stroke="var(--lab-ink)"
        strokeWidth="0.5"
        opacity="0.3"
      />
    </svg>
  );
}
