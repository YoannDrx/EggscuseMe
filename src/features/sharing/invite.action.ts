"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { ActionError } from "@/lib/errors/action-error";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

const CreateInviteInputSchema = z.object({
  maxUses: z.number().min(1).max(100).default(5),
  expiresInDays: z.number().min(1).max(30).default(7),
});

/**
 * Create an invite link to share the user's fridge
 */
export const createInviteAction = authAction
  .inputSchema(CreateInviteInputSchema)
  .action(async ({ parsedInput: data, ctx: { user } }) => {
    const t = await getTranslations("errors.sharing");
    // Get user's fridge
    const fridge = await prisma.fridge.findFirst({
      where: { ownerId: user.id },
    });

    if (!fridge) {
      throw new ActionError(t("noFridgeToShare"));
    }

    // Create a new share link
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + data.expiresInDays);

    const invite = await prisma.fridgeShareLink.create({
      data: {
        fridgeId: fridge.id,
        createdById: user.id,
        maxUses: data.maxUses,
        expiresAt,
      },
    });

    return { invite };
  });

const AcceptInviteInputSchema = z.object({
  code: z.string().min(1),
});

/**
 * Accept an invite and join a fridge as a guest
 */
export const acceptInviteAction = authAction
  .inputSchema(AcceptInviteInputSchema)
  .action(async ({ parsedInput: { code }, ctx: { user } }) => {
    const t = await getTranslations("errors.sharing");
    // Find the share link
    const shareLink = await prisma.fridgeShareLink.findFirst({
      where: {
        code,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
      include: {
        fridge: true,
      },
    });

    if (!shareLink) {
      throw new ActionError(t("invalidOrExpired"));
    }

    if (shareLink.usedCount >= shareLink.maxUses) {
      throw new ActionError(t("maxUsesReached"));
    }

    // Check if user is already a member
    const existingMembership = await prisma.fridgeMember.findFirst({
      where: {
        fridgeId: shareLink.fridgeId,
        userId: user.id,
      },
    });

    if (existingMembership) {
      throw new ActionError(t("alreadyMember"));
    }

    // Check if user is the owner
    if (shareLink.fridge.ownerId === user.id) {
      throw new ActionError(t("alreadyOwner"));
    }

    // Add user as guest and increment usage count
    await prisma.$transaction([
      prisma.fridgeMember.create({
        data: {
          fridgeId: shareLink.fridgeId,
          userId: user.id,
          role: "GUEST",
        },
      }),
      prisma.fridgeShareLink.update({
        where: { id: shareLink.id },
        data: {
          usedCount: { increment: 1 },
        },
      }),
    ]);

    return { fridge: shareLink.fridge };
  });

/**
 * Get invite by code (for preview before accepting)
 */
export async function getInviteByCode(code: string) {
  const shareLink = await prisma.fridgeShareLink.findFirst({
    where: {
      code,
      isActive: true,
      expiresAt: { gt: new Date() },
    },
    include: {
      fridge: {
        select: {
          id: true,
          name: true,
          owner: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!shareLink || shareLink.usedCount >= shareLink.maxUses) {
    return null;
  }

  return {
    code: shareLink.code,
    fridge: shareLink.fridge,
    expiresAt: shareLink.expiresAt,
  };
}
