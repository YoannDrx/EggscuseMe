"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Link from "next/link";

type EditorialFooterProps = {
  className?: string;
};

export function EditorialFooter({ className }: EditorialFooterProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <footer
      ref={ref}
      className={cn(
        "bg-[var(--lab-ink)] py-20 text-[var(--lab-paper)]",
        className,
      )}
    >
      <div className="mx-auto max-w-5xl px-6">
        {/* Colophon style header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="font-serif text-4xl font-bold">EggLab</span>
          <div className="mx-auto mt-4 h-px w-16 bg-[var(--lab-gold)]" />
        </motion.div>

        {/* Magazine info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 text-center"
        >
          <p className="font-serif text-lg text-[var(--lab-paper)]/70 italic">
            &ldquo;L&apos;art de ne jamais gaspiller un seul oeuf.&rdquo;
          </p>
        </motion.div>

        {/* Links in editorial style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 flex flex-wrap items-center justify-center gap-8"
        >
          {[
            { href: "#science", label: "Science" },
            { href: "#guide", label: "Guide" },
            { href: "/posts", label: "Articles" },
            { href: "/contact", label: "Contact" },
          ].map((link, i) => (
            <span key={link.href} className="flex items-center gap-8">
              <Link
                href={link.href}
                className="text-sm font-medium tracking-widest text-[var(--lab-paper)]/60 uppercase transition-colors hover:text-[var(--lab-paper)]"
              >
                {link.label}
              </Link>
              {i < 3 && (
                <span className="text-[var(--lab-paper)]/20">&bull;</span>
              )}
            </span>
          ))}
        </motion.div>

        {/* Legal links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-6 text-xs"
        >
          <Link
            href="/legal/terms"
            className="text-[var(--lab-paper)]/40 transition-colors hover:text-[var(--lab-paper)]/60"
          >
            Conditions
          </Link>
          <Link
            href="/legal/privacy"
            className="text-[var(--lab-paper)]/40 transition-colors hover:text-[var(--lab-paper)]/60"
          >
            Confidentialite
          </Link>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-xs text-[var(--lab-paper)]/30">
            &copy; {new Date().getFullYear()} EggscuseMe. Tous droits reserves.
          </p>
          <p className="mt-2 text-xs tracking-widest text-[var(--lab-paper)]/20 uppercase">
            Premiere edition
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
