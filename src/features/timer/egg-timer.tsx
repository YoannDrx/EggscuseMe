"use client";

import { NeoButton } from "@/components/neo";
import {
  NeoCard,
  NeoCardContent,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import { NeoLabel } from "@/components/neo";
import { NeoSelect, NeoSelectItem } from "@/components/neo";
import { TimerIllustration } from "@/components/eggscuseme/illustrations";
import type { EggSize } from "@/generated/prisma";
import { sendMessageToServiceWorker } from "@/lib/pwa/service-worker-registration";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Check, Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  calculateCookingTime,
  formatTime,
  type EggTemperature,
  type YolkPreference,
} from "./cooking-times";
import { CircularProgress } from "./circular-progress";
import {
  getPersistentTimerRemaining,
  readPersistentTimer,
  TIMER_UPDATED_EVENT,
  type PersistentTimerSnapshot,
  writePersistentTimer,
} from "./persistent-timer";

const SIZES: EggSize[] = ["S", "M", "L", "XL"];
const TEMPERATURES: EggTemperature[] = ["fridge", "room"];
const YOLK_PREFERENCES: YolkPreference[] = ["runny", "soft", "medium", "hard"];

function playTimerDoneSound() {
  const audioContext =
    (window as unknown as { AudioContext?: typeof AudioContext }).AudioContext ??
    (
      window as unknown as {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext;

  if (!audioContext) return;

  const context = new audioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, now);
  oscillator.frequency.setValueAtTime(660, now + 0.22);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.75);
  oscillator.onended = () => {
    void context.close();
  };
}

// Color configuration based on yolk preference
// Using oklch colors that match the CSS variables for SVG compatibility
const yolkColors: Record<
  YolkPreference,
  { accent: string; bg: string; text: string; label: string; yolkBg: string }
> = {
  runny: {
    accent: "oklch(0.72 0.18 155)", // --fresh-extra
    bg: "bg-fresh-extra/10",
    text: "text-fresh-extra",
    label: "Coulant",
    yolkBg: "oklch(0.72 0.18 155)",
  },
  soft: {
    accent: "oklch(0.65 0.15 140)", // Slightly different green
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    label: "Mollet",
    yolkBg: "oklch(0.65 0.15 140)",
  },
  medium: {
    accent: "oklch(0.88 0.14 95)", // --fresh
    bg: "bg-fresh/10",
    text: "text-fresh",
    label: "Mi-cuit",
    yolkBg: "oklch(0.88 0.14 95)",
  },
  hard: {
    accent: "oklch(0.72 0.16 50)", // --fresh-cook
    bg: "bg-fresh-cook/10",
    text: "text-fresh-cook",
    label: "Dur",
    yolkBg: "oklch(0.72 0.16 50)",
  },
};

export function EggTimer() {
  const t = useTranslations("timer");
  const [size, setSize] = useState<EggSize>("M");
  const [temperature, setTemperature] = useState<EggTemperature>("fridge");
  const [yolkPreference, setYolkPreference] = useState<YolkPreference>("soft");

  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [targetAt, setTargetAt] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentColor = yolkColors[yolkPreference];

  const applySnapshot = useCallback((snapshot: PersistentTimerSnapshot) => {
    const remaining = getPersistentTimerRemaining(snapshot);
    const completed =
      snapshot.status === "completed" ||
      (snapshot.status === "running" && remaining === 0);

    setSize(snapshot.size);
    setTemperature(snapshot.temperature);
    setYolkPreference(snapshot.yolkPreference);
    setTotalTime(snapshot.totalSeconds);
    setTimeRemaining(remaining);
    setTargetAt(completed ? null : snapshot.targetAt);
    setIsRunning(snapshot.status === "running" && remaining > 0);
    setIsDone(completed);
    setHasStarted(snapshot.status !== "idle");
  }, []);

  useEffect(() => {
    const storedTimer = readPersistentTimer();
    if (storedTimer) applySnapshot(storedTimer);
    setIsHydrated(true);

    const handleTimerUpdate = (event: Event) => {
      const snapshot = (event as CustomEvent<PersistentTimerSnapshot>).detail;
      applySnapshot(snapshot);
    };
    window.addEventListener(TIMER_UPDATED_EVENT, handleTimerUpdate);
    return () =>
      window.removeEventListener(TIMER_UPDATED_EVENT, handleTimerUpdate);
  }, [applySnapshot]);

  // Calculate time when settings change (only if timer hasn't started).
  useEffect(() => {
    if (isHydrated && !hasStarted) {
      const time = calculateCookingTime(size, temperature, yolkPreference);
      setTimeRemaining(time);
      setTotalTime(time);
      setIsDone(false);
    }
  }, [size, temperature, yolkPreference, hasStarted, isHydrated]);

  // Derive remaining time from an absolute timestamp so background tab
  // suspension and route changes cannot slow the timer down.
  useEffect(() => {
    if (!isRunning || targetAt === null) return;

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((targetAt - Date.now()) / 1000));
      setTimeRemaining(remaining);

      if (remaining > 0) return;

      setIsRunning(false);
      setIsDone(true);
      setTargetAt(null);
      const completed: PersistentTimerSnapshot = {
        version: 1,
        status: "completed",
        targetAt: null,
        remainingSeconds: 0,
        totalSeconds: totalTime,
        size,
        temperature,
        yolkPreference,
      };
      writePersistentTimer(completed);
      playTimerDoneSound();
      sendMessageToServiceWorker({
        type: "TIMER_COMPLETE",
        message: t("done"),
      });
    };

    tick();
    intervalRef.current = setInterval(tick, 500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, size, t, targetAt, temperature, totalTime, yolkPreference]);

  const handleStart = useCallback(() => {
    if (timeRemaining > 0) {
      const nextTargetAt = Date.now() + timeRemaining * 1000;
      setIsRunning(true);
      setHasStarted(true);
      setIsDone(false);
      setTargetAt(nextTargetAt);
      writePersistentTimer({
        version: 1,
        status: "running",
        targetAt: nextTargetAt,
        remainingSeconds: timeRemaining,
        totalSeconds: totalTime,
        size,
        temperature,
        yolkPreference,
      });
    }
  }, [size, temperature, timeRemaining, totalTime, yolkPreference]);

  const handlePause = useCallback(() => {
    const remaining = targetAt
      ? Math.max(0, Math.ceil((targetAt - Date.now()) / 1000))
      : timeRemaining;
    setIsRunning(false);
    setTargetAt(null);
    setTimeRemaining(remaining);
    writePersistentTimer({
      version: 1,
      status: "paused",
      targetAt: null,
      remainingSeconds: remaining,
      totalSeconds: totalTime,
      size,
      temperature,
      yolkPreference,
    });
  }, [size, targetAt, temperature, timeRemaining, totalTime, yolkPreference]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setHasStarted(false);
    setTargetAt(null);
    const time = calculateCookingTime(size, temperature, yolkPreference);
    setTimeRemaining(time);
    setTotalTime(time);
    setIsDone(false);
    writePersistentTimer({
      version: 1,
      status: "idle",
      targetAt: null,
      remainingSeconds: time,
      totalSeconds: time,
      size,
      temperature,
      yolkPreference,
    });
  }, [size, temperature, yolkPreference]);

  const progress = totalTime > 0 ? (totalTime - timeRemaining) / totalTime : 0;

  return (
    <NeoCard variant="elevated" className="w-full max-w-md">
      <NeoCardHeader className="pb-4">
        <NeoCardTitle className="font-heading flex items-center gap-3 text-xl">
          <TimerIllustration className="h-16 w-16 md:h-20 md:w-20" />
          {t("cookingTitle")}
          {isDone && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <Volume2 className="text-fresh-extra size-5 animate-pulse" />
            </motion.div>
          )}
        </NeoCardTitle>
      </NeoCardHeader>
      <NeoCardContent className="space-y-6 px-4">
        {/* Timer Display with Circular Progress */}
        <div className="flex flex-col items-center justify-center gap-4">
          <CircularProgress
            progress={progress}
            size={200}
            strokeWidth={12}
            progressColor={currentColor.accent}
            isRunning={isRunning}
            isComplete={isDone}
          >
            <div className="flex flex-col items-center">
              {/* Time display */}
              <motion.span
                className={cn(
                  "font-heading text-5xl font-bold tabular-nums",
                  isDone && "text-fresh-extra",
                )}
                animate={{
                  scale: isDone ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 0.5,
                  repeat: isDone ? Infinity : 0,
                  repeatDelay: 1,
                }}
              >
                {formatTime(timeRemaining)}
              </motion.span>

              {/* Status label */}
              <span
                className={cn(
                  "mt-1 text-sm font-medium",
                  isDone ? "text-fresh-extra" : "text-muted-foreground",
                )}
              >
                {isDone
                  ? t("done")
                  : isRunning
                    ? t("cooking")
                    : currentColor.label}
              </span>
            </div>
          </CircularProgress>

          {/* Cooking preference tag - Below the dial */}
          {!isDone && (
            <div
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-semibold",
                currentColor.bg,
                currentColor.text,
              )}
            >
              {t(`yolkDescriptions.${yolkPreference}`)}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          {!isRunning ? (
            <div className="relative">
              {/* White offset behind button */}
              <div className="absolute top-1 left-1 h-full w-full rounded-2xl bg-white/90 dark:bg-white/30" />
              <motion.div
                className="relative"
                whileHover={{ x: 1, y: 1 }}
                whileTap={{ x: 2, y: 2 }}
                transition={{ duration: 0.1 }}
              >
                <NeoButton
                  onClick={handleStart}
                  size="xl"
                  disabled={isDone || timeRemaining === 0}
                  className={cn(
                    "border-foreground/20 relative min-w-36 rounded-2xl border-2 font-bold",
                    "bg-primary text-primary-foreground",
                    "disabled:opacity-50",
                  )}
                >
                  <Play className="mr-2 size-5" />
                  {timeRemaining < totalTime && timeRemaining > 0
                    ? t("resume")
                    : t("start")}
                </NeoButton>
              </motion.div>
            </div>
          ) : (
            <div className="relative">
              {/* White offset behind button */}
              <div className="absolute top-1 left-1 h-full w-full rounded-2xl bg-white/90 dark:bg-white/30" />
              <motion.div
                className="relative"
                whileHover={{ x: 1, y: 1 }}
                whileTap={{ x: 2, y: 2 }}
                transition={{ duration: 0.1 }}
              >
                <NeoButton
                  onClick={handlePause}
                  size="xl"
                  variant="outline"
                  className="border-foreground/20 relative min-w-36 rounded-2xl border-2 font-bold"
                >
                  <Pause className="mr-2 size-5" />
                  {t("pause")}
                </NeoButton>
              </motion.div>
            </div>
          )}

          <div className="relative">
            {/* White offset behind button */}
            <div className="bg-foreground/20 absolute top-1 left-1 h-full w-full rounded-2xl" />
            <motion.div
              className="relative"
              whileHover={{ x: 1, y: 1 }}
              whileTap={{ x: 2, y: 2 }}
              transition={{ duration: 0.1 }}
            >
              <NeoButton
                onClick={handleReset}
                size="xl"
                variant="outline"
                className="border-foreground/20 relative rounded-2xl border-2 disabled:opacity-50"
                disabled={timeRemaining === totalTime && !isRunning && !isDone}
              >
                <RotateCcw className="size-5" />
              </NeoButton>
            </motion.div>
          </div>
        </div>

        {/* Done message */}
        {isDone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-fresh-extra/10 border-fresh-extra/30 rounded-2xl border-2 p-4 text-center"
          >
            <p className="text-fresh-extra text-lg font-bold">
              {t("eggReady")}
            </p>
            <p className="text-fresh-extra/80 text-sm">
              {t("removeFromWater")}
            </p>
          </motion.div>
        )}

        {/* Settings - Only show when not running */}
        {!isRunning && !isDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-border/50 bg-muted/20 space-y-4 rounded-2xl border p-4"
          >
            {/* Yolk preference - Main setting with visual cards */}
            <div className="space-y-3">
              <NeoLabel className="text-sm font-semibold">
                {t("yolkCooking")}
              </NeoLabel>
              <div className="flex flex-col gap-2 md:grid md:grid-cols-4 md:gap-2">
                {YOLK_PREFERENCES.map((pref) => {
                  const colors = yolkColors[pref];
                  const isSelected = yolkPreference === pref;
                  return (
                    <motion.button
                      key={pref}
                      type="button"
                      onClick={() => setYolkPreference(pref)}
                      className={cn(
                        "relative flex items-center gap-3 rounded-xl p-3 text-left transition-all",
                        "border-2 md:flex-col md:items-center md:text-center",
                        isSelected
                          ? "border-fresh-extra bg-muted/50"
                          : "bg-muted/50 hover:bg-muted border-transparent",
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Egg yolk indicator with check inside when selected */}
                      <div
                        className="border-foreground/10 relative flex size-10 items-center justify-center rounded-full border-2"
                        style={{
                          background: `radial-gradient(circle at 40% 40%, ${colors.yolkBg}, ${colors.yolkBg}80)`,
                        }}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <Check
                              className="text-fresh-extra size-5 drop-shadow-md"
                              strokeWidth={3}
                            />
                          </motion.div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col items-start justify-center md:items-center">
                        <span
                          className={cn(
                            "text-sm leading-tight font-semibold",
                            isSelected
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {t(`yolkPreferences.${pref}`)}
                        </span>
                        <span className="text-neo-text-muted mt-1 text-xs leading-snug md:hidden">
                          {t(`yolkDescriptions.${pref}`)}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Size and Temperature row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <NeoLabel className="text-sm font-medium">{t("size")}</NeoLabel>
                <NeoSelect
                  value={size}
                  onValueChange={(v) => setSize(v as EggSize)}
                  className="border-neo-border/50 rounded-xl"
                >
                  {SIZES.map((value) => (
                    <NeoSelectItem key={value} value={value}>
                      {t(`sizes.${value}`)}
                    </NeoSelectItem>
                  ))}
                </NeoSelect>
              </div>

              <div className="space-y-2">
                <NeoLabel className="text-sm font-medium">
                  {t("temperature")}
                </NeoLabel>
                <NeoSelect
                  value={temperature}
                  onValueChange={(v) => setTemperature(v as EggTemperature)}
                  className="border-neo-border/50 rounded-xl"
                >
                  {TEMPERATURES.map((value) => (
                    <NeoSelectItem key={value} value={value}>
                      {t(`temperatures.${value}`)}
                    </NeoSelectItem>
                  ))}
                </NeoSelect>
              </div>
            </div>
          </motion.div>
        )}
      </NeoCardContent>
    </NeoCard>
  );
}
