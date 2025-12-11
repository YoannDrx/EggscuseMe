"use client";

import { cn } from "@/lib/utils";
import { motion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

type NumberCounterProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
};

export function NumberCounter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  duration = 1.5,
}: NumberCounterProps) {
  const spring = useSpring(0, {
    damping: 30,
    stiffness: 100,
    duration: duration * 1000,
  });

  const display = useTransform(
    spring,
    (current) => prefix + current.toFixed(decimals) + suffix,
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className={cn("tabular-nums", className)}>
      {display}
    </motion.span>
  );
}
