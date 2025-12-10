import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin, emailOTP, lastLoginMethod } from "better-auth/plugins";

import { sendEmail } from "@/lib/mail/send-email";
import { SiteConfig } from "@/site-config";
import ChangeEmailEmail from "@email/change-email.email";
import DeleteAccountEmail from "@email/delete-account.email";
import EmailVerificationEmail from "@email/email-verification.email";
import OtpSigninEmail from "@email/otp-signin.email";
import ResetPasswordEmail from "@email/reset-password.email";
import { setupResendCustomer } from "./auth/auth-config-setup";
import { env } from "./env";
import { logger } from "./logger";
import { prisma } from "./prisma";
import { getServerUrl } from "./server-url";
import { stripe } from "./stripe";
type SocialProvidersType = Parameters<typeof betterAuth>[0]["socialProviders"];

export const SocialProviders: SocialProvidersType = {};

if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  SocialProviders.github = {
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
  };
}

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  SocialProviders.google = {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    // Refresh local profile (name/image) from Google on every sign-in
    overrideUserInfoOnSignIn: true,
  };
}

// Determine if we should use secure cookies
// In CI, we run on http://localhost with NODE_ENV=production
// Secure cookies don't work on HTTP, so we disable them in CI
const useSecureCookies = env.CI ? false : env.NODE_ENV === "production";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: getServerUrl(),
  session: {
    expiresIn: 60 * 60 * 24 * 20, // 20 days
    updateAge: 60 * 60 * 24 * 7, // Refresh session every 7 days
    cookieCache: {
      enabled: false, // Disable cache to keep provider profile changes (avatar) in sync
      maxAge: 5 * 60,
    },
  },
  rateLimit: {
    // Disable rate limiting in CI
    enabled: env.CI ? false : undefined,
  },
  trustedOrigins: ["*"],
  databaseHooks: {
    user: {
      create: {
        after: async (user, _req) => {
          await setupResendCustomer(user);

          // NEW SYSTEM: Create Fridge for user
          try {
            await prisma.fridge.create({
              data: {
                ownerId: user.id,
                name: "Mon Frigo",
              },
            });
            logger.debug("Fridge created for user", { userId: user.id });
          } catch (err) {
            logger.error("Failed to create fridge", { err, userId: user.id });
          }

          // Create default user preferences (notifications, etc.)
          try {
            await prisma.userPreferences.create({
              data: {
                userId: user.id,
                notifyEnabled: true,
                notifyDaysBefore: 3, // Notify 3 days before expiration
              },
            });
            logger.debug("User preferences created", { userId: user.id });
          } catch (err) {
            logger.error("Failed to create user preferences", {
              err,
              userId: user.id,
            });
          }

          // NEW SYSTEM: Create Stripe customer on User (if Stripe is configured)
          if (env.STRIPE_SECRET_KEY) {
            try {
              const stripeCustomer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                  userId: user.id,
                },
              });
              await prisma.user.update({
                where: { id: user.id },
                data: { stripeCustomerId: stripeCustomer.id },
              });
              logger.debug("Stripe customer created for user", {
                userId: user.id,
              });
            } catch (err) {
              logger.error("Failed to create Stripe customer", {
                err,
                userId: user.id,
              });
            }
          }
        },
      },
    },
  },
  advanced: {
    cookiePrefix: SiteConfig.appId,
    // Disable secure cookies in CI (http://localhost with NODE_ENV=production)
    useSecureCookies,
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: `Reinitialisation de votre mot de passe - ${SiteConfig.title}`,
        html: ResetPasswordEmail({ user, url }),
      });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        await sendEmail({
          to: newEmail,
          subject: `Confirmez votre nouvelle adresse email - ${SiteConfig.title}`,
          html: ChangeEmailEmail({ newEmail, url }),
        });
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, token }) => {
        const url = `${getServerUrl()}/auth/confirm-delete?token=${token}&callbackUrl=/auth/goodbye`;
        await sendEmail({
          to: user.email,
          subject: `Confirmation de suppression de compte - ${SiteConfig.title}`,
          html: DeleteAccountEmail({ user, url }),
        });
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: `Bienvenue sur ${SiteConfig.title} ! Verifiez votre email`,
        html: EmailVerificationEmail({ user, url }),
      });
    },
  },
  socialProviders: SocialProviders,
  plugins: [
    emailOTP({
      sendVerificationOTP: async ({ email, otp }) => {
        logger.debug("Sending OTP", { email, otp });
        const autoLoginUrl = `${getServerUrl()}/auth/signin/otp?email=${email}&otp=${otp}`;
        await sendEmail({
          to: email,
          subject: `${otp} - Votre code de connexion ${SiteConfig.title}`,
          html: OtpSigninEmail({ email, otp, autoLoginUrl }),
        });
      },
    }),
    admin({}),
    lastLoginMethod({}),
    // Warning: always last plugin
    nextCookies(),
  ],
});
