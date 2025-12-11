"use client";

import { sendMessageToServiceWorker } from "@/lib/pwa/service-worker-registration";
import { useCallback, useEffect, useRef, useState } from "react";

type TimerStatus = "idle" | "running" | "paused" | "completed";

export function useWorkerTimer() {
  const workerRef = useRef<Worker | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Créer le Web Worker
    workerRef.current = new Worker(
      new URL("@/lib/pwa/timer-worker.ts", import.meta.url),
    );

    workerRef.current.onmessage = (e: MessageEvent) => {
      const {
        type,
        remaining,
        message: msg,
      } = e.data as {
        type: string;
        remaining?: number;
        running?: boolean;
        message?: string;
      };

      switch (type) {
        case "TICK":
          setTimeLeft(remaining ?? 0);
          break;
        case "COMPLETE":
          setStatus("completed");
          setTimeLeft(0);
          // Déclencher notification via Service Worker
          sendMessageToServiceWorker({
            type: "TIMER_COMPLETE",
            message: msg ?? "Vos œufs sont prêts !",
          });
          // Vibration si disponible
          if ("vibrate" in navigator) {
            navigator.vibrate([500, 200, 500, 200, 500]);
          }
          break;
        case "STATUS":
          setTimeLeft(remaining ?? 0);
          if (e.data.running) {
            setStatus("running");
          }
          break;
        case "STOPPED":
          setStatus("idle");
          setTimeLeft(0);
          break;
      }
    };

    // Récupérer l'état au montage
    workerRef.current.postMessage({ type: "GET_STATUS" });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const start = useCallback((duration: number, timerMessage: string) => {
    workerRef.current?.postMessage({
      type: "START",
      duration,
      message: timerMessage,
    });
    setStatus("running");
    setTimeLeft(duration);
    setMessage(timerMessage);
  }, []);

  const stop = useCallback(() => {
    workerRef.current?.postMessage({ type: "STOP" });
    setStatus("idle");
    setTimeLeft(0);
  }, []);

  const pause = useCallback(() => {
    workerRef.current?.postMessage({ type: "PAUSE" });
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    workerRef.current?.postMessage({ type: "RESUME" });
    setStatus("running");
  }, []);

  const reset = useCallback(() => {
    workerRef.current?.postMessage({ type: "STOP" });
    setStatus("idle");
    setTimeLeft(0);
  }, []);

  return {
    timeLeft,
    status,
    message,
    isRunning: status === "running",
    isPaused: status === "paused",
    isCompleted: status === "completed",
    isIdle: status === "idle",
    start,
    stop,
    pause,
    resume,
    reset,
  };
}
