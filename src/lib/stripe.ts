import Stripe from "stripe";
import { env } from "./env";

// Stripe client - only initialized if STRIPE_SECRET_KEY is provided
export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, {
      typescript: true,
    })
  : (null as unknown as Stripe);
