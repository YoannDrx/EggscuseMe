"use server";

import { authAction, orgAction } from "@/lib/actions/safe-actions";
import { ActionError } from "@/lib/errors/action-error";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  AcceptInviteSchema,
  CreateInviteSchema,
  DeactivateInviteSchema,
} from "./invite.schema";

/**
 * Create a new invite link for the current organization
 */
export const createInviteAction = orgAction
  .metadata({})
  .inputSchema(CreateInviteSchema)
  .action(async ({ parsedInput: data, ctx: { org } }) => {
    // Check if user has permission to invite (owner or admin)
    if (org.user.role !== "owner" && org.user.role !== "admin") {
      throw new ActionError(
        "Vous devez être propriétaire ou admin pour créer des invitations.",
      );
    }

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + data.expiresInDays);

    const invite = await prisma.fridgeInvite.create({
      data: {
        organizationId: org.id,
        createdById: org.user.id,
        maxUses: data.maxUses,
        expiresAt,
      },
    });

    revalidatePath(`/orgs/${org.slug}`);
    return { invite };
  });

/**
 * Get all active invites for the current organization
 */
export const getInvitesAction = orgAction
  .metadata({})
  .action(async ({ ctx: { org } }) => {
    const invites = await prisma.fridgeInvite.findMany({
      where: {
        organizationId: org.id,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { invites };
  });

/**
 * Deactivate an invite link
 */
export const deactivateInviteAction = orgAction
  .metadata({})
  .inputSchema(DeactivateInviteSchema)
  .action(async ({ parsedInput: { id }, ctx: { org } }) => {
    const invite = await prisma.fridgeInvite.findFirst({
      where: {
        id,
        organizationId: org.id,
      },
    });

    if (!invite) {
      throw new ActionError("Invitation non trouvée.");
    }

    await prisma.fridgeInvite.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath(`/orgs/${org.slug}`);
    return { success: true };
  });

/**
 * Get invite details by code (public, no auth required)
 */
export async function getInviteByCode(code: string) {
  const invite = await prisma.fridgeInvite.findUnique({
    where: { code },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
        },
      },
    },
  });

  if (!invite) {
    return { error: "Invitation non trouvée." };
  }

  if (!invite.isActive) {
    return { error: "Cette invitation a été désactivée." };
  }

  if (invite.expiresAt < new Date()) {
    return { error: "Cette invitation a expiré." };
  }

  if (invite.usedCount >= invite.maxUses) {
    return {
      error: "Cette invitation a atteint son nombre maximum d'utilisations.",
    };
  }

  return { invite };
}

/**
 * Accept an invite and join the organization
 */
export const acceptInviteAction = authAction
  .inputSchema(AcceptInviteSchema)
  .action(async ({ parsedInput: { code }, ctx: { user } }) => {
    const invite = await prisma.fridgeInvite.findUnique({
      where: { code },
      include: {
        organization: true,
      },
    });

    if (!invite) {
      throw new ActionError("Invitation non trouvée.");
    }

    if (!invite.isActive) {
      throw new ActionError("Cette invitation a été désactivée.");
    }

    if (invite.expiresAt < new Date()) {
      throw new ActionError("Cette invitation a expiré.");
    }

    if (invite.usedCount >= invite.maxUses) {
      throw new ActionError(
        "Cette invitation a atteint son nombre maximum d'utilisations.",
      );
    }

    // Check if user is already a member
    const existingMember = await prisma.member.findFirst({
      where: {
        userId: user.id,
        organizationId: invite.organizationId,
      },
    });

    if (existingMember) {
      return {
        success: true,
        alreadyMember: true,
        organization: invite.organization,
      };
    }

    // Add user as member and increment usage count
    await prisma.$transaction([
      prisma.member.create({
        data: {
          id: crypto.randomUUID(),
          organizationId: invite.organizationId,
          userId: user.id,
          role: "member",
          createdAt: new Date(),
        },
      }),
      prisma.fridgeInvite.update({
        where: { id: invite.id },
        data: {
          usedCount: { increment: 1 },
        },
      }),
    ]);

    return {
      success: true,
      alreadyMember: false,
      organization: invite.organization,
    };
  });
