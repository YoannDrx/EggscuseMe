import { z } from "zod";

import { ZodRouteError } from "@/lib/errors/zod-route-error";
import { prisma } from "@/lib/prisma";
import { authRoute } from "@/lib/zod-route";
import {
  extractDateFromImage,
  parseFrenchDate,
  type DateType,
} from "@/lib/ai/extract-date-from-image";
import { calculateLayingDateFromDCR } from "@/features/scanner/lot-code-parser";

/**
 * Try to extract a date from rawText when the main date field fails to parse
 * This handles cases where Gemini returns "01/01/AAAA" literally
 *
 * @param rawText - The raw text extracted from the image
 * @param dateType - Type of date (dcr or laying) for year inference
 */
function extractDateFromRawText(
  rawText: string | null,
  dateType: DateType,
  referenceDate: Date,
): Date | null {
  if (!rawText) return null;

  const normalizedText = rawText.replace(/[/\-.]\s*[A-Za-z]{2,4}\b/gu, "");

  // Try to find date patterns in the raw text
  // Pattern: DD/MM, DD-MM, DD.MM (with optional year)
  const datePatterns = [
    /(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})/, // DD/MM/YYYY
    /(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2})/, // DD/MM/YY
    /(\d{1,2})[/\-.](\d{1,2})[/\-.]([A-Za-z]{2,4})/, // DD/MM/AAAA (placeholder)
    /(\d{1,2})[/\-.](\d{1,2})(?![/\-.\d])/, // DD/MM (no year)
  ];

  for (const pattern of datePatterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      const dateStr = match[0];
      const parsed = parseFrenchDate(dateStr, dateType, referenceDate);
      if (parsed) return parsed;
    }
  }

  return null;
}

function inferDateTypeFromRawText(rawText: string): DateType {
  const normalized = rawText.toLowerCase();

  // Ponte / laying date keywords
  if (
    /\b(pondu|dop|date\s+de\s+ponte|d\.?\s*o\.?\s*p\.?)\b/gu.test(normalized)
  ) {
    return "laying";
  }

  // Expiration / DCR keywords
  if (
    /\b(dcr|ddm|dlc|exp|a\s+consommer|consommer)\b/gu.test(normalized)
  ) {
    return "dcr";
  }

  // Default: most egg boxes show DCR/DDM
  return "dcr";
}

/**
 * Rate limit: 20 scans per day per user
 */
const DAILY_SCAN_LIMIT = 20;

/**
 * Max image size: 5MB
 */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const RequestSchema = z.object({
  image: z.string().min(100, "Image data is required"),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  clientNowIso: z.string().optional(),
  clientTimezoneOffsetMinutes: z.number().int().optional(),
});

type RequestBody = z.infer<typeof RequestSchema>;

function getReferenceDateFromClient(body: RequestBody): Date {
  const base = body.clientNowIso ? new Date(body.clientNowIso) : new Date();
  const referenceInstant = Number.isFinite(base.getTime()) ? base : new Date();

  const offset = body.clientTimezoneOffsetMinutes;
  if (
    typeof offset === "number" &&
    Number.isFinite(offset) &&
    Math.abs(offset) <= 14 * 60
  ) {
    return new Date(referenceInstant.getTime() - offset * 60 * 1000);
  }

  return referenceInstant;
}

/**
 * Check and increment vision scan usage for rate limiting
 * @returns true if the user is within the limit, false if rate limited
 */
async function checkAndIncrementScanUsage(userId: string): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const usage = await prisma.visionScanUsage.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    update: {
      count: {
        increment: 1,
      },
    },
    create: {
      userId,
      date: today,
      count: 1,
    },
  });

  return usage.count <= DAILY_SCAN_LIMIT;
}

/**
 * Get remaining scans for today
 */
async function getRemainingScanCount(userId: string): Promise<number> {
  const today = new Date().toISOString().split("T")[0];

  const usage = await prisma.visionScanUsage.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  });

  return Math.max(0, DAILY_SCAN_LIMIT - (usage?.count ?? 0));
}

export const POST = authRoute
  .body(RequestSchema)
  .handler(async (_req, { body, ctx }) => {
    const referenceDate = getReferenceDateFromClient(body);

    // Check rate limit
    const remaining = await getRemainingScanCount(ctx.user.id);
    if (remaining <= 0) {
      throw new ZodRouteError(
        "Limite de scans quotidienne atteinte (20/jour). Réessayez demain.",
        429,
      );
    }

    // Validate image size (base64 is ~33% larger than binary)
    const imageBuffer = Buffer.from(body.image, "base64");
    if (imageBuffer.length > MAX_IMAGE_SIZE) {
      throw new ZodRouteError(
        "L'image est trop volumineuse. Maximum 5MB.",
        413,
      );
    }

    // Increment usage before calling the API (to prevent abuse on failures)
    const withinLimit = await checkAndIncrementScanUsage(ctx.user.id);
    if (!withinLimit) {
      throw new ZodRouteError(
        "Limite de scans quotidienne atteinte (20/jour). Réessayez demain.",
        429,
      );
    }

    // eslint-disable-next-line no-console
    console.log("[Vision Scan] Starting scan for user:", ctx.user.id);
    // eslint-disable-next-line no-console
    console.log("[Vision Scan] Image size:", imageBuffer.length, "bytes");

    // Call Gemini Vision API
    const result = await extractDateFromImage(
      body.image,
      body.mimeType,
      referenceDate,
    );

    // eslint-disable-next-line no-console
    console.log("[Vision Scan] Gemini result:", JSON.stringify(result));

    if (!result.found) {
      const inferredType = result.rawText
        ? inferDateTypeFromRawText(result.rawText)
        : "dcr";

      const primary = extractDateFromRawText(
        result.rawText,
        inferredType,
        referenceDate,
      );
      const fallback = extractDateFromRawText(
        result.rawText,
        inferredType === "dcr" ? "laying" : "dcr",
        referenceDate,
      );

      const salvagedDate = primary ?? fallback;
      const salvagedType: DateType | null = primary
        ? inferredType
        : salvagedDate
          ? inferredType === "dcr"
            ? "laying"
            : "dcr"
          : null;

      if (salvagedDate && salvagedType) {
        if (salvagedType === "laying") {
          return {
            success: true,
            layingDate: salvagedDate.toISOString(),
            ddm: null,
            confidence: "low",
            rawText: result.rawText,
            remaining: remaining - 1,
            quantity: result.quantity ?? null,
            size: result.size ?? "M",
          };
        }

        const layingDate = calculateLayingDateFromDCR(salvagedDate);

        return {
          success: true,
          ddm: salvagedDate.toISOString(),
          layingDate: layingDate.toISOString(),
          confidence: "low",
          rawText: result.rawText,
          remaining: remaining - 1,
          quantity: result.quantity ?? null,
          size: result.size ?? "M",
        };
      }

      return {
        success: false,
        error: "no_date_found",
        confidence: result.confidence,
        remaining: remaining - 1,
      };
    }

    // Handle the case where we got a laying date directly
    if (result.layingDate) {
      let layingDate = parseFrenchDate(
        result.layingDate,
        "laying",
        referenceDate,
      );

      // Fallback: try to extract from rawText if parsing failed
      if (!layingDate) {
        // eslint-disable-next-line no-console
        console.log(
          "[Vision Scan] Failed to parse layingDate, trying rawText fallback",
        );
        layingDate = extractDateFromRawText(
          result.rawText,
          "laying",
          referenceDate,
        );
      }

      if (!layingDate) {
        return {
          success: false,
          error: "invalid_date_format",
          confidence: result.confidence,
          rawText: result.rawText,
          remaining: remaining - 1,
        };
      }

      return {
        success: true,
        layingDate: layingDate.toISOString(),
        ddm: null, // No DDM when we have laying date directly
        confidence: result.confidence,
        rawText: result.rawText,
        remaining: remaining - 1,
        quantity: result.quantity ?? null,
        size: result.size ?? "M", // Default to Medium if not detected
      };
    }

    // Handle the case where we got a DDM
    if (!result.ddm) {
      return {
        success: false,
        error: "no_date_found",
        confidence: result.confidence,
        remaining: remaining - 1,
      };
    }

    // Parse the DDM date (DCR = expiration, typically in near future)
    let ddmDate = parseFrenchDate(result.ddm, "dcr", referenceDate);

    // Fallback: try to extract from rawText if parsing failed
    if (!ddmDate) {
      // eslint-disable-next-line no-console
      console.log("[Vision Scan] Failed to parse DDM, trying rawText fallback");
      ddmDate = extractDateFromRawText(result.rawText, "dcr", referenceDate);
    }

    if (!ddmDate) {
      return {
        success: false,
        error: "invalid_date_format",
        confidence: result.confidence,
        rawText: result.rawText,
        remaining: remaining - 1,
      };
    }

    // Calculate laying date from DDM (DDM - 28 days)
    const layingDate = calculateLayingDateFromDCR(ddmDate);

    return {
      success: true,
      ddm: ddmDate.toISOString(),
      layingDate: layingDate.toISOString(),
      confidence: result.confidence,
      rawText: result.rawText,
      remaining: remaining - 1,
      quantity: result.quantity ?? null,
      size: result.size ?? "M", // Default to Medium if not detected
    };
  });
