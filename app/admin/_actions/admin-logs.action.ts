"use server";

import type { AdminLogAction, Prisma } from "@/generated/prisma";
import { adminAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const AdminLogActionValues = [
  "IMPERSONATE",
  "BAN_USER",
  "UNBAN_USER",
  "SET_ROLE",
  "SEND_TEST_EMAIL",
  "CANCEL_INVITATION",
  "EXPORT_DATA",
] as const;

const CreateLogSchema = z.object({
  action: z.enum(AdminLogActionValues),
  targetUserId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const createAdminLogAction = adminAction
  .inputSchema(CreateLogSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    await prisma.adminLog.create({
      data: {
        adminId: user.id,
        action: parsedInput.action as AdminLogAction,
        targetUserId: parsedInput.targetUserId,
        metadata: parsedInput.metadata as Prisma.InputJsonValue | undefined,
      },
    });
    return { success: true };
  });

const GetLogsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  action: z.enum(AdminLogActionValues).optional(),
});

export const getAdminLogsAction = adminAction
  .inputSchema(GetLogsSchema)
  .action(async ({ parsedInput: { page, limit, action } }) => {
    const where = action ? { action } : {};

    const [logs, total] = await Promise.all([
      prisma.adminLog.findMany({
        where,
        include: {
          admin: { select: { id: true, name: true, email: true, image: true } },
          targetUser: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.adminLog.count({ where }),
    ]);

    return { logs, total, pages: Math.ceil(total / limit) };
  });

export const getAdminLogsStatsAction = adminAction.action(async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [total, todayCount, actionCounts] = await Promise.all([
    prisma.adminLog.count(),
    prisma.adminLog.count({ where: { createdAt: { gte: today } } }),
    prisma.adminLog.groupBy({
      by: ["action"],
      _count: { action: true },
    }),
  ]);

  return {
    total,
    todayCount,
    actionCounts: actionCounts.reduce(
      (acc, item) => {
        acc[item.action] = item._count.action;
        return acc;
      },
      {} as Record<AdminLogAction, number>,
    ),
  };
});
