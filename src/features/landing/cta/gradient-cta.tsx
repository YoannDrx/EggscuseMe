"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { Egg, ArrowRight } from "lucide-react";
import { Eggy } from "@/features/mascot";
import { useTranslations } from "next-intl";
import { NeoButton } from "@/components/neo";

type GradientCTAProps = {
  className?: string;
};

export function GradientCTA({ className }: GradientCTAProps) {
  const t = useTranslations("landing.gradientCta");

  return (
    <section className={cn("bg-neo-bg py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-neo-accent border-neo-border relative overflow-hidden rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)] px-8 py-16 shadow-[var(--shadow-neo-lg)] sm:px-16 sm:py-20"
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
              className="font-heading text-neo-accent-foreground mt-8 text-3xl font-bold sm:text-4xl"
            >
              {t("title")}
              <br />
              <span className="text-neo-accent-foreground/80">
                {t("titleHighlight")}
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-neo-accent-foreground/90 mt-4 max-w-md text-lg"
            >
              {t("description")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <NeoButton asChild variant="secondary" size="lg">
                <Link href="/auth/signin" className="gap-2">
                  <Egg className="size-5" />
                  {t("button")}
                </Link>
              </NeoButton>
              <NeoButton asChild variant="outline" size="lg">
                <Link href="/preview" className="gap-2">
                  {t("demo")}
                  <ArrowRight className="size-4" />
                </Link>
              </NeoButton>
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
