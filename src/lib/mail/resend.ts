import { Resend } from "resend";
import { env } from "../env";
import type { MailAdapter } from "./send-email";
import { logger } from "../logger";

export const resend: Resend | null = env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : null;

export const resendMailAdapter: MailAdapter = {
  send: async (params) => {
    if (!resend) {
      const error = new Error(
        "Email delivery is unavailable because Resend is not configured.",
      );
      logger.error("[Resend] Email delivery is not configured", {
        subject: params.subject,
      });
      return { error, data: null };
    }

    try {
      const result = await resend.emails.send(params);

      if (result.error) {
        return { error: new Error(result.error.message), data: null };
      }

      if (!result.data.id) {
        return {
          error: new Error("Resend did not return a delivery identifier."),
          data: null,
        };
      }

      return { error: null, data: { id: result.data.id } };
    } catch (cause) {
      return {
        error:
          cause instanceof Error
            ? cause
            : new Error("Resend email delivery failed."),
        data: null,
      };
    }
  },
};
