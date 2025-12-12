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
 * Prompt optimized for extracting expiration dates from French egg boxes
 */
const EXTRACTION_PROMPT = `Tu es un assistant spécialisé dans l'extraction de dates sur les emballages alimentaires français.

Analyse cette image d'un emballage d'œufs et extrait la date imprimée.

Cherche spécifiquement :
- "A consommer de préférence avant le" suivi d'une date
- "A consommer jusqu'au" suivi d'une date
- "DDM" ou "DCR" suivi d'une date
- "Date de durabilité minimale" suivi d'une date
- Une date au format JJ/MM/AAAA, JJ-MM-AAAA, JJ.MM.AAAA ou JJMMAAAA
- "Exp" ou "EXP" suivi d'une date
- "Pond le" ou "Date de ponte" (si visible, c'est la date de ponte directement)

IMPORTANT:
- En France, la date sur les boîtes d'œufs est généralement la DDM (Date de Durabilité Minimale), qui correspond à la date de ponte + 28 jours.
- Si tu vois "Pondu le" ou "Date de ponte", c'est la date de ponte directement (pas la DDM).

Réponds UNIQUEMENT en JSON valide, sans markdown ni backticks :
{
  "found": true,
  "ddm": "JJ/MM/AAAA",
  "confidence": "high",
  "rawText": "texte extrait brut de la zone de date"
}

OU si c'est une date de ponte directement :
{
  "found": true,
  "ddm": null,
  "layingDate": "JJ/MM/AAAA",
  "confidence": "high",
  "rawText": "Pondu le JJ/MM/AAAA"
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

  // Extract JSON from the response (handle potential markdown wrapping)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      found: false,
      ddm: null,
      confidence: "low",
      rawText: null,
    };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return ExtendedExtractionResultSchema.parse(parsed);
  } catch {
    return {
      found: false,
      ddm: null,
      confidence: "low",
      rawText: text,
    };
  }
}

/**
 * Parse a date string in various French formats
 * Supports: JJ/MM/AAAA, JJ-MM-AAAA, JJ.MM.AAAA, JJMMAAAA
 */
export function parseFrenchDate(dateStr: string): Date | null {
  // Clean up the string
  const cleaned = dateStr.trim();

  // Try JJ/MM/AAAA, JJ-MM-AAAA, JJ.MM.AAAA
  const separatorMatch = cleaned.match(
    /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/,
  );
  if (separatorMatch) {
    const [, day, month, year] = separatorMatch;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
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
