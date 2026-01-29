"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";

type EditorialNavbarProps = {
  className?: string;
};

export function EditorialNavbar({ className }: EditorialNavbarProps) {
  const { scrollYProgress } = useScroll();

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.05],
    ["rgba(252,250,245,0)", "rgba(252,250,245,0.98)"],
  );

  const borderOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <motion.header
      style={{ backgroundColor }}
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "backdrop-blur-sm",
        className,
      )}
    >
      <motion.div
        style={{ opacity: borderOpacity }}
        className="absolute inset-x-0 bottom-0 h-px bg-[var(--lab-ink)]/10"
      />

      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/landing-3" className="flex items-center gap-3">
          <span className="font-serif text-2xl font-bold tracking-tight text-[var(--lab-ink)]">
            EggLab
          </span>
          <span className="rounded border border-[var(--lab-ink)]/20 px-2 py-0.5 text-xs font-medium tracking-widest text-[var(--lab-ink)]/60 uppercase">
            Vol. 01
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-10 sm:flex">
          {[
            { href: "#science", label: "Science" },
            { href: "#guide", label: "Guide" },
            { href: "#subscribe", label: "S'abonner" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-widest text-[var(--lab-ink)]/60 uppercase transition-colors hover:text-[var(--lab-ink)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/auth/signin"
          className={cn(
            "rounded-none border-2 border-[var(--lab-ink)] px-6 py-2",
            "text-sm font-medium tracking-widest text-[var(--lab-ink)] uppercase",
            "transition-colors hover:bg-[var(--lab-ink)] hover:text-[var(--lab-paper)]",
          )}
        >
          Commencer
        </Link>
      </nav>
    </motion.header>
  );
}
