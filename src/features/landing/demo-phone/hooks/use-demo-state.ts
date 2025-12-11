"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DemoTab } from "../demo-types";
import { COOKING_OPTIONS } from "../demo-data";

export function useDemoState() {
  // Navigation state
  const [activeTab, setActiveTab] = useState<DemoTab>("fridge");
  const [isQuickActionsOpen, setQuickActionsOpen] = useState(false);

  // Timer state
  const [selectedCooking, setSelectedCooking] = useState(COOKING_OPTIONS[0].id);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(COOKING_OPTIONS[0].seconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get selected cooking option
  const selectedOption =
    COOKING_OPTIONS.find((opt) => opt.id === selectedCooking) ??
    COOKING_OPTIONS[0];
  const totalSeconds = selectedOption.seconds;
  const timerProgress = 1 - timerSeconds / totalSeconds;

  // Handle cooking type change
  const handleCookingChange = useCallback(
    (id: string) => {
      if (timerRunning) return;
      const option = COOKING_OPTIONS.find((opt) => opt.id === id);
      if (option) {
        setSelectedCooking(id);
        setTimerSeconds(option.seconds);
      }
    },
    [timerRunning],
  );

  // Timer logic
  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
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
  }, [timerRunning, timerSeconds]);

  // Timer controls
  const toggleTimer = useCallback(() => {
    setTimerRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerSeconds(selectedOption.seconds);
  }, [selectedOption.seconds]);

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return {
    // Navigation
    activeTab,
    setActiveTab,
    isQuickActionsOpen,
    setQuickActionsOpen,

    // Timer
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
  };
}

export type DemoState = ReturnType<typeof useDemoState>;
