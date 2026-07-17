import {
  getPersistentTimerRemaining,
  parsePersistentTimerSnapshot,
  type PersistentTimerSnapshot,
} from "@/features/timer/persistent-timer";
import { describe, expect, it } from "vitest";

const snapshot: PersistentTimerSnapshot = {
  version: 1,
  status: "running",
  targetAt: 20_000,
  remainingSeconds: 10,
  totalSeconds: 300,
  size: "M",
  temperature: "fridge",
  yolkPreference: "soft",
};

describe("persistent cooking timer", () => {
  it("recalculates a running timer from its absolute deadline", () => {
    expect(getPersistentTimerRemaining(snapshot, 15_200)).toBe(5);
    expect(getPersistentTimerRemaining(snapshot, 21_000)).toBe(0);
  });

  it("keeps the stored remaining time while paused", () => {
    expect(
      getPersistentTimerRemaining(
        { ...snapshot, status: "paused", targetAt: null },
        100_000,
      ),
    ).toBe(10);
  });

  it("rejects corrupted or obsolete snapshots", () => {
    expect(parsePersistentTimerSnapshot("not-json")).toBeNull();
    expect(
      parsePersistentTimerSnapshot(JSON.stringify({ ...snapshot, version: 2 })),
    ).toBeNull();
    expect(
      parsePersistentTimerSnapshot(
        JSON.stringify({ ...snapshot, remainingSeconds: -1 }),
      ),
    ).toBeNull();
  });

  it("restores a valid snapshot", () => {
    expect(parsePersistentTimerSnapshot(JSON.stringify(snapshot))).toEqual(
      snapshot,
    );
  });
});
