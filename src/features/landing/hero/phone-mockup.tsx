"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { ReactNode } from "react";

type PhoneMockupProps = {
  children: ReactNode;
  className?: string;
  enableParallax?: boolean;
};

export function PhoneMockup({
  children,
  className,
  enableParallax = true,
}: PhoneMockupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, -5]);

  return (
    <motion.div
      ref={ref}
      style={enableParallax ? { y, rotateY: rotate } : undefined}
      className={cn("perspective-1000 relative", className)}
    >
      {/* iPhone Frame */}
      <div className="phone-shadow relative h-[600px] w-[290px] rounded-[3rem] border-[12px] border-stone-800 bg-stone-800">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2 left-1/2 z-20 h-[28px] w-[100px] -translate-x-1/2 rounded-full bg-stone-900" />

        {/* Side Buttons - Left */}
        <div className="absolute top-[80px] -left-[15px] h-[28px] w-[3px] rounded-l-sm bg-stone-700" />
        <div className="absolute top-[130px] -left-[15px] h-[50px] w-[3px] rounded-l-sm bg-stone-700" />
        <div className="absolute top-[190px] -left-[15px] h-[50px] w-[3px] rounded-l-sm bg-stone-700" />

        {/* Side Button - Right */}
        <div className="absolute top-[140px] -right-[15px] h-[70px] w-[3px] rounded-r-sm bg-stone-700" />

        {/* Screen Content */}
        <div className="relative h-full w-full overflow-hidden rounded-[2.25rem] bg-stone-950">
          {children}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 h-[5px] w-[120px] -translate-x-1/2 rounded-full bg-stone-600" />

        {/* Screen Reflection */}
        <div className="pointer-events-none absolute inset-0 rounded-[2.25rem] bg-gradient-to-br from-white/5 to-transparent" />
      </div>
    </motion.div>
  );
}
