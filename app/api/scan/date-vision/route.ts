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
): Date | null {
  if (!rawText) return null;

  // Try to find date patterns in the raw text
  // Pattern: DD/MM, DD-MM, DD.MM (with optional year)
  const datePatterns = [
    /(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})/, // DD/MM/YYYY
    /(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2})/, // DD/MM/YY
    /(\d{1,2})[/\-.](\d{1,2})(?![/\-.\d])/, // DD/MM (no year)
  ];

  for (const pattern of datePatterns) {
    const match = rawText.match(pattern);
    if (match) {
      const dateStr = match[0];
      const parsed = parseFrenchDate(dateStr, dateType);
      if (parsed) return parsed;
    }
  }

  return null;
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
});

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
    const result = await extractDateFromImage(body.image, body.mimeType);

    // eslint-disable-next-line no-console
    console.log("[Vision Scan] Gemini result:", JSON.stringify(result));

    if (!result.found) {
      return {
        success: false,
        error: "no_date_found",
        confidence: result.confidence,
        remaining: remaining - 1,
      };
    }

    // Handle the case where we got a laying date directly
    if (result.layingDate) {
      let layingDate = parseFrenchDate(result.layingDate, "laying");

      // Fallback: try to extract from rawText if parsing failed
      if (!layingDate) {
        // eslint-disable-next-line no-console
        console.log(
          "[Vision Scan] Failed to parse layingDate, trying rawText fallback",
        );
        layingDate = extractDateFromRawText(result.rawText, "laying");
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
    let ddmDate = parseFrenchDate(result.ddm, "dcr");

    // Fallback: try to extract from rawText if parsing failed
    if (!ddmDate) {
      // eslint-disable-next-line no-console
      console.log("[Vision Scan] Failed to parse DDM, trying rawText fallback");
      ddmDate = extractDateFromRawText(result.rawText, "dcr");
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
