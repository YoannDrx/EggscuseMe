import Stripe from "stripe";
import { env } from "./env";

// Stripe client - uses a proxy that throws if used without configuration
// This allows the build to pass while preventing runtime errors from being silent
const createStripeProxy = (): Stripe => {
  return new Proxy({} as Stripe, {
    get(_, prop) {
      throw new Error(
        `Stripe is not configured. Set STRIPE_SECRET_KEY environment variable. Attempted to access: ${String(prop)}`,
      );
    },
  });
};

export const stripe: Stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, {
      typescript: true,
    })
  : createStripeProxy();
