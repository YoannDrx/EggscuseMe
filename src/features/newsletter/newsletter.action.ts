"use server";

import { prisma } from "@/lib/prisma";
import { action } from "@/lib/actions/safe-actions";
import { NewsletterSubscribeSchema } from "./newsletter.schema";

export const subscribeToNewsletter = action
  .schema(NewsletterSubscribeSchema)
  .action(async ({ parsedInput: { email, locale, source } }) => {
    // Check if already subscribed
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existing) {
      return { success: true, alreadySubscribed: true };
    }

    // Create new subscription
    await prisma.newsletterSubscription.create({
      data: {
        email,
        locale,
        source,
      },
    });

    return { success: true, alreadySubscribed: false };
  });
