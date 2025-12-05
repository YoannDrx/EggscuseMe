"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { Egg, ArrowRight } from "lucide-react";
import { Eggy } from "@/features/mascot";

type GradientCTAProps = {
  className?: string;
};

export function GradientCTA({ className }: GradientCTAProps) {
  return (
    <section className={cn("bg-stone-950 py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-amber-400 to-orange-400 px-8 py-16 sm:px-16 sm:py-20"
        >
          {/* Dot Pattern Overlay */}
          <div className="dot-pattern-cta pointer-events-none absolute inset-0 opacity-20" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Mascot */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <Eggy mood="chef" size="lg" />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="font-heading mt-8 text-3xl font-bold text-stone-900 sm:text-4xl"
            >
              Pret a casser des oeufs
              <br />
              <span className="text-stone-800">(sans les gacher) ?</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-4 max-w-md text-lg text-stone-800"
            >
              Rejoignez des milliers d&apos;utilisateurs qui reduisent leur
              gaspillage alimentaire. C&apos;est gratuit pour commencer.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 font-semibold text-white transition-all hover:bg-stone-800"
              >
                <Egg className="size-5" />
                Creer mon frigo gratuit
              </Link>
              <Link
                href="/preview"
                className="inline-flex items-center gap-2 rounded-full border-2 border-stone-900/30 bg-transparent px-6 py-3 font-semibold text-stone-900 transition-all hover:bg-stone-900/10"
              >
                Voir la demo
                <ArrowRight className="size-4" />
              </Link>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="pointer-events-none absolute -top-10 -left-10 size-40 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 -bottom-10 size-40 rounded-full bg-orange-600/20 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
