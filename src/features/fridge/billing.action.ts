"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { AUTH_PLANS } from "@/lib/auth/stripe/auth-plans";
import { hasLifetimeChefAccess } from "@/features/fridge/billing-entitlement";
import { ActionError } from "@/lib/errors/action-error";
import { getOrCreateFridge } from "@/lib/fridge/get-fridge-access";
import { prisma } from "@/lib/prisma";
import { getServerUrl } from "@/lib/server-url";
import { stripe } from "@/lib/stripe";
import { z } from "zod";

const internalPathSchema = z
  .string()
  .startsWith("/")
  .refine((value) => !value.startsWith("//"), "Invalid internal path");

const getCheckoutSuccessUrl = (path: string) => {
  const separator = path.includes("?") ? "&" : "?";
  return `${getServerUrl()}${path}${separator}session_id={CHECKOUT_SESSION_ID}`;
};

/**
 * Create a Stripe checkout session for upgrading to premium
 * Payment is attached to the USER, not the organization
 *
 * Trial eligibility: Per-plan (user can have Brigade trial, then later Chef trial)
 */
export const createCheckoutAction = authAction
  .inputSchema(
    z.object({
      plan: z.literal("chef"),
      successUrl: internalPathSchema,
      cancelUrl: internalPathSchema,
      requestId: z.string().uuid(),
    }),
  )
  .action(
    async ({
      parsedInput: { plan, successUrl, cancelUrl, requestId },
      ctx: { user },
    }) => {
      // Find the plan
      const authPlan = AUTH_PLANS.find((p) => p.name === plan);
      if (!authPlan) {
        throw new ActionError(`Plan "${plan}" not found`);
      }

      const priceId = authPlan.priceId;
      if (!priceId) {
        throw new ActionError(`Price ID not found for plan "${plan}"`);
      }

      const existingEntitlement = await prisma.userSubscription.findUnique({
        where: { userId: user.id },
      });
      if (existingEntitlement && hasLifetimeChefAccess(existingEntitlement)) {
        throw new ActionError("Chef lifetime access is already active");
      }

      const price = await stripe.prices.retrieve(priceId);
      if (
        !price.active ||
        price.type !== "one_time" ||
        price.metadata.plan !== "chef"
      ) {
        throw new ActionError(
          "Chef lifetime price is not configured correctly",
        );
      }

      // Get or create Stripe customer for user
      const customerId = await getOrCreateStripeCustomer(user.id, user.email);

      // Create checkout session with USER metadata (not organization)
      const session = await stripe.checkout.sessions.create(
        {
          customer: customerId,
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: getCheckoutSuccessUrl(successUrl),
          cancel_url: `${getServerUrl()}${cancelUrl}`,
          metadata: {
            userId: user.id,
            plan: plan,
          },
          payment_intent_data: {
            metadata: {
              userId: user.id,
              plan: plan,
            },
          },
        },
        {
          idempotencyKey: `eggscuseme-checkout-${user.id}-${requestId}`,
        },
      );

      if (!session.url) {
        throw new ActionError("Failed to create checkout session");
      }

      return {
        url: session.url,
      };
    },
  );

/**
 * Get or create a Stripe customer for the user
 */
async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
): Promise<string> {
  // Check if user already has a Stripe customer ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true, name: true },
  });

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create a new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: user?.name ?? undefined,
    metadata: {
      userId,
    },
  });

  // Save the customer ID to the user
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

/**
 * Create a Stripe customer portal session for managing subscription
 */
export const createPortalSessionAction = authAction.action(
  async ({ ctx: { user } }) => {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    });

    if (!dbUser?.stripeCustomerId) {
      throw new ActionError("No subscription found");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: `${getServerUrl()}/fridge/settings/billing`,
    });

    return {
      url: session.url,
    };
  },
);

/**
 * Get user's subscription status
 */
export const getSubscriptionStatusAction = authAction.action(
  async ({ ctx: { user } }) => {
    const { subscription } = await getOrCreateFridge(user);

    return {
      isPremium: subscription !== null && subscription.plan !== "free",
      plan: subscription?.plan ?? "free",
      status: subscription?.status ?? null,
      periodEnd: subscription?.periodEnd ?? null,
      cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd ?? false,
    };
  },
);
