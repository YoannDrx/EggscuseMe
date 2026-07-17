import {
  EggDateScanOutputSchema,
  extractEggDateScanOutputFromText,
  getEggDateScanPrompt,
  isValidIsoDate,
  ScanTimeoutError,
  selectScanProviders,
  withScanTimeout,
} from "@/features/scan/egg-date-scan";
import { describe, expect, it } from "vitest";

describe("egg-date-scan", () => {
  describe("isValidIsoDate", () => {
    it("accepts valid ISO calendar dates", () => {
      expect(isValidIsoDate("2026-06-12")).toBe(true);
    });

    it("rejects impossible calendar dates", () => {
      expect(isValidIsoDate("2026-02-31")).toBe(false);
    });

    it("rejects non-ISO date formats", () => {
      expect(isValidIsoDate("12/06/2026")).toBe(false);
    });
  });

  describe("extractEggDateScanOutputFromText", () => {
    it("extracts structured JSON output", () => {
      expect(
        extractEggDateScanOutputFromText(
          '{"date":"2026-06-12","confidence":0.91,"sourceLabel":"DCR"}',
        ),
      ).toEqual({
        date: "2026-06-12",
        confidence: 0.91,
        sourceLabel: "DCR",
      });
    });

    it("falls back to an ISO date in plain text", () => {
      expect(
        extractEggDateScanOutputFromText("The best-before date is 2026-06-12."),
      ).toEqual({
        date: "2026-06-12",
        confidence: null,
        sourceLabel: null,
      });
    });

    it("returns null values when no date is readable", () => {
      expect(extractEggDateScanOutputFromText('{"date":null}')).toEqual({
        date: null,
        confidence: null,
        sourceLabel: null,
      });
    });
  });

  describe("selectScanProviders", () => {
    it("uses OpenAI first in auto mode", () => {
      expect(
        selectScanProviders({
          configuredProvider: "auto",
          hasGoogleKey: true,
          hasOpenAiKey: true,
        }),
      ).toEqual(["openai", "google"]);
    });

    it("honors an explicit OpenAI provider", () => {
      expect(
        selectScanProviders({
          configuredProvider: "openai",
          hasGoogleKey: true,
          hasOpenAiKey: true,
        }),
      ).toEqual(["openai"]);
    });

    it("returns no providers when the configured provider has no key", () => {
      expect(
        selectScanProviders({
          configuredProvider: "google",
          hasGoogleKey: false,
          hasOpenAiKey: true,
        }),
      ).toEqual([]);
    });
  });

  it("keeps the model output schema strict and nullable", () => {
    expect(
      EggDateScanOutputSchema.parse({
        date: null,
        confidence: null,
        sourceLabel: null,
      }),
    ).toEqual({
      date: null,
      confidence: null,
      sourceLabel: null,
    });
  });

  it("prompts the provider to prioritize DCR-like labels", () => {
    const prompt = getEggDateScanPrompt("2026-05-15");

    expect(prompt).toContain("DCR");
    expect(prompt).toContain("best-before");
    expect(prompt).toContain("Ignore laying dates");
  });

  describe("withScanTimeout", () => {
    it("returns a provider result before the deadline", async () => {
      await expect(
        withScanTimeout(Promise.resolve("2026-06-12"), 50, "test provider"),
      ).resolves.toBe("2026-06-12");
    });

    it("rejects a provider that exceeds its deadline", async () => {
      await expect(
        withScanTimeout(
          new Promise(() => undefined),
          5,
          "test provider",
        ),
      ).rejects.toBeInstanceOf(ScanTimeoutError);
    });
  });
});
