"use server";

import { sendEmail } from "@/lib/mail/send-email";
import { prisma } from "@/lib/prisma";
import { authAction } from "@/lib/actions/safe-actions";
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
      },
    });

    // Return defaults if no preferences exist
    return {
      preferences: prefs ?? {
        notifyEnabled: true,
        notifyDaysBefore: 2,
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
      },
      create: {
        userId: user.id,
        notifyEnabled: parsedInput.notifyEnabled,
        notifyDaysBefore: parsedInput.notifyDaysBefore,
      },
      select: {
        notifyEnabled: true,
        notifyDaysBefore: true,
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
  fridge: {
    id: string;
    name: string;
  } | null;
};

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

  let sent = 0;
  let errors = 0;

  // Build all email send promises
  const emailPromises: Promise<{ error: Error | null }>[] = [];

  for (const userData of usersWithExpiringEggs) {
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
      };

      emailPromises.push(
        sendEmail({
          to: userData.userEmail,
          subject: t("subject", { count: fridgeData.eggs.length }),
          html: ExpirationWarningEmail(emailData),
        }),
      );
    }
  }

  // Send all emails in parallel
  const results = await Promise.allSettled(emailPromises);

  for (const result of results) {
    if (result.status === "fulfilled" && !result.value.error) {
      sent++;
    } else {
      errors++;
    }
  }

  return { sent, errors };
}
