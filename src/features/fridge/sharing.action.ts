"use server";

import { FridgeRole } from "@/generated/prisma";
import { action, authAction } from "@/lib/actions/safe-actions";
import { ActionError } from "@/lib/errors/action-error";
import {
  canModifyFridge,
  getOrCreateFridge,
} from "@/lib/fridge/get-fridge-access";
import { prisma } from "@/lib/prisma";
import { getServerUrl } from "@/lib/server-url";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";
import {
  AcceptShareLinkSchema,
  CreateShareLinkSchema,
  DeactivateShareLinkSchema,
  RemoveMemberSchema,
} from "./fridge.schema";

// Helper to add days to a date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Create a share link to invite guests to the fridge
 * Only the fridge owner can create share links
 */
export const createShareLinkAction = authAction
  .inputSchema(CreateShareLinkSchema)
  .action(async ({ parsedInput: data, ctx: { user } }) => {
    const t = await getTranslations("errors.sharing");
    const { fridge, role } = await getOrCreateFridge(user);

    // Only owner can create share links
    if (!canModifyFridge(role)) {
      throw new ActionError(t("ownerOnlyCreate"));
    }

    const shareLink = await prisma.fridgeShareLink.create({
      data: {
        id: nanoid(11),
        code: nanoid(8),
        fridgeId: fridge.id,
        createdById: user.id,
        expiresAt: addDays(new Date(), data.expiresInDays),
        maxUses: data.maxUses,
      },
    });

    const shareUrl = `${getServerUrl()}/join/${shareLink.code}`;

    revalidatePath("/fridge/settings/sharing");
    return { shareLink, shareUrl };
  });

/**
 * Get all share links for the user's fridge
 */
export const getShareLinksAction = authAction.action(
  async ({ ctx: { user } }) => {
    const { fridge, role } = await getOrCreateFridge(user);

    // Only owner can see share links
    if (!canModifyFridge(role)) {
      return { shareLinks: [] };
    }

    const shareLinks = await prisma.fridgeShareLink.findMany({
      where: { fridgeId: fridge.id },
      orderBy: { createdAt: "desc" },
    });

    return { shareLinks };
  },
);

/**
 * Deactivate a share link
 */
export const deactivateShareLinkAction = authAction
  .inputSchema(DeactivateShareLinkSchema)
  .action(async ({ parsedInput: { linkId }, ctx: { user } }) => {
    const t = await getTranslations("errors.sharing");
    const { fridge, role } = await getOrCreateFridge(user);

    if (!canModifyFridge(role)) {
      throw new ActionError(t("ownerOnlyDeactivate"));
    }

    const link = await prisma.fridgeShareLink.findFirst({
      where: {
        id: linkId,
        fridgeId: fridge.id,
      },
    });

    if (!link) {
      throw new ActionError(t("linkNotFound"));
    }

    await prisma.fridgeShareLink.update({
      where: { id: linkId },
      data: { isActive: false },
    });

    revalidatePath("/fridge/settings/sharing");
    return { success: true };
  });

/**
 * Get share link info by code (public - for join page)
 */
export const getShareLinkByCodeAction = action
  .inputSchema(z.object({ code: z.string() }))
  .action(async ({ parsedInput: { code } }) => {
    const t = await getTranslations("errors.sharing");
    const shareLink = await prisma.fridgeShareLink.findUnique({
      where: { code },
      include: {
        fridge: {
          include: {
            owner: {
              select: { name: true, image: true },
            },
          },
        },
      },
    });

    if (!shareLink) {
      return { error: t("invalidOrExpired"), shareLink: null };
    }

    if (!shareLink.isActive) {
      return { error: t("linkDisabled"), shareLink: null };
    }

    if (shareLink.expiresAt < new Date()) {
      return { error: t("linkExpired"), shareLink: null };
    }

    if (shareLink.usedCount >= shareLink.maxUses) {
      return {
        error: t("maxUsesReached"),
        shareLink: null,
      };
    }

    return {
      error: null,
      shareLink: {
        code: shareLink.code,
        fridgeName: shareLink.fridge.name,
        ownerName: shareLink.fridge.owner.name,
        ownerImage: shareLink.fridge.owner.image,
        expiresAt: shareLink.expiresAt,
        remainingUses: shareLink.maxUses - shareLink.usedCount,
      },
    };
  });

/**
 * Accept a share link and join the fridge as a guest
 */
export const acceptShareLinkAction = authAction
  .inputSchema(AcceptShareLinkSchema)
  .action(async ({ parsedInput: { code }, ctx: { user } }) => {
    const t = await getTranslations("errors.sharing");
    const shareLink = await prisma.fridgeShareLink.findUnique({
      where: { code },
      include: { fridge: true },
    });

    if (!shareLink) {
      throw new ActionError(t("invalidOrExpired"));
    }

    if (!shareLink.isActive) {
      throw new ActionError(t("linkDisabled"));
    }

    if (shareLink.expiresAt < new Date()) {
      throw new ActionError(t("linkExpired"));
    }

    if (shareLink.usedCount >= shareLink.maxUses) {
      throw new ActionError(t("maxUsesReached"));
    }

    // Check if user is already the owner
    if (shareLink.fridge.ownerId === user.id) {
      throw new ActionError(t("alreadyOwner"));
    }

    // Check if user is already a member
    const existingMembership = await prisma.fridgeMember.findUnique({
      where: {
        fridgeId_userId: {
          fridgeId: shareLink.fridgeId,
          userId: user.id,
        },
      },
    });

    if (existingMembership) {
      throw new ActionError(t("alreadyMember"));
    }

    // Add user as guest and increment usage count in transaction
    await prisma.$transaction([
      prisma.fridgeMember.create({
        data: {
          id: nanoid(11),
          fridgeId: shareLink.fridgeId,
          userId: user.id,
          role: FridgeRole.GUEST,
        },
      }),
      prisma.fridgeShareLink.update({
        where: { id: shareLink.id },
        data: { usedCount: { increment: 1 } },
      }),
    ]);

    return {
      success: true,
      fridgeName: shareLink.fridge.name,
    };
  });

/**
 * Get all members of the user's fridge (including owner)
 */
export const getFridgeMembersAction = authAction.action(
  async ({ ctx: { user } }) => {
    const { fridge, role } = await getOrCreateFridge(user);

    const members = await prisma.fridgeMember.findMany({
      where: { fridgeId: fridge.id },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return {
      owner: fridge.owner,
      members,
      isOwner: role === "OWNER",
    };
  },
);

/**
 * Remove a member from the fridge
 * Only the owner can remove members
 */
export const removeMemberAction = authAction
  .inputSchema(RemoveMemberSchema)
  .action(async ({ parsedInput: { memberId }, ctx: { user } }) => {
    const t = await getTranslations("errors.sharing");
    const { fridge, role } = await getOrCreateFridge(user);

    if (!canModifyFridge(role)) {
      throw new ActionError(t("ownerOnlyRemove"));
    }

    const member = await prisma.fridgeMember.findFirst({
      where: {
        id: memberId,
        fridgeId: fridge.id,
      },
    });

    if (!member) {
      throw new ActionError(t("memberNotFound"));
    }

    await prisma.fridgeMember.delete({
      where: { id: memberId },
    });

    revalidatePath("/fridge/settings/sharing");
    return { success: true };
  });

/**
 * Leave a fridge (for guests only)
 */
export const leaveFridgeAction = authAction.action(
  async ({ ctx: { user } }) => {
    const t = await getTranslations("errors.sharing");
    // Find the membership where user is a guest
    const membership = await prisma.fridgeMember.findFirst({
      where: { userId: user.id },
      include: { fridge: true },
    });

    if (!membership) {
      throw new ActionError(t("notMember"));
    }

    await prisma.fridgeMember.delete({
      where: { id: membership.id },
    });

    revalidatePath("/fridge");
    return { success: true };
  },
);
