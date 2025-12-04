import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { route } from "@/lib/zod-route";
import { sendExpirationEmails } from "@/features/notifications";
import { NextResponse } from "next/server";

/**
 * CRON endpoint to check for expiring eggs and send notification emails
 *
 * This should be called daily (e.g., at 8:00 AM) by Vercel Cron or an external scheduler.
 *
 * To set up in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/expiration-check",
 *     "schedule": "0 8 * * *"
 *   }]
 * }
 */
export const GET = route.handler(async (req) => {
  // Verify CRON secret for security
  const authHeader = req.headers.get("authorization");
  const cronSecret = env.CRON_SECRET;

  // In production, require CRON_SECRET
  if (env.NODE_ENV === "production" && cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      logger.warn("[CRON] Unauthorized expiration check attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  logger.info("[CRON] Starting expiration check");

  const result = await sendExpirationEmails();

  logger.info("[CRON] Expiration check complete", {
    sent: result.sent,
    errors: result.errors,
  });

  return NextResponse.json({
    success: true,
    emailsSent: result.sent,
    errors: result.errors,
    timestamp: new Date().toISOString(),
  });
});
