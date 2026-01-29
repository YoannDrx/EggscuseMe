"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

type PullQuoteProps = {
  quote: string;
  author?: string;
  className?: string;
};

export function PullQuote({ quote, author, className }: PullQuoteProps) {
  const ref = useRef<HTMLQuoteElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.blockquote
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8 }}
      className={cn(
        "relative border-l-4 border-[var(--lab-gold)] py-4 pl-8",
        className,
      )}
    >
      <p className="font-serif text-2xl leading-relaxed text-[var(--lab-ink)] italic sm:text-3xl">
        &ldquo;{quote}&rdquo;
      </p>
      {author && (
        <footer className="mt-4 text-sm font-medium tracking-widest text-[var(--lab-ink)]/60 uppercase">
          &mdash; {author}
        </footer>
      )}
    </motion.blockquote>
  );
}
