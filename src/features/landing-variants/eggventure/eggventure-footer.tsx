"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import { Egg } from "lucide-react";

type EggventureFooterProps = {
  className?: string;
};

export function EggventureFooter({ className }: EggventureFooterProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <footer
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-[var(--egv-night)] py-20",
        className,
      )}
    >
      {/* Stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute size-1 rounded-full bg-[var(--egv-star)]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Sleeping Eggy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto mb-12 flex justify-center"
      >
        <SleepingEggy />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-heading text-3xl font-bold text-[var(--egv-dawn)] sm:text-4xl"
        >
          Fin de l&apos;aventure...
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 text-lg text-[var(--egv-dawn)]/70"
        >
          ...mais le debut de la votre.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Link
            href="/auth/signin"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-8 py-4",
              "bg-[var(--egv-noon)] text-[var(--egv-night)]",
              "text-lg font-bold",
              "shadow-[4px_4px_0_var(--egv-star)]",
              "transition-all hover:translate-x-[2px] hover:translate-y-[2px]",
              "hover:shadow-[2px_2px_0_var(--egv-star)]",
            )}
          >
            <Egg className="size-5" />
            Commencer maintenant
          </Link>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8"
        >
          {[
            { href: "/legal/terms", label: "Conditions" },
            { href: "/legal/privacy", label: "Confidentialite" },
            { href: "/contact", label: "Contact" },
            { href: "/posts", label: "Blog" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--egv-dawn)]/50 transition-colors hover:text-[var(--egv-dawn)]"
            >
              {link.label}
            </Link>
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 text-sm text-[var(--egv-dawn)]/30"
        >
          &copy; {new Date().getFullYear()} EggscuseMe. Tous droits reserves.
        </motion.p>
      </div>
    </footer>
  );
}

function SleepingEggy() {
  return (
    <div className="relative">
      <motion.svg
        width="120"
        height="140"
        viewBox="0 0 120 140"
        fill="none"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Egg body */}
        <ellipse
          cx="60"
          cy="80"
          rx="45"
          ry="55"
          fill="var(--egv-dawn)"
          stroke="var(--egv-night)"
          strokeWidth="2"
        />

        {/* Blush */}
        <ellipse
          cx="35"
          cy="75"
          rx="8"
          ry="5"
          fill="var(--zen-sakura)"
          opacity="0.4"
        />
        <ellipse
          cx="85"
          cy="75"
          rx="8"
          ry="5"
          fill="var(--zen-sakura)"
          opacity="0.4"
        />

        {/* Closed eyes */}
        <path
          d="M40 72 Q48 68, 56 72"
          stroke="var(--egv-night)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M64 72 Q72 68, 80 72"
          stroke="var(--egv-night)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Sleeping mouth */}
        <path
          d="M50 90 Q60 95, 70 90"
          stroke="var(--egv-night)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Night cap */}
        <path
          d="M30 40 Q60 -10, 100 30 L105 35 Q70 10, 35 45 Z"
          fill="var(--egv-sunset)"
          stroke="var(--egv-night)"
          strokeWidth="2"
        />
        <circle
          cx="105"
          cy="30"
          r="8"
          fill="var(--egv-dawn)"
          stroke="var(--egv-night)"
          strokeWidth="2"
        />
      </motion.svg>

      {/* Z's */}
      <motion.div
        className="absolute top-0 -right-4"
        animate={{
          y: [0, -10, 0],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="text-2xl font-bold text-[var(--egv-star)]">z</span>
      </motion.div>
      <motion.div
        className="absolute -top-4 -right-8"
        animate={{
          y: [0, -10, 0],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      >
        <span className="text-xl font-bold text-[var(--egv-star)]">z</span>
      </motion.div>
      <motion.div
        className="absolute -top-8 -right-10"
        animate={{
          y: [0, -10, 0],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
      >
        <span className="text-lg font-bold text-[var(--egv-star)]">z</span>
      </motion.div>
    </div>
  );
}
