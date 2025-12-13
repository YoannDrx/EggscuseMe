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

  // iPhone 14 Pro-ish dimensions (kept local so we don't import extra token systems)
  const scale = 0.95;
  const width = Math.round(393 * scale);
  const height = Math.round(852 * scale);

  const frameRadius = 50;
  const bezelRadius = frameRadius - 8;
  const screenRadius = bezelRadius - 2;

  const notchHeight = 30;
  const notchWidth = 110;

  return (
    <motion.div
      ref={ref}
      style={enableParallax ? { y, rotateY: rotate } : undefined}
      className={cn("perspective-1000 relative", className)}
    >
      {/* iPhone Frame (from portfolio-yoann) */}
      <div className="relative mx-auto" style={{ width }}>
        {/* Device Shadow */}
        <div
          className="absolute inset-0 translate-y-8 scale-95 bg-gradient-to-b from-black/20 to-black/40 blur-3xl"
          style={{ borderRadius: frameRadius }}
        />

        {/* Device Frame */}
        <div
          className="shadow-device relative bg-device-bg p-2.5"
          style={{ borderRadius: frameRadius }}
        >
          {/* Inner Bezel */}
          <div
            className="relative bg-device-bezel p-[2px]"
            style={{ borderRadius: bezelRadius }}
          >
            {/* Screen Container */}
            <div
              className="relative overflow-hidden bg-background"
              style={{ borderRadius: screenRadius }}
            >
              {/* Dynamic Island */}
              <div className="absolute top-0 left-1/2 z-50 -translate-x-1/2">
                <div
                  className="bg-device-notch mt-2.5 flex items-center justify-center gap-3 rounded-full"
                  style={{ height: notchHeight, width: notchWidth }}
                >
                  {/* Camera */}
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-800 ring-1 ring-zinc-700">
                    <div className="ml-0.5 mt-0.5 h-1 w-1 rounded-full bg-blue-400/30" />
                  </div>
                </div>
              </div>

              {/* Screen Content */}
              <div className="overflow-hidden" style={{ height }}>
                {children}
              </div>

              {/* Home Indicator */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2">
                <div className="h-[4px] w-[120px] rounded-full bg-foreground/20" />
              </div>
            </div>
          </div>

          {/* Side Buttons */}
          <div
            className="bg-device-bezel absolute left-[-2px] h-[28px] w-[3px] rounded-l-sm"
            style={{ top: Math.round(height * 0.175) }}
          />
          <div
            className="bg-device-bezel absolute left-[-2px] h-[28px] w-[3px] rounded-l-sm"
            style={{ top: Math.round(height * 0.225) }}
          />
          <div
            className="bg-device-bezel absolute left-[-2px] h-[16px] w-[3px] rounded-l-sm"
            style={{ top: Math.round(height * 0.125) }}
          />
          <div
            className="bg-device-bezel absolute right-[-2px] h-[42px] w-[3px] rounded-r-sm"
            style={{ top: Math.round(height * 0.2) }}
          />
        </div>
      </div>
    </motion.div>
  );
}
