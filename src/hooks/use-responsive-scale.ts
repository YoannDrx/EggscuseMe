"use client";

import { useEffect, useState } from "react";

/**
 * Hook to calculate responsive scale for the phone mockup
 * based on viewport height to ensure the phone fits within the viewport.
 *
 * Breakpoints:
 * - Mobile (< 640px viewport height): 0.55
 * - Tablet (640-768px): 0.65
 * - Desktop small (768-900px): 0.75
 * - Desktop (900-1000px): 0.85
 * - Large (> 1000px): 0.95
 */
export function useResponsiveScale(): number {
  const [scale, setScale] = useState(0.75);

  useEffect(() => {
    function calculateScale() {
      const vh = window.innerHeight;

      if (vh < 640) {
        setScale(0.55);
      } else if (vh < 768) {
        setScale(0.65);
      } else if (vh < 900) {
        setScale(0.75);
      } else if (vh < 1000) {
        setScale(0.85);
      } else {
        setScale(0.95);
      }
    }

    calculateScale();
    window.addEventListener("resize", calculateScale);

    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  return scale;
}
