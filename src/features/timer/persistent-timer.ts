import type { EggSize } from "@/generated/prisma";
import type { EggTemperature, YolkPreference } from "./cooking-times";

export const TIMER_STORAGE_KEY = "eggscuseme:cooking-timer:v1";
export const TIMER_UPDATED_EVENT = "eggscuseme:timer-updated";

export type PersistentTimerStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

export type PersistentTimerSnapshot = {
  version: 1;
  status: PersistentTimerStatus;
  targetAt: number | null;
  remainingSeconds: number;
  totalSeconds: number;
  size: EggSize;
  temperature: EggTemperature;
  yolkPreference: YolkPreference;
};

const eggSizes = new Set<EggSize>(["S", "M", "L", "XL"]);
const temperatures = new Set<EggTemperature>(["fridge", "room"]);
const yolkPreferences = new Set<YolkPreference>([
  "runny",
  "soft",
  "medium",
  "hard",
]);
const statuses = new Set<PersistentTimerStatus>([
  "idle",
  "running",
  "paused",
  "completed",
]);

export function parsePersistentTimerSnapshot(
  serialized: string | null,
): PersistentTimerSnapshot | null {
  if (!serialized) return null;

  try {
    const value = JSON.parse(serialized) as Partial<PersistentTimerSnapshot>;
    if (
      value.version !== 1 ||
      !value.status ||
      !statuses.has(value.status) ||
      !value.size ||
      !eggSizes.has(value.size) ||
      !value.temperature ||
      !temperatures.has(value.temperature) ||
      !value.yolkPreference ||
      !yolkPreferences.has(value.yolkPreference) ||
      typeof value.remainingSeconds !== "number" ||
      !Number.isFinite(value.remainingSeconds) ||
      value.remainingSeconds < 0 ||
      typeof value.totalSeconds !== "number" ||
      !Number.isFinite(value.totalSeconds) ||
      value.totalSeconds <= 0 ||
      (value.targetAt !== null &&
        (typeof value.targetAt !== "number" ||
          !Number.isFinite(value.targetAt)))
    ) {
      return null;
    }

    return value as PersistentTimerSnapshot;
  } catch {
    return null;
  }
}

export function getPersistentTimerRemaining(
  snapshot: PersistentTimerSnapshot,
  now = Date.now(),
): number {
  if (snapshot.status !== "running" || snapshot.targetAt === null) {
    return Math.max(0, Math.ceil(snapshot.remainingSeconds));
  }

  return Math.max(0, Math.ceil((snapshot.targetAt - now) / 1000));
}

export function readPersistentTimer(): PersistentTimerSnapshot | null {
  if (typeof window === "undefined") return null;
  return parsePersistentTimerSnapshot(localStorage.getItem(TIMER_STORAGE_KEY));
}

export function writePersistentTimer(
  snapshot: PersistentTimerSnapshot,
): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(snapshot));
  window.dispatchEvent(
    new CustomEvent<PersistentTimerSnapshot>(TIMER_UPDATED_EVENT, {
      detail: snapshot,
    }),
  );
}
