"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { AUTH_PLANS } from "@/lib/auth/stripe/auth-plans";
import { ActionError } from "@/lib/errors/action-error";
import { getOrCreateFridge } from "@/lib/fridge/get-fridge-access";
import { prisma } from "@/lib/prisma";
import { getServerUrl } from "@/lib/server-url";
import { stripe } from "@/lib/stripe";
import { z } from "zod";

/**
 * Create a Stripe checkout session for upgrading to premium
 * Payment is attached to the USER, not the organization
 *
 * Trial eligibility: Per-plan (user can have Brigade trial, then later Chef trial)
 */
export const createCheckoutAction = authAction
  .inputSchema(
    z.object({
      plan: z.string(),
      annual: z.boolean().default(false),
      successUrl: z.string(),
      cancelUrl: z.string(),
    }),
  )
  .action(
    async ({
      parsedInput: { plan, annual, successUrl, cancelUrl },
      ctx: { user },
    }) => {
      // Find the plan
      const authPlan = AUTH_PLANS.find((p) => p.name === plan);
      if (!authPlan) {
        throw new ActionError(`Plan "${plan}" not found`);
      }

      // Get the price ID based on annual or monthly
      const priceId = annual
        ? authPlan.annualDiscountPriceId
        : authPlan.priceId;
      if (!priceId) {
        throw new ActionError(`Price ID not found for plan "${plan}"`);
      }

      // Vérifier l'éligibilité au trial (per-plan)
      const existingSubscription = await prisma.userSubscription.findUnique({
        where: { userId: user.id },
      });

      // Éligible au trial si:
      // 1. Pas de subscription existante, OU
      // 2. N'a jamais eu ce plan spécifique (permet trial Brigade puis trial Chef)
      const hasHadThisPlan = existingSubscription?.plan === plan;
      const isEligibleForTrial =
        !hasHadThisPlan && authPlan.freeTrial?.days !== undefined;

      // Get or create Stripe customer for user
      const customerId = await getOrCreateStripeCustomer(user.id, user.email);

      // Create checkout session with USER metadata (not organization)
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${getServerUrl()}${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${getServerUrl()}${cancelUrl}`,
        metadata: {
          userId: user.id,
          plan: plan,
        },
        subscription_data: {
          metadata: {
            userId: user.id,
            plan: plan,
          },
          // Trial seulement si éligible (per-plan)
          ...(isEligibleForTrial && {
            trial_period_days: authPlan.freeTrial?.days,
          }),
        },
      });

      if (!session.url) {
        throw new ActionError("Failed to create checkout session");
      }

      return {
        url: session.url,
      };
    },
  );

/**
 * Upgrade an existing subscription to a new plan
 * Uses stripe.subscriptions.update() instead of creating a new checkout
 * No trial period for upgrades
 */
export const upgradeSubscriptionAction = authAction
  .inputSchema(
    z.object({
      targetPlan: z.enum(["brigade", "chef"]),
      annual: z.boolean().default(false),
    }),
  )
  .action(async ({ parsedInput: { targetPlan, annual }, ctx: { user } }) => {
    // Get existing subscription
    const existingSub = await prisma.userSubscription.findUnique({
      where: { userId: user.id },
    });

    if (!existingSub?.stripeSubscriptionId) {
      throw new ActionError(
        "No active subscription found. Please use checkout instead.",
      );
    }

    // Get the new plan
    const newPlan = AUTH_PLANS.find((p) => p.name === targetPlan);
    if (!newPlan) {
      throw new ActionError(`Plan "${targetPlan}" not found`);
    }

    // Get the new price ID
    const newPriceId = annual ? newPlan.annualDiscountPriceId : newPlan.priceId;
    if (!newPriceId) {
      throw new ActionError(`Price ID not found for plan "${targetPlan}"`);
    }

    // Get the current Stripe subscription
    const subscription = await stripe.subscriptions.retrieve(
      existingSub.stripeSubscriptionId,
    );

    // Update the subscription with the new price (prorated)
    await stripe.subscriptions.update(existingSub.stripeSubscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: "create_prorations",
      metadata: {
        userId: user.id,
        plan: targetPlan,
      },
      // NO trial_period_days for upgrades
    });

    // Update local DB immediately (webhook will also update)
    await prisma.userSubscription.update({
      where: { userId: user.id },
      data: {
        plan: targetPlan,
      },
    });

    return { success: true, plan: targetPlan };
  });

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
