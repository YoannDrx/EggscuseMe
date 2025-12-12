import { describe, expect, it } from "vitest";

import {
  extractEggQuantityFromText,
  parseFrenchDate,
} from "@/lib/ai/extract-date-from-image";
import { calculateLayingDateFromDCR } from "@/features/scanner/lot-code-parser";

function isoDate(date: Date | null): string | null {
  return date ? date.toISOString().split("T")[0] : null;
}

describe("vision-scan parsing", () => {
  describe("date inference (DCR)", () => {
    it("keeps current year for 27/12 when scanning in December 2025", () => {
      const reference = new Date("2025-12-12T12:00:00+01:00");
      const parsed = parseFrenchDate("27/12", "dcr", reference);

      expect(isoDate(parsed)).toBe("2025-12-27");
    });

    it("infers next year for 01/01 when scanning in December 2025", () => {
      const reference = new Date("2025-12-12T12:00:00+01:00");
      const parsed = parseFrenchDate("01/01", "dcr", reference);

      expect(isoDate(parsed)).toBe("2026-01-01");
    });

    it("corrects an incorrect year provided by the model", () => {
      const reference = new Date("2025-12-12T12:00:00+01:00");
      const parsed = parseFrenchDate("01/01/2025", "dcr", reference);

      expect(isoDate(parsed)).toBe("2026-01-01");
    });

    it("parses embedded date tokens (e.g. 'DCR 01/01')", () => {
      const reference = new Date("2025-12-12T12:00:00+01:00");
      const parsed = parseFrenchDate("DCR 01/01", "dcr", reference);

      expect(isoDate(parsed)).toBe("2026-01-01");
    });

    it("handles placeholder years like '01/01/AAAA'", () => {
      const reference = new Date("2025-12-12T12:00:00+01:00");
      const parsed = parseFrenchDate("01/01/AAAA", "dcr", reference);

      expect(isoDate(parsed)).toBe("2026-01-01");
    });
  });

  describe("laying date calculation from DCR", () => {
    it("subtracts 28 days safely in UTC", () => {
      const dcr = new Date(Date.UTC(2026, 0, 1)); // 2026-01-01
      const laying = calculateLayingDateFromDCR(dcr);

      expect(isoDate(laying)).toBe("2025-12-04");
    });
  });

  describe("quantity extraction", () => {
    it("extracts quantities from common French labels", () => {
      expect(extractEggQuantityFromText("10 œufs Bio")).toBe(10);
      expect(extractEggQuantityFromText("Boîte de 6 OEUFS")).toBe(6);
      expect(extractEggQuantityFromText("x12 oeufs plein air")).toBe(12);
    });

    it("does not confuse dates with quantities", () => {
      expect(extractEggQuantityFromText("DCR 01/01")).toBeNull();
      expect(extractEggQuantityFromText("DCR 27/12")).toBeNull();
    });
  });
});

