"use server";

import { action } from "@/lib/actions/safe-actions";
import { ActionError } from "@/lib/errors/action-error";
import { env } from "@/lib/env";
import { sendEmailOrThrow } from "@/lib/mail/send-email";
import { ContactSupportSchema } from "./contact-support.schema";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export const contactSupportAction = action
  .inputSchema(ContactSupportSchema)
  .action(async ({ parsedInput: { email, subject, message } }) => {
    const escapedMessage = escapeHtml(message).replaceAll("\n", "<br />");

    try {
      await sendEmailOrThrow({
        to: env.NEXT_PUBLIC_EMAIL_CONTACT ?? "contact@eggscuseme.app",
        subject: `Support needed from ${email} - ${subject}`,
        text: message,
        html: `<p>${escapedMessage}</p>`,
        replyTo: email,
      });
    } catch {
      throw new ActionError(
        "Le message n'a pas pu etre envoye. Reessayez dans quelques instants.",
      );
    }

    return { message: "Your message has been sent to support." };
  });
