"use server";

import { action } from "@/lib/actions/safe-actions";
import { getUser } from "@/lib/auth/auth-user";
import { ActionError } from "@/lib/errors/action-error";
import { env } from "@/lib/env";
import { sendEmailOrThrow } from "@/lib/mail/send-email";
import { prisma } from "@/lib/prisma";
import { ContactFeedbackSchema } from "./contact-feedback.schema";

export const feedbackAction = action
  .inputSchema(ContactFeedbackSchema)
  .action(async ({ parsedInput: data }) => {
    const user = await getUser();

    const email = user?.email ?? data.email;

    const feedback = await prisma.feedback.create({
      data: {
        message: data.message,
        review: Number(data.review) || 0,
        userId: user?.id,
        email,
      },
    });

    try {
      await sendEmailOrThrow({
        to: env.NEXT_PUBLIC_EMAIL_CONTACT,
        subject: `New feedback from ${email}`,
        text: `Review: ${feedback.review}\n\nMessage: ${feedback.message}`,
        replyTo: email,
      });
    } catch {
      throw new ActionError(
        "Votre avis a ete enregistre, mais l'envoi a echoue. Reessayez plus tard.",
      );
    }

    return { message: "Your feedback has been sent to support." };
  });
