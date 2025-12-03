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

// Utility function to get plan from subscription metadata
const getPlanFromSubscription = (subscription: Stripe.Subscription) => {
  const planName = subscription.items.data[0].price.metadata.plan;
  if (!planName) return null;

  return AUTH_PLANS.find((p) => p.name === planName);
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
        await checkoutSessionCompleted(event.data.object, req);
        break;
      case "customer.subscription.updated":
        await customerSubscriptionUpdated(event.data.object, req);
        break;
      case "customer.subscription.deleted":
        await customerSubscriptionDeleted(event.data.object, req);
        break;
      default:
        logger.error(`Unhandled event type: ${event.type}`);
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

/**
 * Find the owner of a payment - either a User (new system) or Organization (legacy)
 */
async function findPaymentOwner(customerId: string): Promise<{
  type: "user" | "organization";
  id: string;
  entity: { id: string };
} | null> {
  // NEW SYSTEM: Try to find User by stripeCustomerId first
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (user) {
    return { type: "user", id: user.id, entity: user };
  }

  // LEGACY SYSTEM: Fall back to Organization
  const organization = await prisma.organization.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (organization) {
    return { type: "organization", id: organization.id, entity: organization };
  }

  return null;
}

const checkoutSessionCompleted = async (
  sessionData: Stripe.Checkout.Session,
  req: NextRequest,
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

  // Find the owner (User or Organization)
  const owner = await findPaymentOwner(customerId);

  if (!owner) {
    logger.error(
      `No user or organization found for customer ID: ${customerId}`,
    );
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

  // Handle based on owner type
  if (owner.type === "user") {
    // NEW SYSTEM: Create/Update UserSubscription
    await handleUserSubscription(
      owner.id,
      customerId,
      subscriptionId,
      stripeSubscription,
      plan,
      req,
    );
  } else {
    // LEGACY SYSTEM: Create/Update Organization Subscription
    await handleOrganizationSubscription(
      owner.id,
      customerId,
      subscriptionId,
      stripeSubscription,
      plan,
      req,
    );
  }
};

async function handleUserSubscription(
  userId: string,
  customerId: string,
  subscriptionId: string,
  stripeSubscription: Stripe.Subscription,
  plan: (typeof AUTH_PLANS)[0],
  _req: NextRequest,
) {
  const existingSubscription = await prisma.userSubscription.findUnique({
    where: { userId },
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
        userId,
      },
    });
  }

  // Note: Skipping freeTrial callbacks for UserSubscription as they're designed for the legacy Organization system

  logger.info(
    `[NEW] UserSubscription created/updated for user: ${userId}, plan: ${plan.name}`,
  );
}

async function handleOrganizationSubscription(
  organizationId: string,
  customerId: string,
  subscriptionId: string,
  stripeSubscription: Stripe.Subscription,
  plan: (typeof AUTH_PLANS)[0],
  req: NextRequest,
) {
  // Create or update subscription (legacy system)
  const existingSubscription = await prisma.subscription.findFirst({
    where: { referenceId: organizationId },
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
    seats: stripeSubscription.items.data[0]?.quantity ?? 1,
  };

  let dbSubscription;
  if (existingSubscription) {
    dbSubscription = await prisma.subscription.update({
      where: { id: existingSubscription.id },
      data: subscriptionData,
    });
  } else {
    dbSubscription = await prisma.subscription.create({
      data: {
        id: `sub_${Date.now()}`,
        referenceId: organizationId,
        ...subscriptionData,
      },
    });
  }

  // Call onTrialStart if this is a trial subscription
  if (
    stripeSubscription.status === "trialing" &&
    plan.freeTrial?.onTrialStart
  ) {
    await plan.freeTrial.onTrialStart(dbSubscription, {
      req,
      organizationId,
      stripeCustomerId: customerId,
      subscriptionId: subscriptionId,
    });
  }

  logger.info(
    `[LEGACY] Subscription created/updated for organization: ${organizationId}, plan: ${plan.name}`,
  );
}

const customerSubscriptionUpdated = async (
  subscriptionData: Stripe.Subscription,
  req: NextRequest,
) => {
  const subscription = subscriptionData;
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  logger.info("Processing customer.subscription.updated:", subscription.id);

  // Get plan from subscription metadata
  const plan = getPlanFromSubscription(subscription);

  // Try NEW system first: UserSubscription
  const userSubscription = await prisma.userSubscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (userSubscription) {
    const planName = plan?.name ?? userSubscription.plan;

    await prisma.userSubscription.update({
      where: { id: userSubscription.id },
      data: {
        plan: planName,
        status: subscription.status,
        periodStart: new Date(
          subscription.items.data[0].current_period_start * 1000,
        ),
        periodEnd: new Date(
          subscription.items.data[0].current_period_end * 1000,
        ),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });

    // Note: Skipping freeTrial callbacks for UserSubscription as they're designed for the legacy Organization system

    logger.info(
      `[NEW] UserSubscription updated: ${subscription.id}, status: ${subscription.status}`,
    );
    return;
  }

  // LEGACY system: Organization Subscription
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) {
    logger.error(`Subscription not found in database: ${subscription.id}`);
    return;
  }

  const planName = plan?.name ?? dbSubscription.plan;

  const updatedSubscription = await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      plan: planName,
      status: subscription.status,
      periodStart: new Date(
        subscription.items.data[0].current_period_start * 1000,
      ),
      periodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      seats: subscription.items.data[0]?.quantity ?? dbSubscription.seats ?? 1,
    },
  });

  // Handle trial transitions
  if (plan?.freeTrial) {
    if (
      subscription.status === "active" &&
      dbSubscription.status === "trialing" &&
      plan.freeTrial.onTrialEnd
    ) {
      await plan.freeTrial.onTrialEnd(
        { subscription: updatedSubscription },
        {
          req,
          organizationId: updatedSubscription.referenceId,
          stripeCustomerId: customerId,
          subscriptionId: subscription.id,
        },
      );
    }

    if (
      subscription.status === "incomplete_expired" &&
      dbSubscription.status === "trialing" &&
      plan.freeTrial.onTrialExpired
    ) {
      await plan.freeTrial.onTrialExpired(updatedSubscription, {
        req,
        organizationId: updatedSubscription.referenceId,
        stripeCustomerId: customerId,
        subscriptionId: subscription.id,
      });
    }
  }

  logger.info(
    `[LEGACY] Subscription updated: ${subscription.id}, status: ${subscription.status}`,
  );
};

const customerSubscriptionDeleted = async (
  subscriptionData: Stripe.Subscription,
  req: NextRequest,
) => {
  const subscription = subscriptionData;
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  logger.info("Processing customer.subscription.deleted:", subscription.id);

  // Get plan from subscription metadata
  const plan = getPlanFromSubscription(subscription);

  // Try NEW system first: UserSubscription
  const userSubscription = await prisma.userSubscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (userSubscription) {
    await prisma.userSubscription.update({
      where: { id: userSubscription.id },
      data: {
        plan: "free",
        status: "canceled",
        cancelAtPeriodEnd: false,
        periodEnd: new Date(),
      },
    });

    // Note: Skipping onSubscriptionCanceled callback for UserSubscription as it's designed for the legacy Organization system

    logger.info(
      `[NEW] UserSubscription canceled and reverted to free: ${subscription.id}`,
    );
    return;
  }

  // LEGACY system: Organization Subscription
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) {
    logger.error(`Subscription not found in database: ${subscription.id}`);
    return;
  }

  const updatedSubscription = await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      plan: "free",
      status: "canceled",
      cancelAtPeriodEnd: false,
      periodEnd: new Date(),
    },
  });

  if (plan?.onSubscriptionCanceled) {
    await plan.onSubscriptionCanceled(updatedSubscription, {
      req,
      organizationId: updatedSubscription.referenceId,
      stripeCustomerId: customerId,
      subscriptionId: subscription.id,
    });
  }

  logger.info(
    `[LEGACY] Subscription canceled and reverted to free plan: ${subscription.id}`,
  );
};
