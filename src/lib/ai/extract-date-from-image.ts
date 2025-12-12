import { z } from "zod";

import { getVisionModel } from "./gemini-client";

/**
 * Schema for the AI extraction result
 */
export const VisionExtractionResultSchema = z.object({
  found: z.boolean(),
  ddm: z.string().nullable(),
  confidence: z.enum(["high", "medium", "low"]),
  rawText: z.string().nullable(),
});

export type VisionExtractionResult = z.infer<
  typeof VisionExtractionResultSchema
>;

/**
 * Get current year for prompt context
 */
function getCurrentYearContext(): string {
  const now = new Date();
  return `Nous sommes en ${now.getFullYear()}.`;
}

/**
 * Prompt optimized for extracting expiration dates from French egg boxes
 */
const EXTRACTION_PROMPT = `Tu es un assistant spécialisé dans l'extraction de dates sur les emballages alimentaires français.

${getCurrentYearContext()}

Analyse cette image d'un emballage d'œufs et extrait la date imprimée.

Cherche spécifiquement :
- "A consommer de préférence avant le" suivi d'une date
- "A consommer jusqu'au" suivi d'une date
- "DDM" ou "DCR" suivi d'une date (Date de Consommation Recommandée)
- "Date de durabilité minimale" suivi d'une date
- Une date au format JJ/MM, JJ/MM/AA ou JJ/MM/AAAA
- "Exp" ou "EXP" suivi d'une date
- "Pondu le", "DOP" ou "Date de ponte" (c'est la date de ponte directement)

RÈGLES IMPORTANTES:
1. En France, la DCR/DDM sur les œufs est généralement la date de ponte + 28 jours
2. Si tu vois "Pondu le", "DOP" ou "Date de ponte", c'est la date de ponte (pas la DDM)
3. Si l'année n'est pas visible (ex: "01/01" ou "DCR 27/12"), déduis l'année logiquement :
   - Pour une DDM/DCR : c'est probablement dans les prochaines semaines, donc année courante ou suivante
   - Pour une date de ponte : c'est dans le passé récent, donc année courante ou précédente

IMPORTANT: Retourne TOUJOURS une date complète avec l'année (ex: "01/01/2025", pas "01/01/AAAA").

Réponds UNIQUEMENT en JSON valide, sans markdown ni backticks :
{
  "found": true,
  "ddm": "01/01/2025",
  "confidence": "high",
  "rawText": "DCR 01/01"
}

OU si c'est une date de ponte directement :
{
  "found": true,
  "ddm": null,
  "layingDate": "27/11/2024",
  "confidence": "high",
  "rawText": "Pondu le 27/11"
}

Si tu ne trouves pas de date lisible, réponds :
{
  "found": false,
  "ddm": null,
  "confidence": "low",
  "rawText": null
}

Niveaux de confiance :
- "high" : Date clairement visible et lisible
- "medium" : Date visible mais partiellement floue ou avec doute sur un chiffre
- "low" : Date difficile à lire ou plusieurs dates possibles`;

/**
 * Extended schema that also handles laying date
 */
const ExtendedExtractionResultSchema = z.object({
  found: z.boolean(),
  ddm: z.string().nullable().optional(),
  layingDate: z.string().nullable().optional(),
  confidence: z.enum(["high", "medium", "low"]),
  rawText: z.string().nullable(),
});

export type ExtendedExtractionResult = z.infer<
  typeof ExtendedExtractionResultSchema
>;

/**
 * Extract expiration date (DDM) from an image of an egg box
 *
 * @param base64Image - Base64 encoded image (without data: prefix)
 * @param mimeType - Image MIME type
 * @returns Extraction result with DDM date or laying date
 */
export async function extractDateFromImage(
  base64Image: string,
  mimeType: "image/jpeg" | "image/png" | "image/webp",
): Promise<ExtendedExtractionResult> {
  try {
    const model = getVisionModel();

    const result = await model.generateContent([
      EXTRACTION_PROMPT,
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
    ]);

    const text = result.response.text();

    // eslint-disable-next-line no-console
    console.log("[Vision] Raw Gemini response:", text.substring(0, 500));

    // Extract JSON from the response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // eslint-disable-next-line no-console
      console.log("[Vision] No JSON found in response");
      return {
        found: false,
        ddm: null,
        confidence: "low",
        rawText: text,
      };
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);
      // eslint-disable-next-line no-console
      console.log("[Vision] Parsed result:", JSON.stringify(parsed));
      return ExtendedExtractionResultSchema.parse(parsed);
    } catch (parseError) {
      // eslint-disable-next-line no-console
      console.log("[Vision] JSON parse error:", parseError);
      return {
        found: false,
        ddm: null,
        confidence: "low",
        rawText: text,
      };
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[Vision] Gemini API error:", error);
    return {
      found: false,
      ddm: null,
      confidence: "low",
      rawText: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Type of date being parsed - affects year inference logic
 * - 'dcr': Date de Consommation Recommandée (expiration) - typically in near future
 * - 'laying': Date de ponte - typically in recent past
 */
export type DateType = "dcr" | "laying";

/**
 * Infer the most likely year for a date without year based on context
 *
 * Logic:
 * - DCR/DDM: Expiration dates are typically 0-45 days in the future (eggs are sold fresh)
 * - Laying date: Ponte dates are typically 0-45 days in the past (eggs were recently laid)
 *
 * @param day - Day of month (1-31)
 * @param month - Month (1-12)
 * @param dateType - Type of date being inferred
 * @param referenceDate - Reference date (defaults to now)
 * @returns The most likely year
 */
function inferYearFromContext(
  day: number,
  month: number,
  dateType: DateType,
  referenceDate: Date = new Date(),
): number {
  const currentYear = referenceDate.getFullYear();

  // Calculate candidate dates for 3 years
  const candidates = [
    { year: currentYear - 1, date: new Date(currentYear - 1, month - 1, day) },
    { year: currentYear, date: new Date(currentYear, month - 1, day) },
    { year: currentYear + 1, date: new Date(currentYear + 1, month - 1, day) },
  ];

  // Calculate days difference from reference date
  const refTime = referenceDate.getTime();
  const msPerDay = 1000 * 60 * 60 * 24;

  const candidatesWithDiff = candidates.map((c) => ({
    ...c,
    diffDays: Math.round((c.date.getTime() - refTime) / msPerDay),
  }));

  if (dateType === "dcr") {
    // DCR: Date should be in near future or very recent past
    // Ideal window: -7 days (slightly expired) to +45 days (fresh eggs)
    // Target: around +15 days (typical fresh egg)

    // Score based on how close to ideal window
    const scored = candidatesWithDiff.map((c) => {
      let score: number;
      if (c.diffDays >= -7 && c.diffDays <= 45) {
        // In ideal window - prefer dates closer to +15 days
        score = Math.abs(c.diffDays - 15);
      } else if (c.diffDays < -7) {
        // Too far in past - heavy penalty
        score = 1000 + Math.abs(c.diffDays);
      } else {
        // Too far in future - moderate penalty
        score = 500 + Math.abs(c.diffDays - 45);
      }
      return { ...c, score };
    });

    scored.sort((a, b) => a.score - b.score);
    return scored[0].year;
  } else {
    // Laying date: Date should be in recent past
    // Ideal window: -45 days to +3 days (allowing for eggs laid "today")
    // Target: around -14 days (typical egg age)

    const scored = candidatesWithDiff.map((c) => {
      let score: number;
      if (c.diffDays >= -45 && c.diffDays <= 3) {
        // In ideal window - prefer dates closer to -14 days
        score = Math.abs(c.diffDays - -14);
      } else if (c.diffDays > 3) {
        // In future - heavy penalty (eggs can't be laid in future)
        score = 1000 + Math.abs(c.diffDays);
      } else {
        // Too far in past - moderate penalty
        score = 500 + Math.abs(c.diffDays + 45);
      }
      return { ...c, score };
    });

    scored.sort((a, b) => a.score - b.score);
    return scored[0].year;
  }
}

/**
 * Validate and potentially correct a year based on date type context
 * This handles cases where Gemini returns an incorrect year
 *
 * @param day - Day of month
 * @param month - Month (1-12)
 * @param year - The year to validate
 * @param dateType - Type of date
 * @param referenceDate - Reference date
 * @returns Corrected year if needed
 */
function validateAndCorrectYear(
  day: number,
  month: number,
  year: number,
  dateType: DateType,
  referenceDate: Date,
): number {
  const candidateDate = new Date(year, month - 1, day);
  const diffDays = Math.round(
    (candidateDate.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (dateType === "dcr") {
    // DCR should be in range -7 to +45 days
    // If it's way out of range, infer the correct year
    if (diffDays < -30 || diffDays > 90) {
      return inferYearFromContext(day, month, dateType, referenceDate);
    }
  } else {
    // Laying date should be in range -45 to +3 days
    if (diffDays < -60 || diffDays > 10) {
      return inferYearFromContext(day, month, dateType, referenceDate);
    }
  }

  return year;
}

/**
 * Parse a date string in various French formats
 * Supports: JJ/MM/AAAA, JJ-MM-AAAA, JJ.MM.AAAA, JJMMAAAA, JJ/MM/AA, JJ/MM
 *
 * @param dateStr - The date string to parse
 * @param dateType - Type of date (affects year inference for dates without year)
 * @param referenceDate - Reference date for year inference (defaults to now)
 */
export function parseFrenchDate(
  dateStr: string,
  dateType: DateType = "dcr",
  referenceDate: Date = new Date(),
): Date | null {
  // Clean up the string
  const cleaned = dateStr.trim();

  // Try JJ/MM/AAAA, JJ-MM-AAAA, JJ.MM.AAAA (4-digit year)
  const fullYearMatch = cleaned.match(
    /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/,
  );
  if (fullYearMatch) {
    const [, day, month, year] = fullYearMatch;
    const dayNum = Number(day);
    const monthNum = Number(month);
    const yearNum = Number(year);

    // Validate and potentially correct the year
    const correctedYear = validateAndCorrectYear(
      dayNum,
      monthNum,
      yearNum,
      dateType,
      referenceDate,
    );

    const date = new Date(correctedYear, monthNum - 1, dayNum);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Try JJ/MM/AA, JJ-MM-AA, JJ.MM.AA (2-digit year)
  const shortYearMatch = cleaned.match(
    /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2})$/,
  );
  if (shortYearMatch) {
    const [, day, month, yearShort] = shortYearMatch;
    // For 2-digit years, use context-aware inference
    const dayNum = Number(day);
    const monthNum = Number(month);
    const baseYear = 2000 + Number(yearShort);

    // Check if the base year makes sense, otherwise use inference
    const baseDate = new Date(baseYear, monthNum - 1, dayNum);
    const diffDays = Math.round(
      (baseDate.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // If the date seems reasonable (within ~1 year), use it directly
    if (Math.abs(diffDays) < 365) {
      return baseDate;
    }

    // Otherwise, infer the year
    const year = inferYearFromContext(
      dayNum,
      monthNum,
      dateType,
      referenceDate,
    );
    const date = new Date(year, monthNum - 1, dayNum);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Try JJ/MM, JJ-MM, JJ.MM (no year - use smart inference)
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
    const date = new Date(year, monthNum - 1, dayNum);

    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Try JJMMAAAA (8 digits)
  const compactMatch = cleaned.match(/^(\d{2})(\d{2})(\d{4})$/);
  if (compactMatch) {
    const [, day, month, year] = compactMatch;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Try JJMMAA (6 digits - 2-digit year)
  const compactShortMatch = cleaned.match(/^(\d{2})(\d{2})(\d{2})$/);
  if (compactShortMatch) {
    const [, day, month, yearShort] = compactShortMatch;
    const dayNum = Number(day);
    const monthNum = Number(month);
    const baseYear = 2000 + Number(yearShort);

    const baseDate = new Date(baseYear, monthNum - 1, dayNum);
    const diffDays = Math.round(
      (baseDate.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (Math.abs(diffDays) < 365) {
      return baseDate;
    }

    const year = inferYearFromContext(
      dayNum,
      monthNum,
      dateType,
      referenceDate,
    );
    const date = new Date(year, monthNum - 1, dayNum);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Try AAAA-MM-JJ (ISO format)
  const isoMatch = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
}
