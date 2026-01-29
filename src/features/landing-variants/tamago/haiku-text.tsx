"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

type HaikuTextProps = {
  lines: [string, string, string];
  className?: string;
};

export function HaikuText({ lines, className }: HaikuTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className={cn("text-center", className)}>
      {lines.map((line, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: index * 0.3 }}
          className={cn(
            "font-serif text-xl text-[var(--zen-sumi)] italic sm:text-2xl",
            index === 1 && "my-2",
          )}
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}
