"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import { HaikuText } from "./haiku-text";

type ZenFooterProps = {
  className?: string;
};

export function ZenFooter({ className }: ZenFooterProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <footer ref={ref} className={cn("bg-[var(--zen-washi)] py-24", className)}>
      <div className="mx-auto max-w-2xl px-6 text-center">
        {/* Haiku */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
        >
          <HaikuText
            lines={[
              "L'oeuf dans le frigo",
              "attend son heure de gloire",
              "jamais oublie",
            ]}
          />
        </motion.div>

        {/* Signature / Hanko style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-12 flex justify-center"
        >
          <div className="flex size-16 items-center justify-center border-2 border-[var(--zen-sumi)] p-2">
            <span className="font-serif text-xl text-[var(--zen-sumi)]">
              卵
            </span>
          </div>
        </motion.div>

        {/* Links - Horizontal, minimal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8"
        >
          {[
            { href: "/legal/terms", label: "Conditions" },
            { href: "/legal/privacy", label: "Confidentialite" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-serif text-sm text-[var(--zen-ink-light)] transition-colors hover:text-[var(--zen-sumi)]"
            >
              {link.label}
            </Link>
          ))}
        </motion.div>

        {/* Copyright - Very subtle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.4 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 font-serif text-xs text-[var(--zen-ink-light)]"
        >
          &copy; {new Date().getFullYear()} EggscuseMe
        </motion.p>
      </div>
    </footer>
  );
}
