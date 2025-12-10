"use server";

import { AdminLogAction } from "@/generated/prisma";
import { adminAction } from "@/lib/actions/safe-actions";
import { sendEmail } from "@/lib/mail/send-email";
import { prisma } from "@/lib/prisma";
import { getServerUrl } from "@/lib/server-url";
import ChangeEmailEmail from "@email/change-email.email";
import DeleteAccountEmail from "@email/delete-account.email";
import EmailVerificationEmail from "@email/email-verification.email";
import ExpirationWarningEmail from "@email/expiration-warning.email";
import FridgeInvitationEmail from "@email/fridge-invitation.email";
import MarkdownEmail from "@email/markdown.email";
import OtpSigninEmail from "@email/otp-signin.email";
import ResetPasswordEmail from "@email/reset-password.email";
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

// ============================================
// Actions pour les templates d'authentification
// ============================================

const SendOtpSigninTestSchema = z.object({
  to: z.string().email(),
  email: z.string().email(),
});

export const sendTestOtpSigninAction = adminAction
  .inputSchema(SendOtpSigninTestSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const testOtp = "123456";
    const autoLoginUrl = `${getServerUrl()}/auth/signin/otp?email=${parsedInput.email}&otp=${testOtp}`;

    const result = await sendEmail({
      to: parsedInput.to,
      subject: `[TEST] ${testOtp} - Code de connexion EggscuseMe`,
      html: OtpSigninEmail({
        email: parsedInput.email,
        otp: testOtp,
        autoLoginUrl,
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
          template: "otp-signin",
          to: parsedInput.to,
          emailId: result.data.id,
        },
      },
    });

    return { success: true };
  });

const SendResetPasswordTestSchema = z.object({
  to: z.string().email(),
  userName: z.string().min(1),
});

export const sendTestResetPasswordAction = adminAction
  .inputSchema(SendResetPasswordTestSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await sendEmail({
      to: parsedInput.to,
      subject: `[TEST] Reinitialisation de mot de passe - EggscuseMe`,
      html: ResetPasswordEmail({
        user: { name: parsedInput.userName, email: parsedInput.to },
        url: `${getServerUrl()}/auth/reset-password?token=test-token-12345`,
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
          template: "reset-password",
          to: parsedInput.to,
          emailId: result.data.id,
        },
      },
    });

    return { success: true };
  });

const SendChangeEmailTestSchema = z.object({
  to: z.string().email(),
  newEmail: z.string().email(),
});

export const sendTestChangeEmailAction = adminAction
  .inputSchema(SendChangeEmailTestSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await sendEmail({
      to: parsedInput.to,
      subject: `[TEST] Confirmez votre nouvelle adresse email - EggscuseMe`,
      html: ChangeEmailEmail({
        newEmail: parsedInput.newEmail,
        url: `${getServerUrl()}/auth/verify-email?token=test-token-12345`,
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
          template: "change-email",
          to: parsedInput.to,
          emailId: result.data.id,
        },
      },
    });

    return { success: true };
  });

const SendDeleteAccountTestSchema = z.object({
  to: z.string().email(),
  userName: z.string().min(1),
});

export const sendTestDeleteAccountAction = adminAction
  .inputSchema(SendDeleteAccountTestSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await sendEmail({
      to: parsedInput.to,
      subject: `[TEST] Confirmation de suppression de compte - EggscuseMe`,
      html: DeleteAccountEmail({
        user: { name: parsedInput.userName, email: parsedInput.to },
        url: `${getServerUrl()}/auth/confirm-delete?token=test-token-12345`,
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
          template: "delete-account",
          to: parsedInput.to,
          emailId: result.data.id,
        },
      },
    });

    return { success: true };
  });

const SendEmailVerificationTestSchema = z.object({
  to: z.string().email(),
  userName: z.string().min(1),
});

export const sendTestEmailVerificationAction = adminAction
  .inputSchema(SendEmailVerificationTestSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const result = await sendEmail({
      to: parsedInput.to,
      subject: `[TEST] Bienvenue sur EggscuseMe ! Verifiez votre email`,
      html: EmailVerificationEmail({
        user: { name: parsedInput.userName, email: parsedInput.to },
        url: `${getServerUrl()}/auth/verify-email?token=test-token-12345`,
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
          template: "email-verification",
          to: parsedInput.to,
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
