"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { Egg, Sparkles } from "lucide-react";
import { PhoneMockup } from "./phone-mockup";
import { PhoneAppPreview } from "./phone-app-preview";
import { FloatingBadge } from "./floating-badge";
import { SocialProof } from "./social-proof";
import { useTranslations } from "next-intl";
import { NeoButton } from "@/components/neo";

type HeroSectionProps = {
  className?: string;
};

export function HeroSection({ className }: HeroSectionProps) {
  const t = useTranslations("landing");

  return (
    <section
      className={cn(
        "bg-neo-bg relative min-h-screen overflow-hidden pt-24",
        className,
      )}
    >
      {/* Background Gradient Blobs - Removed per user request */}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left Column - Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="border-neo-accent/30 bg-neo-accent/10 mb-6 inline-flex items-center gap-2 rounded-full border-[length:var(--border-neo)] px-4 py-1.5"
            >
              <Sparkles className="text-neo-accent size-4" />
              <span className="text-neo-accent text-sm font-bold">
                {t("hero.badge")}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-heading text-neo-text text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              {t("hero.title")}{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  {t("hero.titleHighlight")}
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                >
                  <path
                    d="M2 6 Q50 2, 100 6 T198 6"
                    stroke="url(#underline-gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="underline-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-neo-text-muted mt-6 max-w-xl text-lg"
            >
              {t("hero.description")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <NeoButton asChild size="lg">
                <Link href="/auth/signin" className="gap-2">
                  <Egg className="size-5" />
                  {t("hero.cta")}
                </Link>
              </NeoButton>
              <NeoButton asChild variant="secondary" size="lg">
                <Link href="#features">{t("hero.ctaSecondary")}</Link>
              </NeoButton>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-10"
            >
              <SocialProof />
            </motion.div>
          </div>

          {/* Right Column - Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end lg:pt-6">
            {/* Floating Badges - Hidden on mobile */}
            <div className="pointer-events-none absolute inset-0 hidden lg:block">
              <FloatingBadge
                variant="safe"
                className="absolute top-1/4 -left-8"
                delay={0.6}
              />
              <FloatingBadge
                variant="eco"
                className="absolute bottom-1/3 -left-4"
                delay={1.0}
              />
            </div>

            {/* Phone */}
            <PhoneMockup className="relative z-10">
              <PhoneAppPreview />
            </PhoneMockup>
          </div>
        </div>

        {/* Bottom Stats - Optional */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="border-neo-border/30 mt-20 grid grid-cols-2 gap-8 border-t-[length:var(--border-neo)] pt-12 sm:grid-cols-4"
        >
          {[
            { value: "10K+", label: t("stats.users") },
            { value: "2.4M", label: t("stats.eggsSaved") },
            { value: "4.9/5", label: t("stats.appStoreRating") },
            { value: "0€", label: t("stats.freeToStart") },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                className="text-neo-accent text-3xl font-bold"
              >
                {stat.value}
              </motion.div>
              <div className="text-neo-text-muted mt-1 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
