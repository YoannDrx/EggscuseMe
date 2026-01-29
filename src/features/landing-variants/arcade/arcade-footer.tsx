"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Link from "next/link";

type ArcadeFooterProps = {
  className?: string;
};

export function ArcadeFooter({ className }: ArcadeFooterProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <footer
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-[var(--arcade-dark)] py-16",
        "border-t-2 border-[var(--arcade-neon-pink)]",
        className,
      )}
      style={{
        boxShadow: "0 -2px 20px var(--arcade-neon-pink)",
      }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(var(--arcade-neon-cyan) 1px, transparent 1px),
            linear-gradient(90deg, var(--arcade-neon-cyan) 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Game Over / Continue */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span
            className="font-heading text-3xl font-bold text-[var(--arcade-neon-yellow)] uppercase"
            style={{
              textShadow:
                "0 0 10px var(--arcade-neon-yellow), 0 0 20px var(--arcade-neon-yellow)",
            }}
          >
            Game Over?
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="font-heading mb-8 text-lg text-white/70"
        >
          Insert coin to continue...
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/auth/signin"
            className={cn(
              "inline-block rounded-lg px-8 py-3",
              "bg-[var(--arcade-neon-green)] text-[var(--arcade-dark)]",
              "font-heading font-bold uppercase",
              "transition-transform hover:scale-105",
            )}
            style={{
              boxShadow: "0 0 20px var(--arcade-neon-green)",
            }}
          >
            Continue?
          </Link>
        </motion.div>

        {/* Credits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <p className="mb-4 text-xs font-bold tracking-widest text-white/30 uppercase">
            Credits
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { href: "/legal/terms", label: "Terms" },
              { href: "/legal/privacy", label: "Privacy" },
              { href: "/contact", label: "Contact" },
              { href: "/posts", label: "Blog" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-bold tracking-wider text-white/40 uppercase transition-colors hover:text-[var(--arcade-neon-cyan)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-8 text-xs text-white/20"
        >
          &copy; {new Date().getFullYear()} EggscuseMe. All rights reserved.
        </motion.p>

        {/* Easter egg hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.3 } : {}}
          transition={{ delay: 1 }}
          className="mt-4 text-[10px] text-white/20"
        >
          ↑ ↑ ↓ ↓ ← → ← → B A
        </motion.p>
      </div>
    </footer>
  );
}
