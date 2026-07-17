import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * This is the schema for the environment variables.
 *
 * Please import **this** file and use the `env` variable
 */
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
    OPENAI_VISION_MODEL: z.string().optional(),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
    GOOGLE_VISION_MODEL: z.string().optional(),
    AI_SCAN_PROVIDER: z.enum(["auto", "openai", "google"]).optional(),
    BLOB_READ_WRITE_TOKEN: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    RESEND_AUDIENCE_ID: z.string().optional(),
    EMAIL_FROM: z
      .string()
      .optional()
      .default("EggscuseMe <contact@do-not-reply.app>"),
    STRIPE_SECRET_KEY: z.string().optional(),
    NODE_ENV: z.enum(["development", "production", "test"]),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    CI: z.coerce.boolean().optional(),
    CRON_SECRET: z.string().optional(),
  },
  /**
   * If you add `client` environment variables, you need to add them to
   * `experimental__runtimeEnv` as well.
   */
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    NEXT_PUBLIC_EMAIL_CONTACT: z
      .string()
      .optional()
      .default("hello@eggscuseme.app"),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_EMAIL_CONTACT: process.env.NEXT_PUBLIC_EMAIL_CONTACT,
  },
});
