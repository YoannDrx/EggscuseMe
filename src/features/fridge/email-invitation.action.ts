"use server";

import { InvitationStatus } from "@/generated/prisma";
import { action, authAction } from "@/lib/actions/safe-actions";
import { ActionError } from "@/lib/errors/action-error";
import {
  canModifyFridge,
  getOrCreateFridge,
} from "@/lib/fridge/get-fridge-access";
import { sendEmail } from "@/lib/mail/send-email";
import { prisma } from "@/lib/prisma";
import FridgeInvitationEmail from "@email/fridge-invitation.email";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  AcceptEmailInvitationSchema,
  CancelEmailInvitationSchema,
  CreateEmailInvitationSchema,
  ResendEmailInvitationSchema,
} from "./fridge.schema";

// Helper to add days to a date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const INVITATION_EXPIRY_DAYS = 7;
const RESEND_COOLDOWN_MINUTES = 5;

/**
 * Create and send an email invitation
 * Only the fridge owner can create invitations
 */
export const createEmailInvitationAction = authAction
  .inputSchema(CreateEmailInvitationSchema)
  .action(async ({ parsedInput: { email }, ctx: { user } }) => {
    const { fridge, role } = await getOrCreateFridge(user);

    // Only owner can create invitations
    if (!canModifyFridge(role)) {
      throw new ActionError(
        "Seul le proprietaire du frigo peut inviter des personnes.",
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user is inviting themselves
    if (fridge.owner.email.toLowerCase() === normalizedEmail) {
      throw new ActionError("Vous ne pouvez pas vous inviter vous-meme.");
    }

    // Check if user is already a member
    const existingMember = await prisma.fridgeMember.findFirst({
      where: {
        fridgeId: fridge.id,
        user: { email: normalizedEmail },
      },
    });

    if (existingMember) {
      throw new ActionError("Cette personne est deja membre de votre frigo.");
    }

    // Check if a pending invitation already exists
    const existingInvitation = await prisma.fridgeEmailInvitation.findFirst({
      where: {
        fridgeId: fridge.id,
        email: normalizedEmail,
        status: InvitationStatus.PENDING,
      },
    });

    if (existingInvitation) {
      throw new ActionError(
        "Une invitation est deja en attente pour cet email. Vous pouvez la renvoyer.",
      );
    }

    // Create the invitation
    const expiresAt = addDays(new Date(), INVITATION_EXPIRY_DAYS);
    const invitation = await prisma.fridgeEmailInvitation.create({
      data: {
        id: nanoid(11),
        token: nanoid(32),
        fridgeId: fridge.id,
        invitedById: user.id,
        email: normalizedEmail,
        expiresAt,
      },
      include: {
        fridge: true,
        invitedBy: { select: { name: true } },
      },
    });

    // Send the invitation email
    await sendEmail({
      to: normalizedEmail,
      subject: `${user.name} vous invite a rejoindre son frigo sur EggscuseMe`,
      html: FridgeInvitationEmail({
        inviterName: user.name,
        fridgeName: invitation.fridge.name,
        inviteToken: invitation.token,
        expiresAt,
      }),
    });

    revalidatePath("/fridge/settings/sharing");
    return { invitation };
  });

/**
 * Get invitation info by token (public - for accept page)
 */
export const getEmailInvitationByTokenAction = action
  .inputSchema(z.object({ token: z.string() }))
  .action(async ({ parsedInput: { token } }) => {
    const invitation = await prisma.fridgeEmailInvitation.findUnique({
      where: { token },
      include: {
        fridge: {
          include: {
            owner: { select: { name: true, image: true } },
          },
        },
        invitedBy: { select: { name: true, image: true } },
      },
    });

    if (!invitation) {
      return { error: "Invitation introuvable.", invitation: null };
    }

    if (invitation.status === InvitationStatus.CANCELLED) {
      return { error: "Cette invitation a ete annulee.", invitation: null };
    }

    if (invitation.status === InvitationStatus.ACCEPTED) {
      return {
        error: "Cette invitation a deja ete acceptee.",
        invitation: null,
      };
    }

    if (invitation.expiresAt < new Date()) {
      // Update status if expired
      await prisma.fridgeEmailInvitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.EXPIRED },
      });
      return { error: "Cette invitation a expire.", invitation: null };
    }

    return {
      error: null,
      invitation: {
        token: invitation.token,
        email: invitation.email,
        fridgeName: invitation.fridge.name,
        inviterName: invitation.invitedBy.name,
        inviterImage: invitation.invitedBy.image,
        expiresAt: invitation.expiresAt,
      },
    };
  });

/**
 * Accept an email invitation
 * Requires authentication
 */
export const acceptEmailInvitationAction = authAction
  .inputSchema(AcceptEmailInvitationSchema)
  .action(async ({ parsedInput: { token }, ctx: { user } }) => {
    const invitation = await prisma.fridgeEmailInvitation.findUnique({
      where: { token },
      include: { fridge: true },
    });

    if (!invitation) {
      throw new ActionError("Invitation introuvable.");
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new ActionError("Cette invitation n'est plus valide.");
    }

    if (invitation.expiresAt < new Date()) {
      await prisma.fridgeEmailInvitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.EXPIRED },
      });
      throw new ActionError("Cette invitation a expire.");
    }

    // Check if user is already the owner
    if (invitation.fridge.ownerId === user.id) {
      throw new ActionError("Vous etes deja le proprietaire de ce frigo.");
    }

    // Check if user is already a member
    const existingMembership = await prisma.fridgeMember.findUnique({
      where: {
        fridgeId_userId: {
          fridgeId: invitation.fridgeId,
          userId: user.id,
        },
      },
    });

    if (existingMembership) {
      // Mark invitation as accepted anyway
      await prisma.fridgeEmailInvitation.update({
        where: { id: invitation.id },
        data: {
          status: InvitationStatus.ACCEPTED,
          acceptedById: user.id,
          acceptedAt: new Date(),
        },
      });
      throw new ActionError("Vous etes deja membre de ce frigo.");
    }

    // Add user as member and mark invitation as accepted
    await prisma.$transaction([
      prisma.fridgeMember.create({
        data: {
          id: nanoid(11),
          fridgeId: invitation.fridgeId,
          userId: user.id,
          role: "GUEST",
        },
      }),
      prisma.fridgeEmailInvitation.update({
        where: { id: invitation.id },
        data: {
          status: InvitationStatus.ACCEPTED,
          acceptedById: user.id,
          acceptedAt: new Date(),
        },
      }),
    ]);

    return {
      success: true,
      fridgeName: invitation.fridge.name,
    };
  });

/**
 * Get all email invitations for the user's fridge
 * Only the owner can see invitations
 */
export const getEmailInvitationsAction = authAction.action(
  async ({ ctx: { user } }) => {
    const { fridge, role } = await getOrCreateFridge(user);

    // Only owner can see invitations
    if (!canModifyFridge(role)) {
      return { invitations: [] };
    }

    // Update expired invitations
    await prisma.fridgeEmailInvitation.updateMany({
      where: {
        fridgeId: fridge.id,
        status: InvitationStatus.PENDING,
        expiresAt: { lt: new Date() },
      },
      data: { status: InvitationStatus.EXPIRED },
    });

    const invitations = await prisma.fridgeEmailInvitation.findMany({
      where: { fridgeId: fridge.id },
      include: {
        acceptedBy: { select: { name: true, email: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return { invitations };
  },
);

/**
 * Cancel an email invitation
 * Only the owner can cancel invitations
 */
export const cancelEmailInvitationAction = authAction
  .inputSchema(CancelEmailInvitationSchema)
  .action(async ({ parsedInput: { invitationId }, ctx: { user } }) => {
    const { fridge, role } = await getOrCreateFridge(user);

    if (!canModifyFridge(role)) {
      throw new ActionError(
        "Seul le proprietaire du frigo peut annuler les invitations.",
      );
    }

    const invitation = await prisma.fridgeEmailInvitation.findFirst({
      where: {
        id: invitationId,
        fridgeId: fridge.id,
        status: InvitationStatus.PENDING,
      },
    });

    if (!invitation) {
      throw new ActionError("Invitation introuvable ou deja traitee.");
    }

    await prisma.fridgeEmailInvitation.update({
      where: { id: invitationId },
      data: { status: InvitationStatus.CANCELLED },
    });

    revalidatePath("/fridge/settings/sharing");
    return { success: true };
  });

/**
 * Resend an email invitation
 * Only the owner can resend invitations
 * Has a cooldown of 5 minutes
 */
export const resendEmailInvitationAction = authAction
  .inputSchema(ResendEmailInvitationSchema)
  .action(async ({ parsedInput: { invitationId }, ctx: { user } }) => {
    const { fridge, role } = await getOrCreateFridge(user);

    if (!canModifyFridge(role)) {
      throw new ActionError(
        "Seul le proprietaire du frigo peut renvoyer les invitations.",
      );
    }

    const invitation = await prisma.fridgeEmailInvitation.findFirst({
      where: {
        id: invitationId,
        fridgeId: fridge.id,
        status: InvitationStatus.PENDING,
      },
      include: {
        fridge: true,
        invitedBy: { select: { name: true } },
      },
    });

    if (!invitation) {
      throw new ActionError("Invitation introuvable ou deja traitee.");
    }

    // Check cooldown (no more than one email every 5 minutes)
    const cooldownTime = new Date(
      Date.now() - RESEND_COOLDOWN_MINUTES * 60 * 1000,
    );
    if (invitation.lastSentAt > cooldownTime) {
      throw new ActionError(
        `Veuillez attendre ${RESEND_COOLDOWN_MINUTES} minutes avant de renvoyer l'email.`,
      );
    }

    // Extend expiration and update lastSentAt
    const newExpiresAt = addDays(new Date(), INVITATION_EXPIRY_DAYS);
    await prisma.fridgeEmailInvitation.update({
      where: { id: invitationId },
      data: {
        expiresAt: newExpiresAt,
        lastSentAt: new Date(),
      },
    });

    // Resend the email
    await sendEmail({
      to: invitation.email,
      subject: `Rappel : ${user.name} vous invite a rejoindre son frigo sur EggscuseMe`,
      html: FridgeInvitationEmail({
        inviterName: user.name,
        fridgeName: invitation.fridge.name,
        inviteToken: invitation.token,
        expiresAt: newExpiresAt,
      }),
    });

    revalidatePath("/fridge/settings/sharing");
    return { success: true };
  });
