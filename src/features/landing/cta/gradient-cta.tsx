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
    <section className={cn("bg-background py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="from-primary to-primary/80 relative overflow-hidden rounded-[3rem] bg-gradient-to-r px-8 py-16 sm:px-16 sm:py-20"
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
              className="font-heading text-primary-foreground mt-8 text-3xl font-bold sm:text-4xl"
            >
              Pret a casser des oeufs
              <br />
              <span className="text-primary-foreground/80">
                (sans les gacher) ?
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-primary-foreground/90 mt-4 max-w-md text-lg"
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
                className="bg-foreground text-background hover:bg-foreground/90 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all"
              >
                <Egg className="size-5" />
                Creer mon frigo gratuit
              </Link>
              <Link
                href="/preview"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 inline-flex items-center gap-2 rounded-full border-2 bg-transparent px-6 py-3 font-semibold transition-all"
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
