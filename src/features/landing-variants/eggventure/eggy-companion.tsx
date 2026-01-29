"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type EggyCompanionProps = {
  className?: string;
};

export function EggyCompanion({ className }: EggyCompanionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Eggy moves along a path as user scrolls
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "80vh"]);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [0, 10, -5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 0.9]);

  // Expression changes based on scroll
  const expression = useTransform(scrollYProgress, (value) => {
    if (value < 0.25) return "happy";
    if (value < 0.5) return "excited";
    if (value < 0.75) return "thinking";
    return "sleepy";
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed top-20 left-8 z-40 hidden lg:block",
        "pointer-events-none",
        className,
      )}
    >
      <motion.div style={{ y, rotate, scale }} className="relative">
        <EggySVG expression={expression.get()} />
      </motion.div>
    </div>
  );
}

type EggySVGProps = {
  expression: "happy" | "excited" | "thinking" | "sleepy";
};

function EggySVG({ expression }: EggySVGProps) {
  const getEyes = () => {
    switch (expression) {
      case "excited":
        return (
          <>
            <circle cx="35" cy="38" r="5" fill="var(--egv-night)" />
            <circle cx="35" cy="36" r="2" fill="white" />
            <circle cx="55" cy="38" r="5" fill="var(--egv-night)" />
            <circle cx="55" cy="36" r="2" fill="white" />
          </>
        );
      case "thinking":
        return (
          <>
            <ellipse cx="35" cy="40" rx="4" ry="3" fill="var(--egv-night)" />
            <ellipse cx="55" cy="38" rx="4" ry="3" fill="var(--egv-night)" />
          </>
        );
      case "sleepy":
        return (
          <>
            <path
              d="M31 40 Q35 38, 39 40"
              stroke="var(--egv-night)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M51 40 Q55 38, 59 40"
              stroke="var(--egv-night)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </>
        );
      default: // happy
        return (
          <>
            <circle cx="35" cy="40" r="4" fill="var(--egv-night)" />
            <circle cx="35" cy="39" r="1.5" fill="white" />
            <circle cx="55" cy="40" r="4" fill="var(--egv-night)" />
            <circle cx="55" cy="39" r="1.5" fill="white" />
          </>
        );
    }
  };

  const getMouth = () => {
    switch (expression) {
      case "excited":
        return (
          <ellipse cx="45" cy="55" rx="8" ry="5" fill="var(--egv-night)" />
        );
      case "thinking":
        return <circle cx="52" cy="55" r="3" fill="var(--egv-night)" />;
      case "sleepy":
        return (
          <path
            d="M40 55 Q45 58, 50 55"
            stroke="var(--egv-night)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        );
      default: // happy
        return (
          <path
            d="M38 52 Q45 60, 52 52"
            stroke="var(--egv-night)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        );
    }
  };

  return (
    <svg
      width="90"
      height="100"
      viewBox="0 0 90 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      {/* Egg body */}
      <ellipse
        cx="45"
        cy="55"
        rx="38"
        ry="45"
        fill="var(--egv-dawn)"
        stroke="var(--egv-night)"
        strokeWidth="2.5"
      />

      {/* Blush */}
      <ellipse
        cx="25"
        cy="50"
        rx="6"
        ry="4"
        fill="var(--zen-sakura)"
        opacity="0.5"
      />
      <ellipse
        cx="65"
        cy="50"
        rx="6"
        ry="4"
        fill="var(--zen-sakura)"
        opacity="0.5"
      />

      {/* Eyes */}
      {getEyes()}

      {/* Mouth */}
      {getMouth()}

      {/* Sparkles for excited */}
      {expression === "excited" && (
        <>
          <path
            d="M75 25 L78 30 L83 27 L80 32 L85 35 L80 35 L78 40 L76 35 L71 35 L76 32 L73 27 L78 30 Z"
            fill="var(--egv-noon)"
          />
          <path
            d="M10 30 L12 33 L16 31 L14 35 L18 37 L14 37 L12 41 L10 37 L6 37 L10 35 L8 31 L12 33 Z"
            fill="var(--egv-noon)"
            transform="scale(0.7) translate(5, 10)"
          />
        </>
      )}

      {/* Z's for sleepy */}
      {expression === "sleepy" && (
        <text
          x="65"
          y="25"
          fontSize="16"
          fontWeight="bold"
          fill="var(--egv-night)"
          opacity="0.6"
        >
          z z
        </text>
      )}
    </svg>
  );
}
