"use server";

import { sendEmail } from "@/lib/mail/send-email";
import { prisma } from "@/lib/prisma";
import { authAction } from "@/lib/actions/safe-actions";
import ExpirationWarningEmail from "@email/expiration-warning.email";
import {
  getUsersWithExpiringEggs,
  groupEggsByOrganization,
} from "./check-expiring-eggs";
import { UpdateNotificationPreferencesSchema } from "./notification.schema";

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

/**
 * Send expiration warning emails to all users with expiring eggs
 * This is called by the CRON job
 */
export async function sendExpirationEmails(): Promise<{
  sent: number;
  errors: number;
}> {
  const usersWithExpiringEggs = await getUsersWithExpiringEggs();

  let sent = 0;
  let errors = 0;

  // Build all email send promises
  const emailPromises: Promise<{ error: Error | null }>[] = [];

  for (const userData of usersWithExpiringEggs) {
    const eggsByOrg = groupEggsByOrganization(userData.eggs);

    // Send one email per organization
    for (const [, orgData] of eggsByOrg) {
      const emailData = {
        userName: userData.userName,
        eggs: orgData.eggs.map((egg) => ({
          name: egg.name ?? "Boîte d'oeufs",
          daysLeft: egg.daysRemaining,
          quantity: egg.remaining,
        })),
        organizationName: orgData.orgName,
        organizationSlug: orgData.orgSlug,
      };

      emailPromises.push(
        sendEmail({
          to: userData.userEmail,
          subject: `Alerte fraîcheur - ${orgData.eggs.length} boîte${orgData.eggs.length > 1 ? "s" : ""} bientôt périmée${orgData.eggs.length > 1 ? "s" : ""}`,
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
