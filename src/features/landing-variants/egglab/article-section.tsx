"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import type { ReactNode } from "react";

type ArticleSectionProps = {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  variant?: "default" | "feature" | "full-width";
  className?: string;
};

export function ArticleSection({
  id,
  title,
  subtitle,
  children,
  variant = "default",
  className,
}: ArticleSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerStyles = {
    default: "max-w-3xl mx-auto",
    feature: "max-w-5xl mx-auto",
    "full-width": "max-w-7xl mx-auto",
  };

  return (
    <section id={id} ref={ref} className={cn("px-6 py-16 sm:py-24", className)}>
      <div className={containerStyles[variant]}>
        {/* Section Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {subtitle && (
            <p className="mb-2 text-sm font-medium tracking-widest text-[var(--lab-gold)] uppercase">
              {subtitle}
            </p>
          )}
          <h2 className="font-serif text-3xl font-bold text-[var(--lab-ink)] sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <div className="mt-6 h-px w-24 bg-[var(--lab-gold)]" />
        </motion.header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
