"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { Egg } from "lucide-react";

type EggventureNavbarProps = {
  className?: string;
};

export function EggventureNavbar({ className }: EggventureNavbarProps) {
  const { scrollYProgress } = useScroll();

  // Navbar becomes more visible as you scroll
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.1],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.95)"],
  );

  const borderOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  const textColor = useTransform(
    scrollYProgress,
    [0, 0.1],
    ["var(--egv-dawn)", "var(--egv-night)"],
  );

  return (
    <motion.header
      style={{ backgroundColor }}
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "backdrop-blur-md",
        className,
      )}
    >
      <motion.div
        style={{ opacity: borderOpacity }}
        className="absolute inset-x-0 bottom-0 h-px bg-[var(--egv-night)]/10"
      />

      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/landing-1" className="flex items-center gap-2">
          <motion.div style={{ color: textColor }}>
            <Egg className="size-8" />
          </motion.div>
          <motion.span
            style={{ color: textColor }}
            className="font-heading text-xl font-bold"
          >
            Eggventure
          </motion.span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 sm:flex">
          {[
            { href: "#prologue", label: "Prologue" },
            { href: "#frigo", label: "Frigo" },
            { href: "#temps", label: "Temps" },
            { href: "#cuisine", label: "Cuisine" },
          ].map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              style={{ color: textColor }}
              className="text-sm font-medium transition-opacity hover:opacity-70"
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href="/auth/signin"
          className={cn(
            "rounded-full px-5 py-2 text-sm font-bold",
            "bg-[var(--egv-noon)] text-[var(--egv-night)]",
            "border-2 border-[var(--egv-night)]",
            "shadow-[3px_3px_0_var(--egv-night)]",
            "transition-all hover:translate-x-[2px] hover:translate-y-[2px]",
            "hover:shadow-[1px_1px_0_var(--egv-night)]",
          )}
        >
          Commencer
        </Link>
      </nav>
    </motion.header>
  );
}
