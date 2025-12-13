import { z } from "zod";

import { getVisionModel } from "./gemini-client";

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const OPENAI_CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";

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
 * Build a prompt for extracting expiration/laying dates from French egg boxes.
 * The prompt includes a "reference date" so the model can avoid inventing years.
 */
function buildExtractionPrompt(referenceDate: Date): string {
  const day = String(referenceDate.getUTCDate()).padStart(2, "0");
  const month = String(referenceDate.getUTCMonth() + 1).padStart(2, "0");
  const year = referenceDate.getUTCFullYear();

  return `Tu es un assistant spécialisé dans l'extraction d'informations sur les emballages d'œufs français.

Date de référence (date du scan) : ${day}/${month}/${year}.

Important : l'image peut être tournée (verticale/horizontale) ou en biais. Lis le texte même s'il est imprimé verticalement ou sur un sticker.

Analyse cette image d'un emballage d'œufs et extrait les informations suivantes.

## 1. DATE (obligatoire à chercher)
Cherche spécifiquement :
- "A consommer de préférence avant le" suivi d'une date
- "A consommer jusqu'au" suivi d'une date
- "DDM" ou "DCR" suivi d'une date (Date de Consommation Recommandée)
- "Date de durabilité minimale" suivi d'une date
- Une date au format JJ/MM, JJ/MM/AA ou JJ/MM/AAAA
- "Exp" ou "EXP" suivi d'une date
- "Pondu le", "DOP" ou "Date de ponte" (c'est la date de ponte directement)

RÈGLES IMPORTANTES pour la date:
1. En France, la DCR/DDM sur les œufs est généralement la date de ponte + 28 jours
2. Si tu vois "Pondu le", "DOP" ou "Date de ponte", c'est la date de ponte (pas la DDM)
3. NE DÉDUIS PAS l'année si elle n'est pas imprimée sur la boîte : renvoie exactement ce que tu vois (ex: "01/01" ou "DCR 01/01"). Le backend déduira ensuite l'année en fonction de la date de référence du scan.

## 2. QUANTITÉ D'ŒUFS
Cherche le nombre d'œufs sur la boîte :
- Souvent affiché en gros : "6 œufs", "10 œufs", "12 œufs", etc.
- Peut être "6", "10", "12", "18", "24", "30"
- Si tu ne trouves pas, retourne null

## 3. TAILLE/CALIBRE DES ŒUFS
Cherche la taille/calibre :
- "S" ou "Petit" = "S"
- "M" ou "Moyen" = "M"
- "L" ou "Gros" = "L"
- "XL" ou "Très gros" = "XL"
- Parfois indiqué par le poids : 53-63g = M, 63-73g = L, >73g = XL
- Si tu ne trouves pas, retourne null (le système utilisera "M" par défaut)

Pour "rawText" : recopie la/les ligne(s) exactes où tu as trouvé la date, la quantité et le calibre (si disponibles).

Réponds UNIQUEMENT en JSON valide, sans markdown ni backticks :
{
  "found": true,
  "ddm": "01/01",
  "confidence": "high",
  "rawText": "10 œufs - DCR 01/01 - Calibre M",
  "quantity": 10,
  "size": "M"
}

OU si c'est une date de ponte directement :
{
  "found": true,
  "ddm": null,
  "layingDate": "27/11",
  "confidence": "high",
  "rawText": "Pondu le 27/11",
  "quantity": 12,
  "size": "L"
}

Si tu ne trouves pas de date lisible, réponds :
{
  "found": false,
  "ddm": null,
  "confidence": "low",
  "rawText": null,
  "quantity": null,
  "size": null
}

Niveaux de confiance :
- "high" : Date clairement visible et lisible
- "medium" : Date visible mais partiellement floue ou avec doute sur un chiffre
- "low" : Date difficile à lire ou plusieurs dates possibles`;
}

/**
 * Valid egg sizes
 */
const EggSizeSchema = z.enum(["S", "M", "L", "XL"]);
export type EggSizeValue = z.infer<typeof EggSizeSchema>;

function coerceNullableString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function coerceFound(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  if (typeof value === "number") return value !== 0;
  return false;
}

function coerceConfidence(value: unknown): "high" | "medium" | "low" {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "high") return "high";
    if (normalized === "medium") return "medium";
    if (normalized === "low") return "low";
  }
  return "low";
}

export function extractEggQuantityFromText(text: string | null): number | null {
  if (!text) return null;
  const normalized = text.replace(/\s+/g, " ").toLowerCase();

  // Prefer explicit "X œufs" patterns
  const explicitMatch = normalized.match(
    /\b(6|10|12|18|24|30)\s*(?:œufs|oeufs|œuf|oeuf)\b/u,
  );
  if (explicitMatch) {
    return Number.parseInt(explicitMatch[1], 10);
  }

  // "boîte de X", "pack de X", "x X"
  const packagingMatch = normalized.match(
    /\b(?:bo[iî]te|pack|x)\s*(?:de\s*)?(6|10|12|18|24|30)\b/u,
  );
  if (packagingMatch) {
    return Number.parseInt(packagingMatch[1], 10);
  }

  // As a last resort, accept a standalone common quantity
  // Avoid matching date fragments like "27/12" or "2025-12-27".
  const fallbackMatch = normalized.match(
    /(?<![/\-.])\b(6|10|12|18|24|30)\b(?![/\-.])/u,
  );
  if (fallbackMatch) {
    return Number.parseInt(fallbackMatch[1], 10);
  }

  return null;
}

export function extractEggSizeFromText(
  text: string | null,
): EggSizeValue | null {
  if (!text) return null;
  const normalized = text.replace(/\s+/g, " ").toUpperCase();

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

function coerceEggSize(value: unknown): EggSizeValue | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase();
  if (normalized === "S") return "S";
  if (normalized === "M") return "M";
  if (normalized === "L") return "L";
  if (normalized === "XL") return "XL";

  // Sometimes models return words instead of the code
  if (normalized.includes("PETIT")) return "S";
  if (normalized.includes("MOYEN")) return "M";
  if (normalized.includes("GROS")) return "L";
  if (normalized.includes("TRÈS GROS") || normalized.includes("TRES GROS"))
    return "XL";

  return null;
}

function coerceQuantity(value: unknown): number | null {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null;
    const integer = Math.trunc(value);
    return integer > 0 ? integer : null;
  }

  if (typeof value === "string") {
    const match = value.match(/\d{1,3}/);
    if (!match) return null;
    const parsed = Number.parseInt(match[0], 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  return null;
}

function extractDateToken(input: string): string | null {
  const iso = input.match(/\b\d{4}-\d{1,2}-\d{1,2}\b/u)?.[0];
  if (iso) return iso;

  const dmy = input.match(/\b\d{1,2}[/\-.]\d{1,2}(?:[/\-.]\d{2,4})?\b/u)?.[0];
  if (dmy) return dmy;

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
  const str = coerceNullableString(value);
  if (!str) return null;

  const token =
    extractDateToken(str) ?? extractDateToken(str.replace(/\s+/g, " "));
  if (!token) return str;

  return token;
}

/**
 * Extended schema that also handles laying date, quantity and size
 */
const ExtendedExtractionResultSchema = z
  .object({
    found: z.preprocess(coerceFound, z.boolean()),
    ddm: z.preprocess(coerceDateString, z.string().nullable()),
    layingDate: z.preprocess(coerceDateString, z.string().nullable()),
    confidence: z.preprocess(
      coerceConfidence,
      z.enum(["high", "medium", "low"]),
    ),
    rawText: z.preprocess(coerceNullableString, z.string().nullable()),
    quantity: z.preprocess(coerceQuantity, z.number().int().nullable()),
    size: z.preprocess(coerceEggSize, EggSizeSchema.nullable()),
  })
  .passthrough();

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
  referenceDate: Date = new Date(),
): Promise<ExtendedExtractionResult> {
  try {
    const provider = (process.env.VISION_PROVIDER ?? "gemini").toLowerCase();
    if (provider === "openai") {
      try {
        return await extractDateFromImageWithOpenAI(
          base64Image,
          mimeType,
          referenceDate,
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("[Vision] OpenAI failed, falling back to Gemini:", error);
      }
    }

    const model = getVisionModel();

    const result = await model.generateContent([
      buildExtractionPrompt(referenceDate),
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

    const extractedJson = extractFirstJsonObject(text);
    if (!extractedJson) {
      // eslint-disable-next-line no-console
      console.log("[Vision] No JSON found in response");
      return {
        found: false,
        ddm: null,
        layingDate: null,
        confidence: "low",
        rawText: text,
        quantity: extractEggQuantityFromText(text),
        size: extractEggSizeFromText(text),
      };
    }

    try {
      const parsed = JSON.parse(extractedJson);
      // eslint-disable-next-line no-console
      console.log("[Vision] Parsed result:", JSON.stringify(parsed));
      const normalized = ExtendedExtractionResultSchema.parse(parsed);

      const combinedText = [normalized.rawText, text]
        .filter(Boolean)
        .join("\n");

      const quantity =
        normalized.quantity ?? extractEggQuantityFromText(combinedText);
      const size = normalized.size ?? extractEggSizeFromText(combinedText);

      const hasDate = Boolean(normalized.ddm ?? normalized.layingDate);

      return {
        ...normalized,
        found: normalized.found || hasDate,
        rawText: normalized.rawText ?? text,
        quantity,
        size,
      };
    } catch (parseError) {
      // eslint-disable-next-line no-console
      console.log("[Vision] JSON parse error:", parseError);
      return {
        found: false,
        ddm: null,
        layingDate: null,
        confidence: "low",
        rawText: text,
        quantity: extractEggQuantityFromText(text),
        size: extractEggSizeFromText(text),
      };
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[Vision] Gemini API error:", error);
    return {
      found: false,
      ddm: null,
      layingDate: null,
      confidence: "low",
      rawText: error instanceof Error ? error.message : "Unknown error",
      quantity: null,
      size: null,
    };
  }
}

async function extractDateFromImageWithOpenAI(
  base64Image: string,
  mimeType: "image/jpeg" | "image/png" | "image/webp",
  referenceDate: Date,
): Promise<ExtendedExtractionResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const model = process.env.OPENAI_VISION_MODEL ?? "gpt-4o-mini";
  const prompt = buildExtractionPrompt(referenceDate);
  const dataUrl = `data:${mimeType};base64,${base64Image}`;

  const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
    }),
  });

  const rawText = await response.text();
  if (!response.ok) {
    throw new Error(
      `OpenAI API error (${response.status}): ${rawText.slice(0, 400)}`,
    );
  }

  let content: string | null = null;
  try {
    const json = JSON.parse(rawText) as {
      choices?: { message?: { content?: string | null } }[];
    };
    content = json.choices?.[0]?.message?.content ?? null;
  } catch {
    content = rawText;
  }

  if (!content) {
    return {
      found: false,
      ddm: null,
      layingDate: null,
      confidence: "low",
      rawText: null,
      quantity: null,
      size: null,
    };
  }

  const extractedJson = extractFirstJsonObject(content);
  if (!extractedJson) {
    return {
      found: false,
      ddm: null,
      layingDate: null,
      confidence: "low",
      rawText: content,
      quantity: extractEggQuantityFromText(content),
      size: extractEggSizeFromText(content),
    };
  }

  try {
    const parsed = JSON.parse(extractedJson);
    const normalized = ExtendedExtractionResultSchema.parse(parsed);

    const combinedText = [normalized.rawText, content].filter(Boolean).join("\n");
    const quantity = normalized.quantity ?? extractEggQuantityFromText(combinedText);
    const size = normalized.size ?? extractEggSizeFromText(combinedText);
    const hasDate = Boolean(normalized.ddm ?? normalized.layingDate);

    return {
      ...normalized,
      found: normalized.found || hasDate,
      rawText: normalized.rawText ?? content,
      quantity,
      size,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("[Vision] OpenAI parse error:", error);
    return {
      found: false,
      ddm: null,
      layingDate: null,
      confidence: "low",
      rawText: content,
      quantity: extractEggQuantityFromText(content),
      size: extractEggSizeFromText(content),
    };
  }
}

function extractFirstJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escapeNext = false;
  let objectStart = -1;

  for (let i = start; i < text.length; i++) {
    const char = text[i];

    if (inString) {
      if (escapeNext) {
        escapeNext = false;
        continue;
      }

      if (char === "\\") {
        escapeNext = true;
        continue;
      }

      if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      if (depth === 0) objectStart = i;
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0 && objectStart !== -1) {
        return text.slice(objectStart, i + 1);
      }
    }
  }

  return null;
}

/**
 * Type of date being parsed - affects year inference logic
 * - 'dcr': Date de Consommation Recommandée (expiration) - typically in near future
 * - 'laying': Date de ponte - typically in recent past
 */
export type DateType = "dcr" | "laying";

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
  const currentYear = referenceDate.getUTCFullYear();

  // Calculate candidate dates for 3 years
  const candidates = [
    { year: currentYear - 1, ts: Date.UTC(currentYear - 1, month - 1, day) },
    { year: currentYear, ts: Date.UTC(currentYear, month - 1, day) },
    { year: currentYear + 1, ts: Date.UTC(currentYear + 1, month - 1, day) },
  ];

  // Calculate days difference from reference date
  const refTime = getUtcDayTimestamp(referenceDate);

  const candidatesWithDiff = candidates.map((c) => ({
    ...c,
    diffDays: Math.round((c.ts - refTime) / MS_PER_DAY),
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
  const candidateTs = Date.UTC(year, month - 1, day);
  const diffDays = Math.round(
    (candidateTs - getUtcDayTimestamp(referenceDate)) / MS_PER_DAY,
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
  const cleaned = coerceDateString(dateStr) ?? dateStr.trim();

  // Try JJ/MM/AAAA, JJ-MM-AAAA, JJ.MM.AAAA (4-digit year)
  const fullYearMatch = cleaned.match(
    /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/,
  );
  if (fullYearMatch) {
    const [, day, month, year] = fullYearMatch;
    const dayNum = Number(day);
    const monthNum = Number(month);
    const yearNum = Number(year);
    if (!isValidDateParts(yearNum, monthNum, dayNum)) return null;

    // Validate and potentially correct the year
    const correctedYear = validateAndCorrectYear(
      dayNum,
      monthNum,
      yearNum,
      dateType,
      referenceDate,
    );
    if (!isValidDateParts(correctedYear, monthNum, dayNum)) return null;

    const date = utcDateFromParts(correctedYear, monthNum, dayNum);
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
    if (!isValidDateParts(baseYear, monthNum, dayNum)) return null;

    // Check if the base year makes sense, otherwise use inference
    const baseTs = Date.UTC(baseYear, monthNum - 1, dayNum);
    const diffDays = Math.round(
      (baseTs - getUtcDayTimestamp(referenceDate)) / MS_PER_DAY,
    );

    // If the date seems reasonable (within ~1 year), use it directly
    if (Math.abs(diffDays) < 365) {
      return new Date(baseTs);
    }

    // Otherwise, infer the year
    const year = inferYearFromContext(
      dayNum,
      monthNum,
      dateType,
      referenceDate,
    );
    if (!isValidDateParts(year, monthNum, dayNum)) return null;
    const date = utcDateFromParts(year, monthNum, dayNum);
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
    if (!isValidDateParts(year, monthNum, dayNum)) return null;
    const date = utcDateFromParts(year, monthNum, dayNum);

    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Try JJMMAAAA (8 digits)
  const compactMatch = cleaned.match(/^(\d{2})(\d{2})(\d{4})$/);
  if (compactMatch) {
    const [, day, month, year] = compactMatch;
    if (!isValidDateParts(Number(year), Number(month), Number(day))) return null;
    const date = utcDateFromParts(Number(year), Number(month), Number(day));
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
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Try AAAA-MM-JJ (ISO format)
  const isoMatch = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    if (!isValidDateParts(Number(year), Number(month), Number(day))) return null;
    const date = utcDateFromParts(Number(year), Number(month), Number(day));
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
}
