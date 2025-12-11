"use client";

import { cn } from "@/lib/utils";
import { Check, Pause, Play, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { COOKING_OPTIONS } from "../demo-data";
import type { DemoState } from "../hooks/use-demo-state";

type DemoTimerViewProps = Pick<
  DemoState,
  | "selectedCooking"
  | "selectedOption"
  | "timerRunning"
  | "timerSeconds"
  | "timerProgress"
  | "totalSeconds"
  | "handleCookingChange"
  | "toggleTimer"
  | "resetTimer"
  | "formatTime"
>;

/**
 * Progress ring SVG component
 */
function ProgressRing({
  progress,
  size = 180,
  strokeWidth = 8,
  children,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-neo-bg"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-fresh-extra"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export function DemoTimerView({
  selectedCooking,
  selectedOption,
  timerRunning,
  timerSeconds,
  timerProgress,
  totalSeconds,
  handleCookingChange,
  toggleTimer,
  resetTimer,
  formatTime,
}: DemoTimerViewProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Timer Circle */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <ProgressRing progress={timerProgress} size={140} strokeWidth={6}>
          <div className="flex flex-col items-center">
            <span className="text-neo-text text-3xl font-bold tabular-nums">
              {formatTime(timerSeconds)}
            </span>
            <span className="text-neo-text-muted text-xs">
              {selectedOption.label.split(" ")[0]}
            </span>
          </div>
        </ProgressRing>
      </motion.div>

      {/* Description */}
      <div
        className={cn(
          "rounded-full px-4 py-2",
          "bg-fresh-extra/20 text-fresh-extra",
          "text-sm font-medium",
        )}
      >
        {selectedOption.description}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <motion.button
          type="button"
          onClick={toggleTimer}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "bg-neo-accent text-neo-accent-foreground",
            "flex h-10 items-center gap-2 rounded-full px-5",
            "shadow-[var(--shadow-neo-sm)]",
            "transition-all",
            "hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-md)]",
            "active:translate-y-0 active:shadow-[var(--shadow-neo-sm)]",
          )}
        >
          {timerRunning ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
          <span className="text-sm font-bold">
            {timerRunning ? "Pause" : "Demarrer"}
          </span>
        </motion.button>

        <motion.button
          type="button"
          onClick={resetTimer}
          disabled={timerSeconds === totalSeconds && !timerRunning}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "border-neo-border bg-neo-card text-neo-text",
            "flex size-10 items-center justify-center rounded-full",
            "border-[length:var(--border-neo)]",
            "shadow-[var(--shadow-neo-sm)]",
            "transition-all",
            "hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-md)]",
            "disabled:pointer-events-none disabled:opacity-30",
          )}
        >
          <RotateCcw className="size-4" />
        </motion.button>
      </div>

      {/* Cooking Type Selector */}
      <div
        className={cn(
          "w-full rounded-[var(--radius-neo-xl)]",
          "border-neo-border bg-neo-card border-[length:var(--border-neo)]",
          "shadow-[var(--shadow-neo-sm)]",
          "overflow-hidden",
        )}
      >
        <div className="border-neo-border/50 border-b-[length:var(--border-neo)] px-4 py-3">
          <h4 className="text-neo-text text-sm font-bold">Cuisson du jaune</h4>
        </div>
        <div className="divide-neo-border/30 divide-y">
          {COOKING_OPTIONS.map((option) => {
            const isSelected = option.id === selectedCooking;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleCookingChange(option.id)}
                disabled={timerRunning}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3",
                  "transition-colors",
                  isSelected ? "bg-neo-accent/10" : "hover:bg-neo-bg/50",
                  timerRunning && "cursor-not-allowed opacity-50",
                )}
              >
                <div
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full",
                    "border-2 transition-colors",
                    isSelected
                      ? "border-fresh-extra bg-fresh-extra"
                      : "border-neo-border",
                  )}
                >
                  {isSelected && <Check className="size-3 text-white" />}
                </div>
                <div className="flex-1 text-left">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-neo-text" : "text-neo-text-muted",
                    )}
                  >
                    {option.label}
                  </p>
                  <p className="text-neo-text-muted text-xs">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
