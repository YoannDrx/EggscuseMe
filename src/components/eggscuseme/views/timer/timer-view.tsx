"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Eggy } from "@/features/mascot/components/eggy";
import { useThemeColors } from "../../theme";
import { BottomSheet, PageHeader } from "../../shared";
import { ProgressRing } from "./progress-ring";
import {
  CookingSelector,
  getCookingTime,
  type CookingType,
} from "./cooking-selector";

type TimerViewProps = {
  onTimerComplete?: () => void;
};

export function TimerView({ onTimerComplete }: TimerViewProps) {
  const colors = useThemeColors();
  const [cookingType, setCookingType] = useState<CookingType>("medium");
  const [timeLeft, setTimeLeft] = useState(getCookingTime("medium"));
  const [isRunning, setIsRunning] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalTime = getCookingTime(cookingType);
  const progress = 1 - timeLeft / totalTime;

  // Handle cooking type change
  const handleCookingTypeChange = useCallback(
    (type: CookingType) => {
      if (isRunning) return;
      setCookingType(type);
      setTimeLeft(getCookingTime(type));
    },
    [isRunning],
  );

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setShowComplete(true);
            onTimerComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, onTimerComplete]);

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getCookingTime(cookingType));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const closeComplete = () => {
    setShowComplete(false);
    resetTimer();
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Timer"
        subtitle="Cuisson parfaite"
        eggyMood={isRunning ? "timer" : "cooking"}
        action={
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={cn(
              "rounded-full p-2 transition-colors",
              colors.textMuted,
              "hover:bg-current/10",
            )}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        }
      />

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-24">
        {/* Timer Circle */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <ProgressRing progress={progress} size={280} strokeWidth={12}>
            <div className="flex flex-col items-center">
              <Eggy
                mood={
                  isRunning
                    ? "timer"
                    : timeLeft === 0
                      ? "celebrating"
                      : "cooking"
                }
                size="sm"
                className="mb-2"
              />
              <span
                className={cn("text-5xl font-bold tabular-nums", colors.text)}
              >
                {formatTime(timeLeft)}
              </span>
              <span className={cn("text-sm", colors.textMuted)}>
                {isRunning ? "en cours..." : "prêt"}
              </span>
            </div>
          </ProgressRing>
        </motion.div>

        {/* Controls */}
        <div className="mt-8 flex items-center gap-4">
          <motion.button
            onClick={resetTimer}
            disabled={timeLeft === totalTime && !isRunning}
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full border transition-colors",
              colors.card,
              colors.cardBorder,
              colors.text,
              "disabled:opacity-30",
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={24} />
          </motion.button>
          <motion.button
            onClick={toggleTimer}
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-full shadow-lg",
              colors.accentBg,
              colors.accentForeground,
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRunning ? (
              <Pause size={32} />
            ) : (
              <Play size={32} className="ml-1" />
            )}
          </motion.button>
          <div className="h-14 w-14" /> {/* Spacer for symmetry */}
        </div>

        {/* Cooking Type Selector */}
        <div className="mt-8 w-full max-w-sm">
          <CookingSelector
            selected={cookingType}
            onSelect={handleCookingTypeChange}
            disabled={isRunning}
          />
        </div>

        {/* Tip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "mt-6 rounded-2xl border p-4 text-center",
            colors.card,
            colors.cardBorder,
          )}
        >
          <p className={cn("text-sm", colors.textMuted)}>
            {cookingType === "soft" && "Plongez l'oeuf dans l'eau bouillante"}
            {cookingType === "medium" && "Démarrez le timer quand l'eau bout"}
            {cookingType === "hard" &&
              "Plongez dans l'eau froide après cuisson"}
          </p>
        </motion.div>
      </div>

      {/* Completion Modal */}
      <BottomSheet
        isOpen={showComplete}
        onClose={closeComplete}
        title="C'est prêt !"
      >
        <div className="flex flex-col items-center py-4">
          <Eggy mood="celebrating" size="lg" className="mb-4" />
          <p className={cn("mb-6 text-center text-lg", colors.text)}>
            Ton oeuf{" "}
            {cookingType === "soft"
              ? "coque"
              : cookingType === "medium"
                ? "mollet"
                : "dur"}{" "}
            est parfait !
          </p>
          <button
            onClick={closeComplete}
            className={cn(
              "w-full rounded-xl py-4 font-bold text-white shadow-md transition-opacity hover:opacity-90",
              colors.accentBg,
            )}
          >
            Super !
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
