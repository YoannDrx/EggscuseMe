"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";

type MinimalNavbarProps = {
  className?: string;
};

export function MinimalNavbar({ className }: MinimalNavbarProps) {
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const lineWidth = useTransform(scrollYProgress, [0, 0.1], ["0%", "100%"]);

  return (
    <motion.header
      style={{ opacity }}
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "bg-[var(--zen-washi)]/90 backdrop-blur-sm",
        className,
      )}
    >
      {/* Thin ink line */}
      <motion.div
        style={{ width: lineWidth }}
        className="absolute inset-x-0 bottom-0 mx-auto h-px bg-[var(--zen-sumi)]/20"
      />

      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        {/* Enso Logo */}
        <Link href="/landing-5" className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle
              cx="16"
              cy="16"
              r="12"
              stroke="var(--zen-sumi)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="70"
              strokeDashoffset="10"
            />
          </svg>
          <span className="font-serif text-lg text-[var(--zen-sumi)]">
            Tamago
          </span>
        </Link>

        {/* Single CTA */}
        <Link
          href="/auth/signin"
          className={cn(
            "px-6 py-2",
            "border border-[var(--zen-sumi)] text-[var(--zen-sumi)]",
            "font-serif text-sm",
            "transition-colors hover:bg-[var(--zen-sumi)] hover:text-[var(--zen-washi)]",
          )}
        >
          Commencer
        </Link>
      </nav>
    </motion.header>
  );
}
