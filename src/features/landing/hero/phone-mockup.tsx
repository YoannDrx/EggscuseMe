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
      {/* iPhone Frame (from portfolio-yoann) */}
      <div className="origin-top scale-75">
        <div className="relative mx-auto w-[375px]">
          {/* Device Shadow */}
          <div className="absolute inset-0 translate-y-8 scale-95 rounded-[50px] bg-gradient-to-b from-black/20 to-black/40 blur-3xl" />

          {/* Device Frame */}
          <div className="shadow-device relative rounded-[50px] bg-device-bg p-2.5">
            {/* Inner Bezel */}
            <div className="relative rounded-[42px] bg-device-bezel p-[2px]">
              {/* Screen Container */}
              <div className="relative overflow-hidden rounded-[40px] bg-background">
                {/* Dynamic Island */}
                <div className="absolute top-0 left-1/2 z-50 -translate-x-1/2">
                  <div className="bg-device-notch mt-2.5 flex h-[30px] w-[110px] items-center justify-center gap-3 rounded-full">
                    {/* Camera */}
                    <div className="h-2.5 w-2.5 rounded-full bg-zinc-800 ring-1 ring-zinc-700">
                      <div className="ml-0.5 mt-0.5 h-1 w-1 rounded-full bg-blue-400/30" />
                    </div>
                  </div>
                </div>

                {/* Screen Content */}
                <div className="h-[800px] overflow-hidden">{children}</div>

                {/* Home Indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2">
                  <div className="h-[4px] w-[120px] rounded-full bg-foreground/20" />
                </div>
              </div>
            </div>

            {/* Side Buttons */}
            <div className="bg-device-bezel absolute top-[140px] left-[-2px] h-[28px] w-[3px] rounded-l-sm" />
            <div className="bg-device-bezel absolute top-[180px] left-[-2px] h-[28px] w-[3px] rounded-l-sm" />
            <div className="bg-device-bezel absolute top-[100px] left-[-2px] h-[16px] w-[3px] rounded-l-sm" />
            <div className="bg-device-bezel absolute top-[160px] right-[-2px] h-[42px] w-[3px] rounded-r-sm" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
