"use server";

import { AdminLogAction, InvitationStatus } from "@/generated/prisma";
import { adminAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const getAdminInvitationsStatsAction = adminAction.action(async () => {
  const now = new Date();

  const [
    totalShareLinks,
    activeShareLinks,
    totalEmailInvitations,
    pendingInvitations,
    acceptedInvitations,
    expiredInvitations,
    cancelledInvitations,
  ] = await Promise.all([
    prisma.fridgeShareLink.count(),
    prisma.fridgeShareLink.count({
      where: { isActive: true, expiresAt: { gt: now } },
    }),
    prisma.fridgeEmailInvitation.count(),
    prisma.fridgeEmailInvitation.count({
      where: { status: InvitationStatus.PENDING },
    }),
    prisma.fridgeEmailInvitation.count({
      where: { status: InvitationStatus.ACCEPTED },
    }),
    prisma.fridgeEmailInvitation.count({
      where: { status: InvitationStatus.EXPIRED },
    }),
    prisma.fridgeEmailInvitation.count({
      where: { status: InvitationStatus.CANCELLED },
    }),
  ]);

  return {
    shareLinks: { total: totalShareLinks, active: activeShareLinks },
    emailInvitations: {
      total: totalEmailInvitations,
      pending: pendingInvitations,
      accepted: acceptedInvitations,
      expired: expiredInvitations,
      cancelled: cancelledInvitations,
    },
  };
});

const GetShareLinksSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  status: z.enum(["all", "active", "expired", "maxed"]).default("all"),
  search: z.string().optional(),
});

export const getAdminShareLinksAction = adminAction
  .inputSchema(GetShareLinksSchema)
  .action(async ({ parsedInput: { page, limit, status, search } }) => {
    const now = new Date();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (status === "active") {
      where.isActive = true;
      where.expiresAt = { gt: now };
    } else if (status === "expired") {
      where.OR = [{ expiresAt: { lte: now } }, { isActive: false }];
    } else if (status === "maxed") {
      where.isActive = true;
    }

    if (search) {
      where.OR = [
        { code: { contains: search, mode: "insensitive" } },
        { fridge: { name: { contains: search, mode: "insensitive" } } },
        {
          fridge: {
            owner: { email: { contains: search, mode: "insensitive" } },
          },
        },
      ];
    }

    const [links, total] = await Promise.all([
      prisma.fridgeShareLink.findMany({
        where,
        include: {
          fridge: {
            select: {
              id: true,
              name: true,
              owner: { select: { id: true, name: true, email: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.fridgeShareLink.count({ where }),
    ]);

    return { links, total, pages: Math.ceil(total / limit) };
  });

const GetEmailInvitationsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  status: z
    .enum(["all", "PENDING", "ACCEPTED", "EXPIRED", "CANCELLED"])
    .default("all"),
  search: z.string().optional(),
});

export const getAdminEmailInvitationsAction = adminAction
  .inputSchema(GetEmailInvitationsSchema)
  .action(async ({ parsedInput: { page, limit, status, search } }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { fridge: { name: { contains: search, mode: "insensitive" } } },
        { invitedBy: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [invitations, total] = await Promise.all([
      prisma.fridgeEmailInvitation.findMany({
        where,
        include: {
          fridge: { select: { id: true, name: true } },
          invitedBy: {
            select: { id: true, name: true, email: true, image: true },
          },
          acceptedBy: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.fridgeEmailInvitation.count({ where }),
    ]);

    return { invitations, total, pages: Math.ceil(total / limit) };
  });

const CancelInvitationSchema = z.object({
  invitationId: z.string(),
});

export const adminCancelEmailInvitationAction = adminAction
  .inputSchema(CancelInvitationSchema)
  .action(async ({ parsedInput: { invitationId }, ctx: { user } }) => {
    const invitation = await prisma.fridgeEmailInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation || invitation.status !== InvitationStatus.PENDING) {
      return {
        success: false,
        error: "Invitation introuvable ou deja traitee",
      };
    }

    await prisma.$transaction([
      prisma.fridgeEmailInvitation.update({
        where: { id: invitationId },
        data: { status: InvitationStatus.CANCELLED },
      }),
      prisma.adminLog.create({
        data: {
          adminId: user.id,
          action: AdminLogAction.CANCEL_INVITATION,
          metadata: {
            invitationId,
            email: invitation.email,
            fridgeId: invitation.fridgeId,
          },
        },
      }),
    ]);

    return { success: true };
  });

const DeactivateShareLinkSchema = z.object({
  shareLinkId: z.string(),
});

export const adminDeactivateShareLinkAction = adminAction
  .inputSchema(DeactivateShareLinkSchema)
  .action(async ({ parsedInput: { shareLinkId }, ctx: { user } }) => {
    const link = await prisma.fridgeShareLink.findUnique({
      where: { id: shareLinkId },
    });

    if (!link) {
      return { success: false, error: "Lien introuvable" };
    }

    await prisma.$transaction([
      prisma.fridgeShareLink.update({
        where: { id: shareLinkId },
        data: { isActive: false },
      }),
      prisma.adminLog.create({
        data: {
          adminId: user.id,
          action: AdminLogAction.CANCEL_INVITATION,
          metadata: {
            type: "share_link",
            shareLinkId,
            code: link.code,
            fridgeId: link.fridgeId,
          },
        },
      }),
    ]);

    return { success: true };
  });
