import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { route } from "@/lib/zod-route";
import {
  sendExpirationEmails,
  sendExpirationPushNotifications,
} from "@/features/notifications";
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
  if (env.NODE_ENV === "production") {
    if (!cronSecret) {
      logger.error("[CRON] CRON_SECRET is required in production");
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 },
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      logger.warn("[CRON] Unauthorized expiration check attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  logger.info("[CRON] Starting expiration check");

  // Send both email and push notifications in parallel
  const [emailResult, pushResult] = await Promise.all([
    sendExpirationEmails(),
    sendExpirationPushNotifications(),
  ]);

  logger.info("[CRON] Expiration check complete", {
    emailsSent: emailResult.sent,
    emailErrors: emailResult.errors,
    pushSent: pushResult.sent,
    pushErrors: pushResult.errors,
    pushCleaned: pushResult.cleaned,
  });

  return NextResponse.json({
    success: true,
    email: {
      sent: emailResult.sent,
      errors: emailResult.errors,
    },
    push: {
      sent: pushResult.sent,
      errors: pushResult.errors,
      cleaned: pushResult.cleaned,
    },
    timestamp: new Date().toISOString(),
  });
});
