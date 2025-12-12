import { z } from "zod";

import { ZodRouteError } from "@/lib/errors/zod-route-error";
import { prisma } from "@/lib/prisma";
import { authRoute } from "@/lib/zod-route";
import {
  extractDateFromImage,
  parseFrenchDate,
} from "@/lib/ai/extract-date-from-image";
import { calculateLayingDateFromDCR } from "@/features/scanner/lot-code-parser";

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

    // Call Gemini Vision API
    const result = await extractDateFromImage(body.image, body.mimeType);

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
      const layingDate = parseFrenchDate(result.layingDate);
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

    // Parse the DDM date
    const ddmDate = parseFrenchDate(result.ddm);
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
    };
  });
