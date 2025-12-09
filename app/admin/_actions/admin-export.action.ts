"use server";

import { AdminLogAction } from "@/generated/prisma";
import { adminAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";

export const exportUsersCSVAction = adminAction.action(
  async ({ ctx: { user } }) => {
    const users = await prisma.user.findMany({
      include: {
        userSubscription: true,
        ownedFridge: {
          include: { _count: { select: { eggBoxes: true, members: true } } },
        },
        _count: {
          select: { eggConsumptions: true, sentInvitations: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "id",
      "email",
      "name",
      "role",
      "banned",
      "plan",
      "subscriptionStatus",
      "fridgeId",
      "eggBoxes",
      "fridgeMembers",
      "consumptions",
      "invitationsSent",
      "createdAt",
    ];

    const rows = users.map((u) => [
      u.id,
      u.email,
      `"${u.name.replace(/"/g, '""')}"`,
      u.role ?? "user",
      u.banned ? "true" : "false",
      u.userSubscription?.plan ?? "free",
      u.userSubscription?.status ?? "-",
      u.ownedFridge?.id ?? "-",
      u.ownedFridge?._count.eggBoxes ?? 0,
      u.ownedFridge?._count.members ?? 0,
      u._count.eggConsumptions,
      u._count.sentInvitations,
      u.createdAt.toISOString(),
    ]);

    await prisma.adminLog.create({
      data: {
        adminId: user.id,
        action: AdminLogAction.EXPORT_DATA,
        metadata: { type: "users", count: users.length },
      },
    });

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n",
    );
    return {
      csv,
      filename: `eggscuseme-users-${new Date().toISOString().split("T")[0]}.csv`,
    };
  },
);

export const exportShareLinksCSVAction = adminAction.action(
  async ({ ctx: { user } }) => {
    const shareLinks = await prisma.fridgeShareLink.findMany({
      include: {
        fridge: {
          select: {
            name: true,
            owner: { select: { email: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "id",
      "code",
      "fridgeName",
      "ownerEmail",
      "ownerName",
      "maxUses",
      "usedCount",
      "isActive",
      "expiresAt",
      "createdAt",
    ];

    const rows = shareLinks.map((sl) => [
      sl.id,
      sl.code,
      `"${sl.fridge.name.replace(/"/g, '""')}"`,
      sl.fridge.owner.email,
      `"${sl.fridge.owner.name.replace(/"/g, '""')}"`,
      sl.maxUses,
      sl.usedCount,
      sl.isActive ? "true" : "false",
      sl.expiresAt.toISOString(),
      sl.createdAt.toISOString(),
    ]);

    await prisma.adminLog.create({
      data: {
        adminId: user.id,
        action: AdminLogAction.EXPORT_DATA,
        metadata: { type: "share-links", count: shareLinks.length },
      },
    });

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n",
    );
    return {
      csv,
      filename: `eggscuseme-share-links-${new Date().toISOString().split("T")[0]}.csv`,
    };
  },
);

export const exportEmailInvitationsCSVAction = adminAction.action(
  async ({ ctx: { user } }) => {
    const emailInvitations = await prisma.fridgeEmailInvitation.findMany({
      include: {
        fridge: { select: { name: true } },
        invitedBy: { select: { email: true, name: true } },
        acceptedBy: { select: { email: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "id",
      "email",
      "status",
      "fridgeName",
      "invitedByEmail",
      "invitedByName",
      "acceptedByEmail",
      "acceptedByName",
      "expiresAt",
      "acceptedAt",
      "createdAt",
    ];

    const rows = emailInvitations.map((ei) => [
      ei.id,
      ei.email,
      ei.status,
      `"${ei.fridge.name.replace(/"/g, '""')}"`,
      ei.invitedBy.email,
      `"${ei.invitedBy.name.replace(/"/g, '""')}"`,
      ei.acceptedBy?.email ?? "-",
      ei.acceptedBy?.name ? `"${ei.acceptedBy.name.replace(/"/g, '""')}"` : "-",
      ei.expiresAt.toISOString(),
      ei.acceptedAt?.toISOString() ?? "-",
      ei.createdAt.toISOString(),
    ]);

    await prisma.adminLog.create({
      data: {
        adminId: user.id,
        action: AdminLogAction.EXPORT_DATA,
        metadata: { type: "email-invitations", count: emailInvitations.length },
      },
    });

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n",
    );
    return {
      csv,
      filename: `eggscuseme-email-invitations-${new Date().toISOString().split("T")[0]}.csv`,
    };
  },
);
