"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoSliderVariants = cva("relative flex w-full touch-none select-none", {
  variants: {
    size: {
      sm: "h-4",
      md: "h-5",
      lg: "h-6",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const trackHeights = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

const thumbSizes = {
  sm: "size-5",
  md: "size-6",
  lg: "size-7",
};

export type NeoSliderProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> &
  VariantProps<typeof neoSliderVariants> & {
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    showValue?: boolean;
    label?: string;
  };

const NeoSlider = React.forwardRef<HTMLDivElement, NeoSliderProps>(
  (
    {
      className,
      size = "md",
      value: controlledValue,
      defaultValue = 0,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      disabled,
      showValue,
      label,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const value = controlledValue ?? internalValue;
    const trackRef = React.useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const percentage = ((value - min) / (max - min)) * 100;

    const updateValue = React.useCallback(
      (clientX: number) => {
        if (!trackRef.current || disabled) return;

        const rect = trackRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        const rawValue = min + percent * (max - min);
        const steppedValue = Math.round(rawValue / step) * step;
        const clampedValue = Math.max(min, Math.min(max, steppedValue));

        setInternalValue(clampedValue);
        onValueChange?.(clampedValue);
      },
      [disabled, min, max, step, onValueChange],
    );

    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled) return;
      setIsDragging(true);
      updateValue(e.clientX);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      if (disabled) return;
      setIsDragging(true);
      updateValue(e.touches[0].clientX);
    };

    React.useEffect(() => {
      if (!isDragging) return;

      const handleMouseMove = (e: MouseEvent) => updateValue(e.clientX);
      const handleTouchMove = (e: TouchEvent) =>
        updateValue(e.touches[0].clientX);
      const handleEnd = () => setIsDragging(false);

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleEnd);
      };
    }, [isDragging, updateValue]);

    return (
      <div className="w-full">
        {(label ?? showValue) && (
          <div className="mb-2 flex items-center justify-between">
            {label && (
              <label className="text-neo-text ml-1 text-sm font-bold tracking-wider uppercase">
                {label}
              </label>
            )}
            {showValue && (
              <span className="text-neo-accent text-sm font-bold">{value}</span>
            )}
          </div>
        )}

        <div
          ref={ref}
          data-slot="neo-slider"
          className={cn(
            neoSliderVariants({ size, className }),
            "items-center",
            disabled && "cursor-not-allowed opacity-50",
          )}
          {...props}
        >
          {/* Track */}
          <div
            ref={trackRef}
            className={cn(
              "relative w-full rounded-full",
              trackHeights[size ?? "md"],
              "bg-neo-input",
              "border-neo-border/30 border-[length:var(--border-neo)]",
              "cursor-pointer",
            )}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Fill */}
            <div
              className={cn(
                "absolute inset-y-0 left-0 rounded-full",
                "bg-neo-accent",
                "border-neo-border border-r-[length:var(--border-neo)]",
              )}
              style={{ width: `${percentage}%` }}
            />

            {/* Thumb */}
            <motion.div
              className={cn(
                "absolute top-1/2 -translate-y-1/2",
                thumbSizes[size ?? "md"],
                "rounded-full",
                "bg-white",
                "border-neo-border border-[length:var(--border-neo)]",
                "shadow-[var(--shadow-neo-sm)]",
                "cursor-grab active:cursor-grabbing",
                isDragging && "scale-110",
              )}
              style={{
                left: `calc(${percentage}% - ${size === "sm" ? 10 : size === "lg" ? 14 : 12}px)`,
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
          </div>
        </div>
      </div>
    );
  },
);

NeoSlider.displayName = "NeoSlider";

export { NeoSlider, neoSliderVariants };
