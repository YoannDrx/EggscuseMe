import { Resend } from "resend";
import { nanoid } from "nanoid";
import { env } from "../env";
import type { MailAdapter } from "./send-email";
import { logger } from "../logger";

// Resend client - uses a proxy that returns mock data if not configured
// This allows the build to pass and gracefully handles missing API key
const createResendProxy = (): Resend => {
  return new Proxy({} as Resend, {
    get(_, prop) {
      if (prop === "emails") {
        return {
          send: async () => {
            logger.warn("[Resend] Not configured, email not sent");
            return { data: { id: nanoid() }, error: null };
          },
        };
      }
      if (prop === "contacts") {
        return {
          create: async () => {
            logger.warn("[Resend] Not configured, contact not created");
            return { data: { id: nanoid() }, error: null };
          },
        };
      }
      return async () => {
        logger.warn(`[Resend] Not configured, ${String(prop)} not available`);
        return Promise.resolve({ data: null, error: null });
      };
    },
  });
};

export const resend: Resend = env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : createResendProxy();

export const resendMailAdapter: MailAdapter = {
  send: async (params) => {
    const result = await resend.emails.send(params);

    if (result.error) {
      return { error: new Error(result.error.message), data: null };
    }

    return { error: null, data: { id: result.data.id } };
  },
};
