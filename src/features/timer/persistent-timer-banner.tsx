"use client";

import { sendMessageToServiceWorker } from "@/lib/pwa/service-worker-registration";
import { cn } from "@/lib/utils";
import { Check, Timer } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatTime } from "./cooking-times";
import {
  getPersistentTimerRemaining,
  readPersistentTimer,
  TIMER_UPDATED_EVENT,
  type PersistentTimerSnapshot,
  writePersistentTimer,
} from "./persistent-timer";

export function PersistentTimerBanner() {
  const t = useTranslations("timer");
  const [snapshot, setSnapshot] = useState<PersistentTimerSnapshot | null>(null);
  const [remaining, setRemaining] = useState(0);

  const refresh = useCallback(() => {
    const current = readPersistentTimer();
    setSnapshot(current);
    setRemaining(current ? getPersistentTimerRemaining(current) : 0);
  }, []);

  useEffect(() => {
    refresh();

    const handleUpdate = () => refresh();
    window.addEventListener(TIMER_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(TIMER_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refresh]);

  useEffect(() => {
    if (snapshot?.status !== "running") return;

    const updateRemaining = () => {
      const current = readPersistentTimer();
      if (current?.status !== "running") {
        refresh();
        return;
      }

      const nextRemaining = getPersistentTimerRemaining(current);
      setRemaining(nextRemaining);

      if (nextRemaining > 0) return;

      const completed: PersistentTimerSnapshot = {
        ...current,
        status: "completed",
        targetAt: null,
        remainingSeconds: 0,
      };
      writePersistentTimer(completed);
      sendMessageToServiceWorker({
        type: "TIMER_COMPLETE",
        message: t("done"),
      });
      if ("vibrate" in navigator) navigator.vibrate([300, 150, 300]);
    };

    updateRemaining();
    const interval = window.setInterval(updateRemaining, 500);
    return () => window.clearInterval(interval);
  }, [refresh, snapshot?.status, t]);

  const label = useMemo(() => {
    if (snapshot?.status === "completed") return t("done");
    if (snapshot?.status === "paused") return t("pausedBanner");
    return t("runningBanner", { time: formatTime(remaining) });
  }, [remaining, snapshot?.status, t]);

  if (!snapshot || snapshot.status === "idle") return null;

  return (
    <Link
      href="/fridge/timer"
      aria-label={t("openTimer", { status: label })}
      className={cn(
        "border-neo-border bg-neo-card text-neo-text fixed right-4 bottom-[calc(var(--nav-height-mobile)+1rem)] z-40 flex min-h-12 items-center gap-2 rounded-full border px-4 py-2 shadow-[var(--shadow-neo-md)]",
        "focus-visible:ring-neo-accent md:right-8 md:bottom-8 md:ring-offset-2",
        snapshot.status === "completed" &&
          "border-fresh-extra/50 bg-fresh-extra/10 text-fresh-extra",
      )}
    >
      {snapshot.status === "completed" ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Timer className="size-4" aria-hidden="true" />
      )}
      <span className="text-sm font-semibold tabular-nums">{label}</span>
    </Link>
  );
}
