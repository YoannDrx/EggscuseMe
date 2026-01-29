"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "motion/react";

type ScrollProgressProps = {
  className?: string;
  sections: { id: string; label: string }[];
};

export function ScrollProgress({ className, sections }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  return (
    <div
      className={cn(
        "fixed top-1/2 right-6 z-50 -translate-y-1/2",
        "hidden flex-col items-center gap-3 lg:flex",
        className,
      )}
    >
      {sections.map((section, index) => {
        const sectionStart = index / sections.length;
        const sectionEnd = (index + 1) / sections.length;

        return (
          <ScrollDot
            key={section.id}
            label={section.label}
            sectionStart={sectionStart}
            sectionEnd={sectionEnd}
            scrollYProgress={scrollYProgress}
            href={`#${section.id}`}
          />
        );
      })}
    </div>
  );
}

type ScrollDotProps = {
  label: string;
  sectionStart: number;
  sectionEnd: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  href: string;
};

function ScrollDot({
  label,
  sectionStart,
  sectionEnd,
  scrollYProgress,
  href,
}: ScrollDotProps) {
  const scale = useTransform(scrollYProgress, (value) => {
    return value >= sectionStart && value < sectionEnd ? 1.5 : 1;
  });

  const opacity = useTransform(scrollYProgress, (value) => {
    return value >= sectionStart && value < sectionEnd ? 1 : 0.4;
  });

  return (
    <a
      href={href}
      className="group relative flex items-center"
      aria-label={label}
    >
      <motion.div
        style={{ scale, opacity }}
        className={cn(
          "size-3 rounded-full transition-colors duration-300",
          "border-2 border-[var(--egv-night)] bg-[var(--egv-noon)]",
        )}
      />
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className={cn(
          "absolute right-6 whitespace-nowrap",
          "text-sm font-medium text-[var(--egv-night)]",
          "bg-[var(--egv-dawn)]/90 backdrop-blur-sm",
          "rounded-full px-3 py-1",
          "pointer-events-none",
        )}
      >
        {label}
      </motion.span>
    </a>
  );
}
