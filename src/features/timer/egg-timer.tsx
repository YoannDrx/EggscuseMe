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
import { cn } from "@/lib/utils";
import { Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  calculateCookingTime,
  formatTime,
  getCookingDescription,
  type EggTemperature,
  type YolkPreference,
} from "./cooking-times";

export function EggTimer() {
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Egg Timer
          {isDone && (
            <Volume2 className="text-fresh-extra size-5 animate-pulse" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="relative flex flex-col items-center justify-center">
          <div
            className={cn(
              "flex size-48 flex-col items-center justify-center rounded-full border-8 transition-colors",
              isDone
                ? "border-fresh-extra bg-fresh-extra/10"
                : isRunning
                  ? "border-primary bg-primary/10"
                  : "border-muted bg-muted/50",
            )}
          >
            <span
              className={cn(
                "text-5xl font-bold tabular-nums",
                isDone && "text-fresh-extra",
              )}
            >
              {formatTime(timeRemaining)}
            </span>
            <span className="text-muted-foreground text-sm">
              {isDone ? "Done!" : getCookingDescription(yolkPreference)}
            </span>
          </div>

          {/* Progress ring */}
          {isRunning && (
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-primary/20"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={565.48}
                strokeDashoffset={565.48 * (1 - progress / 100)}
                className="text-primary transition-all duration-1000"
              />
            </svg>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          {!isRunning ? (
            <Button onClick={handleStart} size="lg" disabled={isDone}>
              <Play className="mr-2 size-5" />
              {timeRemaining < totalTime ? "Resume" : "Start"}
            </Button>
          ) : (
            <Button onClick={handlePause} size="lg" variant="outline">
              <Pause className="mr-2 size-5" />
              Pause
            </Button>
          )}
          <Button onClick={handleReset} size="lg" variant="ghost">
            <RotateCcw className="mr-2 size-5" />
            Reset
          </Button>
        </div>

        {/* Settings */}
        {!isRunning && (
          <div className="grid gap-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Egg Size</Label>
                <Select
                  value={size}
                  onValueChange={(v) => setSize(v as EggSize)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">Small (S)</SelectItem>
                    <SelectItem value="M">Medium (M)</SelectItem>
                    <SelectItem value="L">Large (L)</SelectItem>
                    <SelectItem value="XL">Extra Large (XL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Temperature</Label>
                <Select
                  value={temperature}
                  onValueChange={(v) => setTemperature(v as EggTemperature)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fridge">From Fridge</SelectItem>
                    <SelectItem value="room">Room Temperature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Yolk Preference</Label>
              <Select
                value={yolkPreference}
                onValueChange={(v) => setYolkPreference(v as YolkPreference)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="runny">Runny (very soft)</SelectItem>
                  <SelectItem value="soft">Soft (jammy)</SelectItem>
                  <SelectItem value="medium">Medium (creamy)</SelectItem>
                  <SelectItem value="hard">Hard (fully cooked)</SelectItem>
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
