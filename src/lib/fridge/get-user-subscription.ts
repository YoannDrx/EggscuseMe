import type { UserSubscription } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

/**
 * Get user's subscription (linked directly to user, not organization)
 */
export async function getUserSubscription(
  userId: string,
): Promise<UserSubscription | null> {
  return prisma.userSubscription.findUnique({
    where: { userId },
  });
}

/**
 * Get user's active subscription (active, trialing, or past_due)
 */
export async function getActiveUserSubscription(
  userId: string,
): Promise<UserSubscription | null> {
  return prisma.userSubscription.findFirst({
    where: {
      userId,
      OR: [
        { status: "active" },
        { status: "trialing" },
        { status: "past_due" },
      ],
    },
  });
}

/**
 * Check if user has a premium subscription
 */
export async function isUserPremium(userId: string): Promise<boolean> {
  const subscription = await getActiveUserSubscription(userId);
  return subscription !== null && subscription.plan !== "free";
}
