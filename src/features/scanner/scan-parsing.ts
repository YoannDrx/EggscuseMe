const MS_PER_DAY = 1000 * 60 * 60 * 24;

const OCR_DIGIT_CHAR_MAP: Record<string, string> = {
  O: "0",
  o: "0",
  I: "1",
  l: "1",
  "|": "1",
  Z: "2",
  z: "2",
  S: "5",
  s: "5",
  B: "8",
  b: "8",
  G: "6",
  g: "6",
  q: "9",
};

const COMMON_EGG_QUANTITIES = new Set([6, 10, 12, 18, 24, 30]);

/**
 * Type of date being parsed - affects year inference logic
 * - 'dcr': Date de Consommation Recommandée (expiration) - typically in near future
 * - 'laying': Date de ponte - typically in recent past
 */
export type DateType = "dcr" | "laying";

export type EggSizeValue = "S" | "M" | "L" | "XL";

export function inferDateTypeFromText(rawText: string): DateType {
  const normalized = rawText.toLowerCase();

  // Ponte / laying date keywords
  if (
    /\b(pondu|dop|date\s+de\s+ponte|d\.?\s*o\.?\s*p\.?)\b/gu.test(normalized)
  ) {
    return "laying";
  }

  // Expiration / DCR keywords
  // Some boxes/stickers can be misread by OCR (DCR -> OCR)
  if (
    /\b(dcr|ocr|ddm|dlc|exp|a\s+consommer|consommer)\b/gu.test(normalized)
  ) {
    return "dcr";
  }

  // Default: most egg boxes show DCR/DDM
  return "dcr";
}

function normalizeDateToken(token: string): string {
  // Removes spaces around separators: "01 / 01" -> "01/01"
  const cleaned = token
    .replace(/[|\\]/gu, "/")
    .replace(/\s*([/\-.])\s*/gu, "$1")
    .trim();

  // Fix common OCR confusions for digits in date tokens.
  // Safe here because this only runs on date-like tokens (not the whole text).
  return cleaned.replace(/[OIl|ZzSsBbGgq]/gu, (char) => {
    return OCR_DIGIT_CHAR_MAP[char] ?? char;
  });
}

/**
 * Try to extract the most relevant date token from an OCR text.
 * Prefers dates close to DCR/DDM or "Pondu le" keywords.
 */
export function extractDateCandidateFromText(
  rawText: string,
): { dateText: string; dateType: DateType } | null {
  const normalized = rawText.replace(/\s+/gu, " ");

  // Be tolerant to OCR errors where digits are confused with letters (e.g. "O1/OI").
  const d = "[0-9OIl|ZzSsBbGgq]";
  const dateToken =
    `(${d}{1,2}\\s*[/\\-.|\\\\]\\s*${d}{1,2}(?:\\s*[/\\-.|\\\\]\\s*(?:${d}{2,4}|[A-Za-z]{2,4}))?)`;

  const layingKeyword = new RegExp(
    `\\b(?:pondu(?:\\s+le)?|dop|date\\s+de\\s+ponte)\\b[^\\d]{0,20}${dateToken}`,
    "iu",
  );
  const layingMatch = normalized.match(layingKeyword);
  if (layingMatch?.[1]) {
    return { dateText: normalizeDateToken(layingMatch[1]), dateType: "laying" };
  }

  const dcrKeyword = new RegExp(
    `\\b(?:dcr|ocr|ddm|dlc|exp|a\\s+consommer\\s+(?:de\\s+pr[ée]f[ée]rence\\s+avant\\s+le)?|a\\s+consommer\\s+jusqu['’]?au|consommer\\s+avant)\\b[^\\d]{0,20}${dateToken}`,
    "iu",
  );
  const dcrMatch = normalized.match(dcrKeyword);
  if (dcrMatch?.[1]) {
    return { dateText: normalizeDateToken(dcrMatch[1]), dateType: "dcr" };
  }

  // Generic fallback: first date-looking token
  const genericMatch = normalized.match(new RegExp(dateToken, "iu"));
  if (genericMatch?.[1]) {
    const dateType = inferDateTypeFromText(rawText);
    return { dateText: normalizeDateToken(genericMatch[1]), dateType };
  }

  return null;
}

export function extractEggQuantityFromText(text: string | null): number | null {
  if (!text) return null;
  const normalized = text.replace(/\s+/gu, " ").toLowerCase();

  const parseQuantity = (value: string): number | null => {
    const cleaned = value.replace(/[OIl|ZzSsBbGgq]/gu, (char) => {
      return OCR_DIGIT_CHAR_MAP[char] ?? char;
    });
    const parsed = Number.parseInt(cleaned, 10);
    return COMMON_EGG_QUANTITIES.has(parsed) ? parsed : null;
  };

  // Prefer explicit "X œufs" patterns
  const explicitMatch = normalized.match(
    /\b([0-9oilzsbgq]{1,3})\s*(?:œufs|oeufs|œuf|oeuf)\b/u,
  );
  if (explicitMatch) {
    return parseQuantity(explicitMatch[1]);
  }

  // "boîte de X", "pack de X", "x X"
  const packagingMatch = normalized.match(
    /\b(?:bo[iî]te|pack|x|×)\s*(?:de\s*)?([0-9oilzsbgq]{1,3})\b/u,
  );
  if (packagingMatch) {
    return parseQuantity(packagingMatch[1]);
  }

  // As a last resort, accept a standalone common quantity
  // Avoid matching date fragments like "27/12" or "2025-12-27".
  const fallbackMatch = normalized.match(
    /(?<![/\-.])\b([0-9oilzsbgq]{1,3})\b(?![/\-.])/u,
  );
  if (fallbackMatch) {
    return parseQuantity(fallbackMatch[1]);
  }

  return null;
}

export function extractEggSizeFromText(
  text: string | null,
): EggSizeValue | null {
  if (!text) return null;
  const normalized = text.replace(/\s+/gu, " ").toUpperCase();

  // Direct size tokens
  if (/\bXL\b/u.test(normalized)) return "XL";
  if (/\bL\b/u.test(normalized)) return "L";
  if (/\bM\b/u.test(normalized)) return "M";
  if (/\bS\b/u.test(normalized)) return "S";

  // French words
  if (/\bTR[ÈE]S\s+GROS\b/u.test(normalized)) return "XL";
  if (/\bGROS\b/u.test(normalized)) return "L";
  if (/\bMOYEN\b/u.test(normalized)) return "M";
  if (/\bPETIT\b/u.test(normalized)) return "S";

  // Weight ranges (e.g., 53-63g)
  const rangeMatch = normalized.match(/\b(\d{2})\s*-\s*(\d{2})\s*G\b/u);
  if (rangeMatch) {
    const min = Number.parseInt(rangeMatch[1], 10);
    const max = Number.parseInt(rangeMatch[2], 10);
    if (min >= 73 || max > 73) return "XL";
    if (min >= 63) return "L";
    if (min >= 53) return "M";
    return "S";
  }

  return null;
}

function extractDateToken(input: string): string | null {
  const iso = input.match(/\b\d{4}-\d{1,2}-\d{1,2}\b/u)?.[0];
  if (iso) return iso;

  const dmy =
    input.match(/\b[0-9OIl|ZzSsBbGgq]{1,2}[/\-.|\\][0-9OIl|ZzSsBbGgq]{1,2}(?:[/\-.|\\][0-9OIl|ZzSsBbGgq]{2,4})?\b/u)?.[0] ??
    input.match(/\b[0-9OIl|ZzSsBbGgq]{1,2}\s*[/\-.|\\]\s*[0-9OIl|ZzSsBbGgq]{1,2}(?:\s*[/\-.|\\]\s*[0-9OIl|ZzSsBbGgq]{2,4})?\b/u)?.[0];
  if (dmy) return normalizeDateToken(dmy);

  // Handles "01/01/AAAA" or similar placeholders by keeping only DD/MM.
  const placeholder = input.match(
    /\b(\d{1,2})[/\-.](\d{1,2})[/\-.][A-Za-z]{2,4}\b/u,
  );
  if (placeholder) {
    return `${placeholder[1]}/${placeholder[2]}`;
  }

  return null;
}

function coerceDateString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;

  const token =
    extractDateToken(trimmed) ??
    extractDateToken(trimmed.replace(/\s+/gu, " "));
  if (!token) return trimmed;

  return token;
}

function getUtcDayTimestamp(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function utcDateFromParts(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

function isValidDateParts(year: number, month: number, day: number): boolean {
  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
    return false;
  }

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const date = utcDateFromParts(year, month, day);
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * Infer the most likely year for a date without year based on context.
 */
function inferYearFromContext(
  day: number,
  month: number,
  dateType: DateType,
  referenceDate: Date = new Date(),
): number {
  const currentYear = referenceDate.getUTCFullYear();

  const candidates = [
    { year: currentYear - 1, ts: Date.UTC(currentYear - 1, month - 1, day) },
    { year: currentYear, ts: Date.UTC(currentYear, month - 1, day) },
    { year: currentYear + 1, ts: Date.UTC(currentYear + 1, month - 1, day) },
  ];

  const refTime = getUtcDayTimestamp(referenceDate);

  const candidatesWithDiff = candidates.map((c) => ({
    ...c,
    diffDays: Math.round((c.ts - refTime) / MS_PER_DAY),
  }));

  if (dateType === "dcr") {
    // DCR: Date should be in near future or very recent past
    // Ideal window: -7 days (slightly expired) to +45 days (fresh eggs)
    // Target: around +15 days (typical fresh egg)
    const scored = candidatesWithDiff.map((c) => {
      let score: number;
      if (c.diffDays >= -7 && c.diffDays <= 45) {
        score = Math.abs(c.diffDays - 15);
      } else if (c.diffDays < -7) {
        score = 1000 + Math.abs(c.diffDays);
      } else {
        score = 500 + Math.abs(c.diffDays - 45);
      }
      return { ...c, score };
    });

    scored.sort((a, b) => a.score - b.score);
    return scored[0].year;
  }

  // Laying date: Date should be in recent past
  // Ideal window: -45 days to +3 days (allowing for eggs laid "today")
  // Target: around -14 days (typical egg age)
  const scored = candidatesWithDiff.map((c) => {
    let score: number;
    if (c.diffDays >= -45 && c.diffDays <= 3) {
      score = Math.abs(c.diffDays - -14);
    } else if (c.diffDays > 3) {
      score = 1000 + Math.abs(c.diffDays);
    } else {
      score = 500 + Math.abs(c.diffDays + 45);
    }
    return { ...c, score };
  });

  scored.sort((a, b) => a.score - b.score);
  return scored[0].year;
}

function validateAndCorrectYear(
  day: number,
  month: number,
  year: number,
  dateType: DateType,
  referenceDate: Date,
): number {
  const candidateTs = Date.UTC(year, month - 1, day);
  const diffDays = Math.round(
    (candidateTs - getUtcDayTimestamp(referenceDate)) / MS_PER_DAY,
  );

  if (dateType === "dcr") {
    if (diffDays < -30 || diffDays > 90) {
      return inferYearFromContext(day, month, dateType, referenceDate);
    }
  } else {
    if (diffDays < -60 || diffDays > 10) {
      return inferYearFromContext(day, month, dateType, referenceDate);
    }
  }

  return year;
}

/**
 * Parse a date string in various French formats.
 * Supports: JJ/MM/AAAA, JJ-MM-AAAA, JJ.MM.AAAA, JJMMAAAA, JJ/MM/AA, JJ/MM
 */
export function parseFrenchDate(
  dateStr: string,
  dateType: DateType = "dcr",
  referenceDate: Date = new Date(),
): Date | null {
  const cleaned = coerceDateString(dateStr) ?? dateStr.trim();

  const fullYearMatch = cleaned.match(
    /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/,
  );
  if (fullYearMatch) {
    const [, day, month, year] = fullYearMatch;
    const dayNum = Number(day);
    const monthNum = Number(month);
    const yearNum = Number(year);
    if (!isValidDateParts(yearNum, monthNum, dayNum)) return null;

    const correctedYear = validateAndCorrectYear(
      dayNum,
      monthNum,
      yearNum,
      dateType,
      referenceDate,
    );
    if (!isValidDateParts(correctedYear, monthNum, dayNum)) return null;

    const date = utcDateFromParts(correctedYear, monthNum, dayNum);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  const shortYearMatch = cleaned.match(
    /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2})$/,
  );
  if (shortYearMatch) {
    const [, day, month, yearShort] = shortYearMatch;
    const dayNum = Number(day);
    const monthNum = Number(month);
    const baseYear = 2000 + Number(yearShort);
    if (!isValidDateParts(baseYear, monthNum, dayNum)) return null;

    const baseTs = Date.UTC(baseYear, monthNum - 1, dayNum);
    const diffDays = Math.round(
      (baseTs - getUtcDayTimestamp(referenceDate)) / MS_PER_DAY,
    );

    if (Math.abs(diffDays) < 365) {
      return new Date(baseTs);
    }

    const year = inferYearFromContext(
      dayNum,
      monthNum,
      dateType,
      referenceDate,
    );
    if (!isValidDateParts(year, monthNum, dayNum)) return null;
    const date = utcDateFromParts(year, monthNum, dayNum);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  const noYearMatch = cleaned.match(/^(\d{1,2})[/\-.](\d{1,2})$/);
  if (noYearMatch) {
    const [, day, month] = noYearMatch;
    const dayNum = Number(day);
    const monthNum = Number(month);

    const year = inferYearFromContext(
      dayNum,
      monthNum,
      dateType,
      referenceDate,
    );
    if (!isValidDateParts(year, monthNum, dayNum)) return null;
    const date = utcDateFromParts(year, monthNum, dayNum);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  const compactMatch = cleaned.match(/^(\d{2})(\d{2})(\d{4})$/);
  if (compactMatch) {
    const [, day, month, year] = compactMatch;
    if (!isValidDateParts(Number(year), Number(month), Number(day))) return null;
    const date = utcDateFromParts(Number(year), Number(month), Number(day));
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  const compactShortMatch = cleaned.match(/^(\d{2})(\d{2})(\d{2})$/);
  if (compactShortMatch) {
    const [, day, month, yearShort] = compactShortMatch;
    const dayNum = Number(day);
    const monthNum = Number(month);
    const baseYear = 2000 + Number(yearShort);
    if (!isValidDateParts(baseYear, monthNum, dayNum)) return null;

    const baseTs = Date.UTC(baseYear, monthNum - 1, dayNum);
    const diffDays = Math.round(
      (baseTs - getUtcDayTimestamp(referenceDate)) / MS_PER_DAY,
    );

    if (Math.abs(diffDays) < 365) {
      return new Date(baseTs);
    }

    const year = inferYearFromContext(
      dayNum,
      monthNum,
      dateType,
      referenceDate,
    );
    if (!isValidDateParts(year, monthNum, dayNum)) return null;
    const date = utcDateFromParts(year, monthNum, dayNum);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  const isoMatch = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    if (!isValidDateParts(Number(year), Number(month), Number(day))) return null;
    const date = utcDateFromParts(Number(year), Number(month), Number(day));
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
}
