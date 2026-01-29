"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import type { ReactNode } from "react";

type StorySceneProps = {
  id: string;
  title: string;
  description: string;
  chapter: string;
  variant: "dawn" | "morning" | "noon" | "sunset" | "night";
  children?: ReactNode;
  className?: string;
};

const variantStyles = {
  dawn: {
    bg: "bg-[var(--egv-dawn)]",
    text: "text-[var(--egv-night)]",
    accent: "text-[var(--egv-morning)]",
  },
  morning: {
    bg: "bg-[var(--egv-morning)]",
    text: "text-white",
    accent: "text-[var(--egv-dawn)]",
  },
  noon: {
    bg: "bg-[var(--egv-noon)]",
    text: "text-[var(--egv-night)]",
    accent: "text-[var(--egv-sunset)]",
  },
  sunset: {
    bg: "bg-[var(--egv-sunset)]",
    text: "text-white",
    accent: "text-[var(--egv-noon)]",
  },
  night: {
    bg: "bg-[var(--egv-night)]",
    text: "text-[var(--egv-dawn)]",
    accent: "text-[var(--egv-star)]",
  },
};

export function StoryScene({
  id,
  title,
  description,
  chapter,
  variant,
  children,
  className,
}: StorySceneProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const styles = variantStyles[variant];

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        "relative flex min-h-screen items-center justify-center overflow-hidden",
        styles.bg,
        className,
      )}
    >
      {/* Parallax background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <ParallaxLayer speed={0.2} variant={variant} />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
        {/* Chapter badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className={cn(
            "mb-6 inline-block rounded-full px-4 py-1.5",
            "border-2 border-current/20",
            styles.accent,
          )}
        >
          <span className="text-sm font-bold tracking-widest uppercase">
            {chapter}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={cn(
            "font-heading text-4xl font-bold sm:text-5xl lg:text-6xl",
            styles.text,
          )}
        >
          {title}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={cn(
            "mx-auto mt-6 max-w-2xl text-lg sm:text-xl",
            styles.text,
            "opacity-80",
          )}
        >
          {description}
        </motion.p>

        {/* Custom content */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}

type ParallaxLayerProps = {
  speed: number;
  variant: StorySceneProps["variant"];
};

function ParallaxLayer({ variant }: ParallaxLayerProps) {
  const elements = getParallaxElements(variant);

  return (
    <>
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className={cn("absolute", el.className)}
          style={{
            left: el.left,
            top: el.top,
          }}
          animate={{
            y: [0, el.floatRange, 0],
            rotate: [0, el.rotateRange, 0],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {el.element}
        </motion.div>
      ))}
    </>
  );
}

function getParallaxElements(variant: StorySceneProps["variant"]) {
  switch (variant) {
    case "dawn":
      return [
        {
          element: <SunRays />,
          left: "80%",
          top: "10%",
          floatRange: 10,
          rotateRange: 5,
          duration: 6,
          className: "opacity-30",
        },
        {
          element: <Cloud />,
          left: "10%",
          top: "20%",
          floatRange: 15,
          rotateRange: 0,
          duration: 8,
          className: "opacity-40",
        },
      ];
    case "morning":
      return [
        {
          element: <Leaf />,
          left: "15%",
          top: "30%",
          floatRange: 20,
          rotateRange: 10,
          duration: 5,
          className: "opacity-50",
        },
        {
          element: <Leaf />,
          left: "85%",
          top: "60%",
          floatRange: 15,
          rotateRange: -10,
          duration: 7,
          className: "opacity-40 scale-75",
        },
      ];
    case "noon":
      return [
        {
          element: <Sparkle />,
          left: "20%",
          top: "25%",
          floatRange: 8,
          rotateRange: 180,
          duration: 4,
          className: "opacity-60",
        },
        {
          element: <Sparkle />,
          left: "75%",
          top: "40%",
          floatRange: 12,
          rotateRange: -180,
          duration: 5,
          className: "opacity-50",
        },
      ];
    case "sunset":
      return [
        {
          element: <Bird />,
          left: "25%",
          top: "15%",
          floatRange: 30,
          rotateRange: 5,
          duration: 10,
          className: "opacity-40",
        },
        {
          element: <Bird />,
          left: "70%",
          top: "25%",
          floatRange: 25,
          rotateRange: -5,
          duration: 12,
          className: "opacity-30 scale-75",
        },
      ];
    case "night":
      return [
        {
          element: <Star />,
          left: "10%",
          top: "15%",
          floatRange: 5,
          rotateRange: 0,
          duration: 3,
          className: "opacity-80",
        },
        {
          element: <Star />,
          left: "30%",
          top: "25%",
          floatRange: 8,
          rotateRange: 0,
          duration: 4,
          className: "opacity-60 scale-75",
        },
        {
          element: <Star />,
          left: "70%",
          top: "10%",
          floatRange: 6,
          rotateRange: 0,
          duration: 3.5,
          className: "opacity-70",
        },
        {
          element: <Star />,
          left: "85%",
          top: "30%",
          floatRange: 10,
          rotateRange: 0,
          duration: 5,
          className: "opacity-50 scale-50",
        },
        {
          element: <Moon />,
          left: "80%",
          top: "8%",
          floatRange: 5,
          rotateRange: 0,
          duration: 8,
          className: "opacity-90",
        },
      ];
    default:
      return [];
  }
}

// SVG Elements
function SunRays() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="30" fill="var(--egv-noon)" />
      {[...Array(8)].map((_, i) => (
        <line
          key={i}
          x1="60"
          y1="15"
          x2="60"
          y2="5"
          stroke="var(--egv-noon)"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${i * 45} 60 60)`}
        />
      ))}
    </svg>
  );
}

function Cloud() {
  return (
    <svg width="100" height="60" viewBox="0 0 100 60" fill="none">
      <ellipse cx="50" cy="35" rx="40" ry="20" fill="white" />
      <ellipse cx="30" cy="30" rx="25" ry="18" fill="white" />
      <ellipse cx="70" cy="32" rx="22" ry="16" fill="white" />
    </svg>
  );
}

function Leaf() {
  return (
    <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
      <path
        d="M20 5 Q35 20 35 40 Q20 55 20 55 Q20 55 5 40 Q5 20 20 5"
        fill="var(--egv-morning)"
        opacity="0.8"
      />
      <line
        x1="20"
        y1="15"
        x2="20"
        y2="50"
        stroke="var(--egv-night)"
        strokeWidth="1.5"
        opacity="0.3"
      />
    </svg>
  );
}

function Sparkle() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path
        d="M15 0 L17 12 L30 15 L17 18 L15 30 L13 18 L0 15 L13 12 Z"
        fill="var(--egv-star)"
      />
    </svg>
  );
}

function Bird() {
  return (
    <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
      <path
        d="M0 10 Q10 0 20 10 Q30 0 40 10"
        stroke="var(--egv-night)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Star() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="2" fill="var(--egv-star)" />
      <circle cx="10" cy="10" r="4" fill="var(--egv-star)" opacity="0.3" />
    </svg>
  );
}

function Moon() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="25" fill="var(--egv-star)" />
      <circle cx="40" cy="25" r="20" fill="var(--egv-night)" />
    </svg>
  );
}
