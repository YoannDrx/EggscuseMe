"use server";

import { sendEmail } from "@/lib/mail/send-email";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";
import { authAction } from "@/lib/actions/safe-actions";
import { sendPushNotification } from "@/lib/pwa/web-push-config";
import { logger } from "@/lib/logger";
import ExpirationWarningEmail from "@email/expiration-warning.email";
import {
  getUsersWithExpiringEggs,
  groupEggsByFridge,
} from "./check-expiring-eggs";
import { UpdateNotificationPreferencesSchema } from "./notification.schema";
import { getTranslations } from "next-intl/server";

/**
 * Get the current user's notification preferences
 */
export const getNotificationPreferencesAction = authAction.action(
  async ({ ctx: { user } }) => {
    const prefs = await prisma.userPreferences.findUnique({
      where: { userId: user.id },
      select: {
        notifyEnabled: true,
        notifyDaysBefore: true,
        emailEnabled: true,
        pushEnabled: true,
      },
    });

    // Return defaults if no preferences exist
    return {
      preferences: prefs ?? {
        notifyEnabled: true,
        notifyDaysBefore: 2,
        emailEnabled: true,
        pushEnabled: true,
      },
    };
  },
);

/**
 * Update the current user's notification preferences
 */
export const updateNotificationPreferencesAction = authAction
  .inputSchema(UpdateNotificationPreferencesSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const prefs = await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        notifyEnabled: parsedInput.notifyEnabled,
        notifyDaysBefore: parsedInput.notifyDaysBefore,
        ...(parsedInput.emailEnabled !== undefined && {
          emailEnabled: parsedInput.emailEnabled,
        }),
        ...(parsedInput.pushEnabled !== undefined && {
          pushEnabled: parsedInput.pushEnabled,
        }),
      },
      create: {
        userId: user.id,
        notifyEnabled: parsedInput.notifyEnabled,
        notifyDaysBefore: parsedInput.notifyDaysBefore,
        emailEnabled: parsedInput.emailEnabled ?? true,
        pushEnabled: parsedInput.pushEnabled ?? true,
      },
      select: {
        notifyEnabled: true,
        notifyDaysBefore: true,
        emailEnabled: true,
        pushEnabled: true,
      },
    });

    return { preferences: prefs };
  });

type ExpiringEgg = {
  id: string;
  name: string | null;
  remaining: number;
  daysRemaining: number;
  layingDate: Date;
  dcrDate: Date;
  fridge: {
    id: string;
    name: string;
  } | null;
};

/**
 * Get or create an unsubscribe token for a user
 */
async function getOrCreateUnsubscribeToken(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { unsubscribeToken: true },
  });

  if (user?.unsubscribeToken) {
    return user.unsubscribeToken;
  }

  // Generate a new token
  const token = crypto.randomUUID();
  await prisma.user.update({
    where: { id: userId },
    data: { unsubscribeToken: token },
  });

  return token;
}

/**
 * Send expiration warning emails to all users with expiring eggs
 * This is called by the CRON job
 */
export async function sendExpirationEmails(): Promise<{
  sent: number;
  errors: number;
}> {
  const t = await getTranslations("notifications.email");
  const usersWithExpiringEggs = await getUsersWithExpiringEggs();

  // Filter users who have email enabled
  const usersWithEmailEnabled = usersWithExpiringEggs.filter(
    (u) => u.emailEnabled,
  );

  let sent = 0;
  let errors = 0;

  // Get base URL for unsubscribe links
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://eggscuseme.app";

  // Get or create unsubscribe tokens for all users in parallel
  const unsubscribeTokens = await Promise.all(
    usersWithEmailEnabled.map(async (u) =>
      getOrCreateUnsubscribeToken(u.userId),
    ),
  );
  const tokenByUserId = new Map(
    usersWithEmailEnabled.map((u, i) => [u.userId, unsubscribeTokens[i]]),
  );

  // Build all email send promises
  const emailJobs: {
    userId: string;
    subject: string;
    fridgeName: string;
    promise: Promise<{ error: Error | null }>;
  }[] = [];

  for (const userData of usersWithEmailEnabled) {
    // Get unsubscribe token from map
    const unsubscribeToken = tokenByUserId.get(userData.userId);
    const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${unsubscribeToken}`;

    const eggsByFridge = groupEggsByFridge(userData.eggs);

    // Send one email per fridge
    for (const [, fridgeData] of eggsByFridge) {
      const emailData = {
        userName: userData.userName,
        eggs: fridgeData.eggs.map((egg: ExpiringEgg) => ({
          name: egg.name ?? t("boxNameFallback"),
          daysLeft: egg.daysRemaining,
          quantity: egg.remaining,
        })),
        fridgeName: fridgeData.fridgeName,
        unsubscribeUrl,
      };

      const subject = t("subject", { count: fridgeData.eggs.length });
      emailJobs.push({
        userId: userData.userId,
        subject,
        fridgeName: fridgeData.fridgeName,
        promise: sendEmail({
          to: userData.userEmail,
          subject,
          html: ExpirationWarningEmail(emailData),
        }),
      });
    }
  }

  // Send all emails in parallel
  const results = await Promise.allSettled(
    emailJobs.map(async (job) => job.promise),
  );
  const logPromises: Promise<void>[] = [];

  for (const [index, result] of results.entries()) {
    const job = emailJobs[index];
    const isSuccess = result.status === "fulfilled" && !result.value.error;

    logPromises.push(
      logNotification({
        userId: job.userId,
        type: "EXPIRATION_WARNING",
        channel: "EMAIL",
        status: isSuccess ? "SENT" : "FAILED",
        subject: job.subject,
        errorMessage:
          result.status === "rejected"
            ? String(result.reason)
            : (result.value.error?.message ?? undefined),
        metadata: { fridgeName: job.fridgeName },
      }),
    );

    if (result.status === "fulfilled" && !result.value.error) {
      sent++;
    } else {
      errors++;
    }
  }

  await Promise.all(logPromises);

  return { sent, errors };
}

/**
 * Send expiration warning push notifications to all users with expiring eggs
 * This is called by the CRON job
 */
export async function sendExpirationPushNotifications(): Promise<{
  sent: number;
  errors: number;
  cleaned: number;
}> {
  const usersWithExpiringEggs = await getUsersWithExpiringEggs();

  let sent = 0;
  let errors = 0;
  let cleaned = 0;

  // Filter users who have push enabled
  const usersWithPushEnabled = usersWithExpiringEggs.filter(
    (u) => u.pushEnabled,
  );

  // Get all push subscriptions for these users
  const userIds = usersWithPushEnabled.map((u) => u.userId);
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId: { in: userIds } },
  });

  // Group subscriptions by user
  const subscriptionsByUser = new Map<
    string,
    (typeof subscriptions)[number][]
  >();
  for (const sub of subscriptions) {
    const userSubs = subscriptionsByUser.get(sub.userId);
    if (userSubs) {
      userSubs.push(sub);
    } else {
      subscriptionsByUser.set(sub.userId, [sub]);
    }
  }

  // Build all push notification promises
  const pushJobs: {
    userId: string;
    promise: Promise<{
      success: boolean;
      subscriptionId?: string;
      shouldDelete?: boolean;
    }>;
  }[] = [];

  for (const userData of usersWithPushEnabled) {
    const userSubscriptions = subscriptionsByUser.get(userData.userId) ?? [];
    if (userSubscriptions.length === 0) continue;

    const totalEggs = userData.eggs.reduce(
      (sum, egg) => sum + egg.remaining,
      0,
    );
    const mostUrgent = userData.eggs[0]; // Already sorted by daysRemaining

    // Build notification payload
    const payload = {
      title: `${totalEggs} œufs arrivent à DCR`,
      body:
        mostUrgent.daysRemaining === 0
          ? `${mostUrgent.name ?? "Une boîte"} atteint sa DCR aujourd'hui !`
          : `${mostUrgent.name ?? "Une boîte"} atteint sa DCR dans ${mostUrgent.daysRemaining} jour${mostUrgent.daysRemaining > 1 ? "s" : ""}`,
      tag: "expiration-warning",
      url: "/fridge",
      requireInteraction: mostUrgent.daysRemaining <= 1,
      actions: [
        { action: "open", title: "Voir le frigo" },
        { action: "dismiss", title: "Plus tard" },
      ],
    };

    // Send to all user's devices
    for (const sub of userSubscriptions) {
      pushJobs.push({
        userId: userData.userId,
        promise: sendPushNotification(
          {
            endpoint: sub.endpoint,
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
          payload,
        )
          .then((success) => ({
            success,
            subscriptionId: sub.id,
            shouldDelete: !success,
          }))
          .catch(() => ({
            success: false,
            subscriptionId: sub.id,
            shouldDelete: true,
          })),
      });
    }
  }

  // Send all notifications in parallel
  const results = await Promise.allSettled(
    pushJobs.map(async (job) => job.promise),
  );

  // Collect subscriptions to delete (410 errors = invalid subscription)
  const subscriptionsToDelete: string[] = [];
  const logPromises: Promise<void>[] = [];

  for (const [index, result] of results.entries()) {
    const job = pushJobs[index];
    const isSuccess = result.status === "fulfilled" && result.value.success;

    logPromises.push(
      logNotification({
        userId: job.userId,
        type: "EXPIRATION_WARNING",
        channel: "PUSH",
        status: isSuccess ? "SENT" : "FAILED",
        errorMessage:
          result.status === "rejected" ? String(result.reason) : undefined,
      }),
    );

    if (result.status === "fulfilled") {
      if (result.value.success) {
        sent++;
      } else {
        errors++;
        if (result.value.shouldDelete && result.value.subscriptionId) {
          subscriptionsToDelete.push(result.value.subscriptionId);
        }
      }
    } else {
      errors++;
    }
  }

  await Promise.all(logPromises);

  // Clean up invalid subscriptions
  if (subscriptionsToDelete.length > 0) {
    await prisma.pushSubscription.deleteMany({
      where: { id: { in: subscriptionsToDelete } },
    });
    cleaned = subscriptionsToDelete.length;
    logger.info("[PUSH] Cleaned invalid subscriptions", {
      count: cleaned,
    });
  }

  return { sent, errors, cleaned };
}

/**
 * Log a notification to the database for audit
 */
export async function logNotification(params: {
  userId: string;
  type:
    | "EXPIRATION_WARNING"
    | "WELCOME"
    | "PASSWORD_RESET"
    | "FRIDGE_INVITE"
    | "OTHER";
  channel: "EMAIL" | "PUSH" | "IN_APP";
  status: "SENT" | "FAILED" | "BOUNCED" | "SKIPPED";
  subject?: string;
  errorMessage?: string;
  metadata?: Prisma.InputJsonValue;
}): Promise<void> {
  try {
    await prisma.notificationLog.create({
      data: {
        userId: params.userId,
        type: params.type,
        channel: params.channel,
        status: params.status,
        subject: params.subject,
        errorMessage: params.errorMessage,
        metadata: params.metadata,
      },
    });
  } catch (error) {
    logger.error("[NOTIFICATION] Failed to log notification", {
      error,
      params,
    });
  }
}
