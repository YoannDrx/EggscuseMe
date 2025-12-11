import { AUTH_PLANS } from "@/lib/auth/stripe/auth-plans";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
export const maxDuration = 300;

/**
 * Résout le plan depuis une subscription Stripe avec plusieurs fallbacks
 * 1. price.metadata.plan (source authoritative - configuré dans Stripe)
 * 2. subscription.metadata.plan (défini lors du checkout)
 * 3. Déduction depuis le priceId
 */
const getPlanFromSubscription = (subscription: Stripe.Subscription) => {
  // 1. Essayer price.metadata.plan (source authoritative)
  const priceMetadataPlan = subscription.items.data[0].price.metadata.plan;
  if (priceMetadataPlan) {
    const plan = AUTH_PLANS.find((p) => p.name === priceMetadataPlan);
    if (plan) {
      logger.debug(`Plan resolved from price.metadata: ${plan.name}`);
      return plan;
    }
  }

  // 2. Fallback: subscription.metadata.plan (défini lors du checkout)
  const subscriptionMetadataPlan = subscription.metadata.plan;
  if (subscriptionMetadataPlan) {
    const plan = AUTH_PLANS.find((p) => p.name === subscriptionMetadataPlan);
    if (plan) {
      logger.debug(`Plan resolved from subscription.metadata: ${plan.name}`);
      return plan;
    }
  }

  // 3. Fallback: déduire du priceId
  const priceId = subscription.items.data[0].price.id;
  const planByPriceId = AUTH_PLANS.find(
    (p) => p.priceId === priceId || p.annualDiscountPriceId === priceId,
  );
  if (planByPriceId) {
    logger.debug(`Plan resolved from priceId: ${planByPriceId.name}`);
    return planByPriceId;
  }

  logger.error(`Could not determine plan for subscription: ${subscription.id}`);
  return null;
};

export const POST = async (req: NextRequest) => {
  const headerList = await headers();
  const body = await req.text();

  const stripeSignature = headerList.get("stripe-signature");

  let event: Stripe.Event | null = null;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      stripeSignature ?? "",
      env.STRIPE_WEBHOOK_SECRET ?? "",
    );
  } catch (err: unknown) {
    logger.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid Stripe webhook signature", details: err },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await checkoutSessionCompleted(event.data.object);
        break;
      case "customer.subscription.updated":
        await customerSubscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await customerSubscriptionDeleted(event.data.object);
        break;
      default:
        logger.debug(`Unhandled event type: ${event.type}`);
        break;
    }
  } catch (error) {
    logger.error(`Error handling webhook event ${event.type}:`, error);
    return NextResponse.json(
      { error: "Webhook handler failed", eventType: event.type },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
  });
};

const checkoutSessionCompleted = async (
  sessionData: Stripe.Checkout.Session,
) => {
  const session = sessionData;

  if (!session.customer || !session.subscription) {
    logger.warn("Missing customer or subscription in checkout session");
    return;
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer.id;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription.id;

  // Find user by stripeCustomerId
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    logger.error(`No user found for customer ID: ${customerId}`);
    return;
  }

  // Get the subscription from Stripe to get the price details
  const stripeSubscription =
    await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = stripeSubscription.items.data[0]?.price.id;

  if (!priceId) {
    logger.error(`No price ID found for subscription: ${subscriptionId}`);
    return;
  }

  // Get plan from subscription metadata
  const plan = getPlanFromSubscription(stripeSubscription);
  if (!plan) {
    logger.error(`Plan not found in subscription metadata: ${subscriptionId}`);
    return;
  }

  // Create or update UserSubscription
  const existingSubscription = await prisma.userSubscription.findUnique({
    where: { userId: user.id },
  });

  const subscriptionData = {
    plan: plan.name,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    status: stripeSubscription.status,
    periodStart: new Date(
      stripeSubscription.items.data[0].current_period_start * 1000,
    ),
    periodEnd: new Date(
      stripeSubscription.items.data[0].current_period_end * 1000,
    ),
    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
  };

  if (existingSubscription) {
    await prisma.userSubscription.update({
      where: { id: existingSubscription.id },
      data: subscriptionData,
    });
  } else {
    await prisma.userSubscription.create({
      data: {
        ...subscriptionData,
        userId: user.id,
      },
    });
  }

  logger.info(
    `UserSubscription created/updated for user: ${user.id}, plan: ${plan.name}`,
  );
};

const customerSubscriptionUpdated = async (
  subscriptionData: Stripe.Subscription,
) => {
  const subscription = subscriptionData;

  logger.info("Processing customer.subscription.updated:", subscription.id);

  // Get plan from subscription metadata
  const plan = getPlanFromSubscription(subscription);

  // Find UserSubscription
  const userSubscription = await prisma.userSubscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!userSubscription) {
    logger.error(`Subscription not found in database: ${subscription.id}`);
    return;
  }

  const planName = plan?.name ?? userSubscription.plan;

  await prisma.userSubscription.update({
    where: { id: userSubscription.id },
    data: {
      plan: planName,
      status: subscription.status,
      periodStart: new Date(
        subscription.items.data[0].current_period_start * 1000,
      ),
      periodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  logger.info(
    `UserSubscription updated: ${subscription.id}, status: ${subscription.status}`,
  );
};

const customerSubscriptionDeleted = async (
  subscriptionData: Stripe.Subscription,
) => {
  const subscription = subscriptionData;

  logger.info("Processing customer.subscription.deleted:", subscription.id);

  // Find UserSubscription
  const userSubscription = await prisma.userSubscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!userSubscription) {
    logger.error(`Subscription not found in database: ${subscription.id}`);
    return;
  }

  await prisma.userSubscription.update({
    where: { id: userSubscription.id },
    data: {
      plan: "free",
      status: "canceled",
      cancelAtPeriodEnd: false,
      periodEnd: new Date(),
    },
  });

  logger.info(
    `UserSubscription canceled and reverted to free: ${subscription.id}`,
  );
};
