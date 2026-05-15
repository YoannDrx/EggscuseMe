import {
  calculateFreshness,
  calculateFreshnessFromDcrDate,
  calculateExpirationProgress,
  formatDaysRemaining,
  formatDaysRemainingFr,
  getDcrDateFromLayingDate,
  getLayingDateFromDcrDate,
  getFreshnessBgClass,
  getFreshnessColorClass,
  getFreshnessDescriptionFr,
  getCookingTypeLabel,
} from "@/features/eggs/lib/freshness-calculator";
import { describe, expect, it } from "vitest";

const REFERENCE_DATE = new Date("2026-05-13T12:00:00.000Z");

// Helper to create a date X days ago
function daysAgo(days: number): Date {
  const date = new Date(REFERENCE_DATE);
  date.setDate(date.getDate() - days);
  return date;
}

function daysFromNow(days: number): Date {
  const date = new Date(REFERENCE_DATE);
  date.setDate(date.getDate() + days);
  return date;
}

describe("freshness-calculator", () => {
  describe("calculateFreshness", () => {
    describe("extra-fresh status (days 0-9)", () => {
      it("should return extra-fresh for eggs laid today", () => {
        const result = calculateFreshness(daysAgo(0), REFERENCE_DATE);

        expect(result.status).toBe("extra-fresh");
        expect(result.daysOld).toBe(0);
        expect(result.daysRemaining).toBe(28);
        expect(result.recommendations).toEqual([
          "SOFT_BOILED",
          "POACHED",
          "RAW",
        ]);
      });

      it("should return extra-fresh for eggs laid 5 days ago", () => {
        const result = calculateFreshness(daysAgo(5), REFERENCE_DATE);

        expect(result.status).toBe("extra-fresh");
        expect(result.daysOld).toBe(5);
        expect(result.daysRemaining).toBe(23);
      });

      it("should return extra-fresh for eggs laid 9 days ago (boundary)", () => {
        const result = calculateFreshness(daysAgo(9), REFERENCE_DATE);

        expect(result.status).toBe("extra-fresh");
        expect(result.daysOld).toBe(9);
        expect(result.daysRemaining).toBe(19);
      });
    });

    describe("fresh status (days 10-21)", () => {
      it("should return fresh for eggs laid 10 days ago", () => {
        const result = calculateFreshness(daysAgo(10), REFERENCE_DATE);

        expect(result.status).toBe("fresh");
        expect(result.daysOld).toBe(10);
        expect(result.recommendations).toEqual([
          "FRIED",
          "SCRAMBLED",
          "OMELETTE",
          "BAKING",
        ]);
      });

      it("should return fresh for eggs laid 15 days ago", () => {
        const result = calculateFreshness(daysAgo(15), REFERENCE_DATE);

        expect(result.status).toBe("fresh");
        expect(result.daysOld).toBe(15);
        expect(result.daysRemaining).toBe(13);
      });

      it("should return fresh for eggs laid 21 days ago (boundary)", () => {
        const result = calculateFreshness(daysAgo(21), REFERENCE_DATE);

        expect(result.status).toBe("fresh");
        expect(result.daysOld).toBe(21);
        expect(result.daysRemaining).toBe(7);
      });
    });

    describe("cook-thoroughly status (days 22-28)", () => {
      it("should return cook-thoroughly for eggs laid 22 days ago", () => {
        const result = calculateFreshness(daysAgo(22), REFERENCE_DATE);

        expect(result.status).toBe("cook-thoroughly");
        expect(result.daysOld).toBe(22);
        expect(result.recommendations).toEqual(["HARD_BOILED"]);
      });

      it("should return cook-thoroughly for eggs laid 25 days ago", () => {
        const result = calculateFreshness(daysAgo(25), REFERENCE_DATE);

        expect(result.status).toBe("cook-thoroughly");
        expect(result.daysOld).toBe(25);
        expect(result.daysRemaining).toBe(3);
      });

      it("should return cook-thoroughly for eggs laid 28 days ago (boundary)", () => {
        const result = calculateFreshness(daysAgo(28), REFERENCE_DATE);

        expect(result.status).toBe("cook-thoroughly");
        expect(result.daysOld).toBe(28);
        expect(result.daysRemaining).toBe(0);
      });
    });

    describe("expired status (days 29+)", () => {
      it("should return expired for eggs laid 29 days ago", () => {
        const result = calculateFreshness(daysAgo(29), REFERENCE_DATE);

        expect(result.status).toBe("expired");
        expect(result.daysOld).toBe(29);
        expect(result.daysRemaining).toBe(0);
        expect(result.recommendations).toEqual([]);
      });

      it("should return expired for eggs laid 60 days ago", () => {
        const result = calculateFreshness(daysAgo(60), REFERENCE_DATE);

        expect(result.status).toBe("expired");
        expect(result.daysOld).toBe(60);
        expect(result.daysRemaining).toBe(0);
      });
    });

    describe("DCR source date", () => {
      it("should calculate days remaining from the DCR date", () => {
        const result = calculateFreshnessFromDcrDate(
          daysFromNow(3),
          REFERENCE_DATE,
        );

        expect(result.status).toBe("cook-thoroughly");
        expect(result.daysRemaining).toBe(3);
        expect(result.daysOld).toBe(25);
      });

      it("should convert between laying date and DCR date", () => {
        const layingDate = daysAgo(0);
        const dcrDate = getDcrDateFromLayingDate(layingDate);

        expect(
          calculateFreshnessFromDcrDate(dcrDate, layingDate).daysRemaining,
        ).toBe(28);
        expect(getLayingDateFromDcrDate(dcrDate).toDateString()).toBe(
          layingDate.toDateString(),
        );
      });
    });
  });

  describe("getFreshnessColorClass", () => {
    it("should return correct class for extra-fresh", () => {
      expect(getFreshnessColorClass("extra-fresh")).toBe(
        "bg-fresh-extra text-fresh-extra-foreground",
      );
    });

    it("should return correct class for fresh", () => {
      expect(getFreshnessColorClass("fresh")).toBe(
        "bg-fresh text-fresh-foreground",
      );
    });

    it("should return correct class for cook-thoroughly", () => {
      expect(getFreshnessColorClass("cook-thoroughly")).toBe(
        "bg-fresh-cook text-fresh-cook-foreground",
      );
    });

    it("should return correct class for expired", () => {
      expect(getFreshnessColorClass("expired")).toBe(
        "bg-expired text-expired-foreground",
      );
    });
  });

  describe("getFreshnessBgClass", () => {
    it("should return background classes for all statuses", () => {
      expect(getFreshnessBgClass("extra-fresh")).toBe("bg-fresh-extra");
      expect(getFreshnessBgClass("fresh")).toBe("bg-fresh");
      expect(getFreshnessBgClass("cook-thoroughly")).toBe("bg-fresh-cook");
      expect(getFreshnessBgClass("expired")).toBe("bg-expired");
    });
  });

  describe("calculateExpirationProgress", () => {
    it("should return 0% for eggs laid today", () => {
      const progress = calculateExpirationProgress(daysAgo(0), REFERENCE_DATE);
      expect(progress).toBeCloseTo(0, 0);
    });

    it("should return ~50% for eggs laid 14 days ago", () => {
      const progress = calculateExpirationProgress(daysAgo(14), REFERENCE_DATE);
      expect(progress).toBeCloseTo(50, 0);
    });

    it("should return 100% for eggs laid 28 days ago", () => {
      const progress = calculateExpirationProgress(daysAgo(28), REFERENCE_DATE);
      expect(progress).toBeCloseTo(100, 0);
    });

    it("should cap at 100% for expired eggs", () => {
      const progress = calculateExpirationProgress(daysAgo(50), REFERENCE_DATE);
      expect(progress).toBe(100);
    });

    it("should not go below 0%", () => {
      // Future date (egg from the future)
      const progress = calculateExpirationProgress(
        daysFromNow(5),
        REFERENCE_DATE,
      );
      expect(progress).toBe(0);
    });
  });

  describe("formatDaysRemaining (English)", () => {
    it("should return 'Expired' for 0 or negative days", () => {
      expect(formatDaysRemaining(0)).toBe("Expired");
      expect(formatDaysRemaining(-5)).toBe("Expired");
    });

    it("should return singular form for 1 day", () => {
      expect(formatDaysRemaining(1)).toBe("1 day left");
    });

    it("should return plural form for multiple days", () => {
      expect(formatDaysRemaining(5)).toBe("5 days left");
      expect(formatDaysRemaining(28)).toBe("28 days left");
    });
  });

  describe("formatDaysRemainingFr (French)", () => {
    it("should return 'Expiré' for 0 or negative days", () => {
      expect(formatDaysRemainingFr(0)).toBe("Expiré");
      expect(formatDaysRemainingFr(-5)).toBe("Expiré");
    });

    it("should return singular form for 1 day", () => {
      expect(formatDaysRemainingFr(1)).toBe("1 jour restant");
    });

    it("should return plural form for multiple days", () => {
      expect(formatDaysRemainingFr(5)).toBe("5 jours restants");
      expect(formatDaysRemainingFr(28)).toBe("28 jours restants");
    });
  });

  describe("getFreshnessDescriptionFr", () => {
    it("should return French descriptions for all statuses", () => {
      expect(getFreshnessDescriptionFr("extra-fresh")).toBe(
        "Parfait pour œufs à la coque, pochés ou crus",
      );
      expect(getFreshnessDescriptionFr("fresh")).toBe(
        "Idéal pour œufs au plat, brouillés ou pâtisserie",
      );
      expect(getFreshnessDescriptionFr("cook-thoroughly")).toBe(
        "Uniquement bien cuits (œufs durs)",
      );
      expect(getFreshnessDescriptionFr("expired")).toBe(
        "Expiré - ne pas consommer",
      );
    });
  });

  describe("getCookingTypeLabel", () => {
    it("should return correct labels for all cooking types", () => {
      expect(getCookingTypeLabel("SOFT_BOILED")).toBe("Soft-boiled");
      expect(getCookingTypeLabel("POACHED")).toBe("Poached");
      expect(getCookingTypeLabel("RAW")).toBe("Raw");
      expect(getCookingTypeLabel("FRIED")).toBe("Fried");
      expect(getCookingTypeLabel("SCRAMBLED")).toBe("Scrambled");
      expect(getCookingTypeLabel("OMELETTE")).toBe("Omelette");
      expect(getCookingTypeLabel("HARD_BOILED")).toBe("Hard-boiled");
      expect(getCookingTypeLabel("BAKING")).toBe("Baking");
      expect(getCookingTypeLabel("OTHER")).toBe("Other");
    });
  });
});
