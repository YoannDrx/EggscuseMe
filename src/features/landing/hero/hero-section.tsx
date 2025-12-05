"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { Egg, Sparkles } from "lucide-react";
import { PhoneMockup } from "./phone-mockup";
import { PhoneAppPreview } from "./phone-app-preview";
import { FloatingBadge } from "./floating-badge";
import { SocialProof } from "./social-proof";

type HeroSectionProps = {
  className?: string;
};

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative min-h-screen overflow-hidden bg-stone-950 pt-24",
        className,
      )}
    >
      {/* Background Gradient Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-1/4 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-1/4 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left Column - Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5"
            >
              <Sparkles className="size-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">
                Application #1 Anti-Gaspillage
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Ne jetez plus jamais{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  un seul oeuf
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
              .
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-6 max-w-xl text-lg text-stone-400"
            >
              Suivez la fraicheur de vos oeufs, recevez des recommandations de
              cuisson personnalisees et reduisez le gaspillage alimentaire.
              Simple comme bonjour.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                href="/auth/signin"
                className="glow-button inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-stone-900 transition-all hover:bg-amber-300"
              >
                <Egg className="size-5" />
                Creer mon frigo gratuit
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-900/50 px-6 py-3 font-semibold text-white transition-all hover:border-stone-600 hover:bg-stone-800/50"
              >
                En savoir plus
              </Link>
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
          <div className="relative flex justify-center lg:justify-end">
            {/* Floating Badges - Hidden on mobile */}
            <div className="pointer-events-none absolute inset-0 hidden lg:block">
              <FloatingBadge
                variant="safe"
                className="absolute top-1/4 -left-8"
                delay={0.6}
              />
              <FloatingBadge
                variant="rating"
                className="absolute top-16 -right-4"
                delay={0.8}
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
          className="mt-20 grid grid-cols-2 gap-8 border-t border-stone-800 pt-12 sm:grid-cols-4"
        >
          {[
            { value: "10K+", label: "Utilisateurs" },
            { value: "2.4M", label: "Oeufs sauves" },
            { value: "4.9/5", label: "Note App Store" },
            { value: "0\u20AC", label: "Pour commencer" },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                className="text-3xl font-bold text-amber-400"
              >
                {stat.value}
              </motion.div>
              <div className="mt-1 text-sm text-stone-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
