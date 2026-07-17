import { AUTH_PLANS } from "@/lib/auth/stripe/auth-plans";
import { resolveEffectiveBillingEntitlement } from "@/features/fridge/billing-entitlement";
import { Prisma } from "@/generated/prisma";
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
  if (!env.STRIPE_WEBHOOK_SECRET) {
    logger.error("Stripe webhook secret is not configured");
    return NextResponse.json(
      { error: "Stripe webhook is not configured" },
      { status: 503 },
    );
  }

  const headerList = await headers();
  const body = await req.text();

  const stripeSignature = headerList.get("stripe-signature");

  let event: Stripe.Event | null = null;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      stripeSignature ?? "",
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err: unknown) {
    logger.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid Stripe webhook signature" },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        if (
          event.data.object.mode === "payment" &&
          event.data.object.payment_status === "paid"
        ) {
          await oneTimeCheckoutSessionCompleted(event.data.object);
        } else if (event.data.object.mode === "subscription") {
          await subscriptionCheckoutSessionCompleted(event.data.object);
        }
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

const subscriptionCheckoutSessionCompleted = async (
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

  const effective = resolveEffectiveBillingEntitlement({
    subscriptionPlan: plan.name,
    subscriptionStatus: stripeSubscription.status,
    oneTimePlan: existingSubscription?.oneTimePlan ?? null,
  });
  const subscriptionData = {
    ...effective,
    subscriptionPlan: plan.name,
    subscriptionStatus: stripeSubscription.status,
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

const oneTimeCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan;
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  if (
    !userId ||
    plan !== "chef" ||
    !customerId ||
    !paymentIntentId ||
    session.payment_status !== "paid"
  ) {
    logger.warn("Incomplete one-time Chef checkout session");
    return;
  }

  const paidAt = new Date(session.created * 1000);

  try {
    await prisma.$transaction(async (transaction) => {
      const existingPurchase = await transaction.billingPurchase.findUnique({
        where: { checkoutSessionId: session.id },
      });
      if (existingPurchase) return;

      const current = await transaction.userSubscription.findUnique({
        where: { userId },
      });

      await transaction.billingPurchase.create({
        data: {
          userId,
          plan: "chef",
          checkoutSessionId: session.id,
          paymentIntentId,
          amount: session.amount_total ?? 0,
          currency: session.currency ?? "eur",
          paidAt,
        },
      });

      await transaction.userSubscription.upsert({
        where: { userId },
        update: {
          plan: "chef",
          status: "active",
          stripeCustomerId: customerId,
          oneTimePlan: "chef",
          oneTimeGrantedAt: current?.oneTimeGrantedAt ?? paidAt,
        },
        create: {
          userId,
          plan: "chef",
          status: "active",
          stripeCustomerId: customerId,
          oneTimePlan: "chef",
          oneTimeGrantedAt: paidAt,
        },
      });
    });
  } catch (error) {
    // Stripe retries and concurrent deliveries are expected. A duplicate ledger
    // key proves that another delivery already granted the same purchase.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      logger.info(`Duplicate Chef purchase ignored: ${session.id}`);
      return;
    }

    throw error;
  }

  logger.info(`Lifetime Chef access granted to user: ${userId}`);
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

  const subscriptionPlan = plan?.name ?? userSubscription.subscriptionPlan;
  const effective = resolveEffectiveBillingEntitlement({
    subscriptionPlan,
    subscriptionStatus: subscription.status,
    oneTimePlan: userSubscription.oneTimePlan,
  });

  await prisma.userSubscription.update({
    where: { id: userSubscription.id },
    data: {
      ...effective,
      subscriptionPlan,
      subscriptionStatus: subscription.status,
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

  const effective = resolveEffectiveBillingEntitlement({
    subscriptionPlan: userSubscription.subscriptionPlan,
    subscriptionStatus: "canceled",
    oneTimePlan: userSubscription.oneTimePlan,
  });

  await prisma.userSubscription.update({
    where: { id: userSubscription.id },
    data: {
      ...effective,
      stripeSubscriptionId: null,
      subscriptionPlan: null,
      subscriptionStatus: "canceled",
      cancelAtPeriodEnd: false,
      periodEnd: new Date(),
    },
  });

  logger.info(
    `Recurring subscription canceled; effective plan is ${effective.plan}: ${subscription.id}`,
  );
};
