"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EggSize } from "@/generated/prisma";
import { Eggy } from "@/features/mascot";
import { cn } from "@/lib/utils";
import { Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  calculateCookingTime,
  formatTime,
  type EggTemperature,
  type YolkPreference,
} from "./cooking-times";

const SIZES: EggSize[] = ["S", "M", "L", "XL"];
const TEMPERATURES: EggTemperature[] = ["fridge", "room"];
const YOLK_PREFERENCES: YolkPreference[] = ["runny", "soft", "medium", "hard"];

export function EggTimer() {
  const t = useTranslations("timer");
  const [size, setSize] = useState<EggSize>("M");
  const [temperature, setTemperature] = useState<EggTemperature>("fridge");
  const [yolkPreference, setYolkPreference] = useState<YolkPreference>("soft");

  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate time when settings change
  useEffect(() => {
    if (!isRunning) {
      const time = calculateCookingTime(size, temperature, yolkPreference);
      setTimeRemaining(time);
      setTotalTime(time);
      setIsDone(false);
    }
  }, [size, temperature, yolkPreference, isRunning]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsDone(true);
            // Play sound
            if (audioRef.current) {
              audioRef.current.play().catch(() => {
                // Audio play failed, likely due to autoplay policy
              });
            }
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
  }, [isRunning, timeRemaining]);

  const handleStart = useCallback(() => {
    setIsRunning(true);
    setIsDone(false);
  }, []);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    const time = calculateCookingTime(size, temperature, yolkPreference);
    setTimeRemaining(time);
    setTotalTime(time);
    setIsDone(false);
  }, [size, temperature, yolkPreference]);

  const progress =
    totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;

  return (
    <Card variant="sunny" className="w-full max-w-md">
      <CardHeader className="pb-4">
        <CardTitle className="font-heading flex items-center gap-3 text-xl">
          <Eggy
            mood={isDone ? "happy" : isRunning ? "chef" : "chef"}
            size="sm"
            animate={isRunning}
          />
          {t("cookingTitle")}
          {isDone && (
            <Volume2 className="text-fresh-extra size-5 animate-pulse" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Bubbles animation container */}
          <div
            className={cn(
              "absolute inset-0 overflow-hidden rounded-full",
              isRunning && "animate-bubbles",
            )}
          >
            {isRunning &&
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-primary/20 absolute bottom-0 animate-[bubble_2s_ease-in-out_infinite] rounded-full"
                  style={{
                    width: `${8 + Math.random() * 12}px`,
                    height: `${8 + Math.random() * 12}px`,
                    left: `${10 + Math.random() * 80}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1.5 + Math.random() * 1}s`,
                  }}
                />
              ))}
          </div>

          {/* Timer circle */}
          <div
            className={cn(
              "relative flex size-52 flex-col items-center justify-center rounded-full border-[6px] transition-all duration-500",
              isDone
                ? "border-fresh-extra bg-fresh-extra/10"
                : isRunning
                  ? "border-primary/30 bg-primary/5 dark:bg-primary/10"
                  : "border-muted bg-muted/30",
            )}
          >
            <span
              className={cn(
                "font-heading text-5xl font-bold tabular-nums",
                isDone && "text-fresh-extra",
              )}
            >
              {formatTime(timeRemaining)}
            </span>
            <span className="text-muted-foreground text-sm">
              {isDone ? t("done") : t(`yolkDescriptions.${yolkPreference}`)}
            </span>
          </div>

          {/* Progress ring */}
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 220 220">
            <circle
              cx="110"
              cy="110"
              r="100"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-transparent"
            />
            {(isRunning || progress > 0) && (
              <circle
                cx="110"
                cy="110"
                r="100"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={628.32}
                strokeDashoffset={628.32 * (1 - progress / 100)}
                className={cn(
                  "transition-all duration-1000",
                  isDone ? "text-fresh-extra" : "text-primary",
                )}
              />
            )}
          </svg>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          {!isRunning ? (
            <Button
              variant="neubrutalism"
              onClick={handleStart}
              size="lg"
              disabled={isDone}
              className="min-w-32"
            >
              <Play className="mr-2 size-5" />
              {timeRemaining < totalTime ? t("resume") : t("start")}
            </Button>
          ) : (
            <Button
              variant="neubrutalism-outline"
              onClick={handlePause}
              size="lg"
              className="min-w-32"
            >
              <Pause className="mr-2 size-5" />
              {t("pause")}
            </Button>
          )}
          <Button variant="ghost" onClick={handleReset} size="lg">
            <RotateCcw className="mr-2 size-5" />
            {t("reset")}
          </Button>
        </div>

        {/* Settings */}
        {!isRunning && (
          <div className="bg-muted/30 space-y-4 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t("size")}</Label>
                <Select
                  value={size}
                  onValueChange={(v) => setSize(v as EggSize)}
                >
                  <SelectTrigger className="border-foreground/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`sizes.${value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("temperature")}
                </Label>
                <Select
                  value={temperature}
                  onValueChange={(v) => setTemperature(v as EggTemperature)}
                >
                  <SelectTrigger className="border-foreground/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPERATURES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`temperatures.${value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("yolkCooking")}</Label>
              <Select
                value={yolkPreference}
                onValueChange={(v) => setYolkPreference(v as YolkPreference)}
              >
                <SelectTrigger className="border-foreground/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YOLK_PREFERENCES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(`yolkPreferences.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Audio element for notification */}
        <audio ref={audioRef} preload="auto">
          <source src="/sounds/timer-done.mp3" type="audio/mpeg" />
        </audio>
      </CardContent>
    </Card>
  );
}
