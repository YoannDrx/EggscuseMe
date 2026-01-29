"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";

type DinerNavbarProps = {
  className?: string;
};

export function DinerNavbar({ className }: DinerNavbarProps) {
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "bg-[#1a1a2e]/95 backdrop-blur-md",
        "border-b-4 border-[var(--diner-chrome)]",
        className,
      )}
    >
      {/* Chrome strip effect */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[var(--diner-chrome)] to-transparent opacity-50" />

      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/landing-2" className="flex items-center gap-3">
          <motion.div
            animate={{
              filter: [
                "brightness(1)",
                "brightness(1.2)",
                "brightness(0.9)",
                "brightness(1)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-heading text-2xl font-bold text-[var(--diner-neon-pink)] italic"
            style={{
              textShadow:
                "0 0 10px var(--diner-neon-pink), 0 0 20px var(--diner-neon-pink)",
            }}
          >
            Sunny Side
          </motion.div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 sm:flex">
          {[
            { href: "#menu", label: "Menu" },
            { href: "#specials", label: "Specialites" },
            { href: "#about", label: "Notre Histoire" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-heading text-sm font-bold tracking-wider text-[var(--diner-cream)] uppercase transition-colors hover:text-[var(--diner-neon-yellow)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href="/auth/signin"
          className={cn(
            "rounded-full px-5 py-2",
            "bg-[var(--diner-red)] text-white",
            "font-heading text-sm font-bold tracking-wider uppercase",
            "border-2 border-[var(--diner-chrome)]",
            "shadow-[2px_2px_0_var(--diner-chrome)]",
            "transition-all hover:translate-x-[1px] hover:translate-y-[1px]",
            "hover:shadow-[1px_1px_0_var(--diner-chrome)]",
          )}
        >
          Ouvrir 24h
        </Link>
      </nav>
    </header>
  );
}
