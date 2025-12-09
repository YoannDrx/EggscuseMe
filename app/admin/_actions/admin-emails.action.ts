"use server";

import { AdminLogAction } from "@/generated/prisma";
import { adminAction } from "@/lib/actions/safe-actions";
import { sendEmail } from "@/lib/mail/send-email";
import { prisma } from "@/lib/prisma";
import ExpirationWarningEmail from "@email/expiration-warning.email";
import FridgeInvitationEmail from "@email/fridge-invitation.email";
import MarkdownEmail from "@email/markdown.email";
import { z } from "zod";

const SendFridgeInvitationTestSchema = z.object({
  to: z.string().email(),
  inviterName: z.string().min(1),
  fridgeName: z.string().min(1),
});

export const sendTestFridgeInvitationAction = adminAction
  .inputSchema(SendFridgeInvitationTestSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await sendEmail({
      to: parsedInput.to,
      subject: `[TEST] ${parsedInput.inviterName} vous invite sur EggscuseMe`,
      html: FridgeInvitationEmail({
        inviterName: parsedInput.inviterName,
        fridgeName: parsedInput.fridgeName,
        inviteToken: "test-token-preview-12345",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }),
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    await prisma.adminLog.create({
      data: {
        adminId: user.id,
        action: AdminLogAction.SEND_TEST_EMAIL,
        metadata: {
          template: "fridge-invitation",
          to: parsedInput.to,
          emailId: result.data.id,
        },
      },
    });

    return { success: true };
  });

const SendExpirationWarningTestSchema = z.object({
  to: z.string().email(),
  userName: z.string().min(1),
  fridgeName: z.string().min(1),
});

export const sendTestExpirationWarningAction = adminAction
  .inputSchema(SendExpirationWarningTestSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await sendEmail({
      to: parsedInput.to,
      subject: `[TEST] Alerte Fraicheur - ${parsedInput.fridgeName}`,
      html: ExpirationWarningEmail({
        userName: parsedInput.userName,
        fridgeName: parsedInput.fridgeName,
        eggs: [
          { name: "Ferme du Coin", daysLeft: 2, quantity: 4 },
          { name: "Marche bio", daysLeft: 3, quantity: 6 },
          { name: "Oeufs plein air", daysLeft: 1, quantity: 2 },
        ],
      }),
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    await prisma.adminLog.create({
      data: {
        adminId: user.id,
        action: AdminLogAction.SEND_TEST_EMAIL,
        metadata: {
          template: "expiration-warning",
          to: parsedInput.to,
          emailId: result.data.id,
        },
      },
    });

    return { success: true };
  });

const SendMarkdownTestSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  markdown: z.string().min(1),
  preview: z.string().optional(),
});

export const sendTestMarkdownAction = adminAction
  .inputSchema(SendMarkdownTestSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await sendEmail({
      to: parsedInput.to,
      subject: `[TEST] ${parsedInput.subject}`,
      html: MarkdownEmail({
        markdown: parsedInput.markdown,
        preview: parsedInput.preview,
      }),
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    await prisma.adminLog.create({
      data: {
        adminId: user.id,
        action: AdminLogAction.SEND_TEST_EMAIL,
        metadata: {
          template: "markdown",
          to: parsedInput.to,
          subject: parsedInput.subject,
          emailId: result.data.id,
        },
      },
    });

    return { success: true };
  });

// Liste des templates disponibles
export const getEmailTemplatesAction = adminAction.action(async () => {
  return {
    templates: [
      {
        id: "fridge-invitation",
        name: "Invitation au frigo",
        description:
          "Email envoye quand un utilisateur invite quelqu'un a rejoindre son frigo",
        fields: [
          { name: "inviterName", label: "Nom de l'inviteur", type: "text" },
          { name: "fridgeName", label: "Nom du frigo", type: "text" },
        ],
      },
      {
        id: "expiration-warning",
        name: "Alerte expiration",
        description:
          "Email envoye quand des oeufs arrivent bientot a expiration",
        fields: [
          { name: "userName", label: "Nom de l'utilisateur", type: "text" },
          { name: "fridgeName", label: "Nom du frigo", type: "text" },
        ],
      },
      {
        id: "markdown",
        name: "Email Markdown",
        description: "Email generique avec contenu en Markdown",
        fields: [
          { name: "subject", label: "Sujet", type: "text" },
          { name: "markdown", label: "Contenu (Markdown)", type: "textarea" },
          { name: "preview", label: "Preview (optionnel)", type: "text" },
        ],
      },
    ],
  };
});
