"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from 'motion/react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useState, type ReactNode } from "react";

export type ChartCarouselProps = {
  /** Chart items to display */
  children: ReactNode[];
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Show dots indicator */
  showDots?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Gap between items */
  gap?: number;
};

/**
 * Carousel for charts on mobile
 * - Swipe to navigate between charts
 * - Dots indicator
 * - Full width charts
 */
export function ChartCarousel({
  children,
  showArrows = false,
  showDots = true,
  className,
  gap = 16,
}: ChartCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const itemCount = children.length;

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info;
      const swipe = offset.x + velocity.x * 0.3;

      if (swipe < -50 && currentIndex < itemCount - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (swipe > 50 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    },
    [currentIndex, itemCount],
  );

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goNext = useCallback(() => {
    if (currentIndex < itemCount - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, itemCount]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Progress indicator for swipe (available for future use)
  const _progress = useTransform(
    x,
    [-100, 0, 100],
    [
      Math.min(currentIndex + 1, itemCount - 1),
      currentIndex,
      Math.max(currentIndex - 1, 0),
    ],
  );

  return (
    <div className={cn("relative", className)}>
      {/* Carousel container */}
      <div className="overflow-hidden">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          animate={{ x: `${-currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ x }}
          className="flex cursor-grab active:cursor-grabbing"
        >
          {children.map((child, index) => (
            <motion.div
              key={index}
              className="w-full shrink-0"
              style={{ paddingRight: index < itemCount - 1 ? gap : 0 }}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation arrows */}
      {showArrows && itemCount > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            disabled={currentIndex === 0}
            className={cn(
              "absolute top-1/2 left-2 -translate-y-1/2",
              "flex size-10 items-center justify-center rounded-full",
              "bg-background/80 shadow-md backdrop-blur-sm",
              "transition-opacity",
              currentIndex === 0 ? "opacity-30" : "opacity-100",
            )}
            aria-label="Précédent"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={currentIndex === itemCount - 1}
            className={cn(
              "absolute top-1/2 right-2 -translate-y-1/2",
              "flex size-10 items-center justify-center rounded-full",
              "bg-background/80 shadow-md backdrop-blur-sm",
              "transition-opacity",
              currentIndex === itemCount - 1 ? "opacity-30" : "opacity-100",
            )}
            aria-label="Suivant"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {showDots && itemCount > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {children.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-200",
                index === currentIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2",
              )}
              aria-label={`Aller au graphique ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Single chart item wrapper
 */
export function ChartItem({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("bg-card border-border rounded-2xl border p-4", className)}
    >
      {title && (
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
