"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { CheckeredPattern } from "./checkered-pattern";

type DinerFooterProps = {
  className?: string;
};

export function DinerFooter({ className }: DinerFooterProps) {
  return (
    <footer
      className={cn("relative overflow-hidden bg-[#1a1a2e] py-16", className)}
    >
      {/* Checkered pattern */}
      <CheckeredPattern className="opacity-10" />

      {/* Chrome border top */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[var(--diner-chrome)] to-transparent" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        {/* Neon Logo */}
        <div className="mb-8 text-center">
          <motion.span
            animate={{
              filter: [
                "brightness(1)",
                "brightness(1.2)",
                "brightness(0.9)",
                "brightness(1)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="font-heading text-3xl font-bold text-[var(--diner-neon-pink)] italic"
            style={{
              textShadow:
                "0 0 10px var(--diner-neon-pink), 0 0 20px var(--diner-neon-pink)",
            }}
          >
            Sunny Side Diner
          </motion.span>
        </div>

        {/* Tagline */}
        <p className="font-heading mb-8 text-center text-lg text-[var(--diner-cream)]/70">
          Ouvert 24h/24 - Fraicheur garantie
        </p>

        {/* Vintage badges */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
          <VintageBadge text="Est. 2024" />
          <VintageBadge text="100% Frais" />
          <VintageBadge text="Zero Gaspi" />
        </div>

        {/* Links */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-8">
          {[
            { href: "/legal/terms", label: "Conditions" },
            { href: "/legal/privacy", label: "Confidentialite" },
            { href: "/contact", label: "Contact" },
            { href: "/posts", label: "Blog" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-heading text-sm tracking-wider text-[var(--diner-cream)]/50 uppercase transition-colors hover:text-[var(--diner-neon-yellow)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-center text-sm text-[var(--diner-cream)]/30">
          &copy; {new Date().getFullYear()} EggscuseMe. Tous droits reserves.
        </p>
      </div>
    </footer>
  );
}

function VintageBadge({ text }: { text: string }) {
  return (
    <div
      className={cn(
        "rounded-full border-2 border-[var(--diner-chrome)] px-4 py-1.5",
        "bg-[var(--diner-red)]/20",
        "font-heading text-xs font-bold tracking-widest text-[var(--diner-cream)] uppercase",
      )}
    >
      {text}
    </div>
  );
}
