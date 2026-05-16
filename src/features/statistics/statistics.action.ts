"use server";

import { prisma } from "@/lib/prisma";
import { authAction } from "@/lib/actions/safe-actions";
import { getFridgeAccess } from "@/lib/fridge/get-fridge-access";
import { calculateEggBoxFreshness } from "@/features/eggs/lib/freshness-calculator";
import { z } from "zod";
import { getTranslations } from "next-intl/server";

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

/**
 * Get statistics data for the current user's fridge
 */
export const getStatisticsAction = authAction.action(
  async ({ ctx: { user } }) => {
    const access = await getFridgeAccess(user);

    if (!access) {
      return { stats: null };
    }

    // Get all egg boxes with consumption history
    const eggBoxes = await prisma.eggBox.findMany({
      where: { fridgeId: access.fridge.id },
      include: {
        consumptions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // Get consumption history for the last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const consumptions = await prisma.eggConsumption.findMany({
      where: {
        eggBox: {
          fridgeId: access.fridge.id,
        },
        createdAt: {
          gte: ninetyDaysAgo,
        },
      },
      orderBy: { createdAt: "asc" },
      include: {
        eggBox: true,
      },
    });

    // Calculate daily consumption for the last 90 days
    const dailyConsumption: Record<string, number> = {};
    for (const c of consumptions) {
      const dateKey = c.createdAt.toISOString().split("T")[0];
      dailyConsumption[dateKey] = (dailyConsumption[dateKey] ?? 0) + c.quantity;
    }

    // Calculate monthly totals
    const monthlyConsumption: Record<string, number> = {};
    for (const c of consumptions) {
      const monthKey = c.createdAt.toISOString().slice(0, 7); // YYYY-MM
      monthlyConsumption[monthKey] =
        (monthlyConsumption[monthKey] ?? 0) + c.quantity;
    }

    // Calculate cooking type distribution
    const cookingTypes: Record<string, number> = {};
    for (const c of consumptions) {
      const type = c.cookingType;
      cookingTypes[type] = (cookingTypes[type] ?? 0) + c.quantity;
    }

    // Calculate freshness distribution at consumption
    const freshnessAtConsumption: Record<string, number> = {
      "extra-fresh": 0,
      fresh: 0,
      "cook-thoroughly": 0,
      expired: 0,
    };

    for (const c of consumptions) {
      const freshness = calculateEggBoxFreshness(c.eggBox, c.createdAt);
      freshnessAtConsumption[freshness.status] += c.quantity;
    }

    // Current inventory stats
    const totalEggs = eggBoxes.reduce((sum, box) => sum + box.remaining, 0);
    const totalConsumed = consumptions.reduce((sum, c) => sum + c.quantity, 0);
    const totalBoxes = eggBoxes.length;
    const activeBoxes = eggBoxes.filter((box) => box.remaining > 0).length;

    // Calculate freshness distribution of current inventory
    const currentFreshness: Record<string, number> = {
      "extra-fresh": 0,
      fresh: 0,
      "cook-thoroughly": 0,
      expired: 0,
    };

    for (const box of eggBoxes) {
      const freshness = calculateEggBoxFreshness(box);
      currentFreshness[freshness.status] += box.remaining;
    }

    // Average freshness score (days remaining before expiration)
    let avgFreshnessScore = 0;
    if (totalEggs > 0) {
      let totalDaysRemaining = 0;
      for (const box of eggBoxes) {
        const freshness = calculateEggBoxFreshness(box);
        totalDaysRemaining += freshness.daysRemaining * box.remaining;
      }
      avgFreshnessScore = Math.round(totalDaysRemaining / totalEggs);
    }

    // Money saved estimate
    const moneySaved = totalConsumed * 0.25;

    return {
      stats: {
        // Summary
        totalEggs,
        totalConsumed,
        totalBoxes,
        activeBoxes,
        moneySaved,
        avgFreshnessScore,

        // Charts data
        dailyConsumption: Object.entries(dailyConsumption).map(
          ([date, count]) => ({
            date,
            count,
          }),
        ),
        monthlyConsumption: Object.entries(monthlyConsumption).map(
          ([month, count]) => ({
            month,
            count,
          }),
        ),
        cookingTypes: Object.entries(cookingTypes).map(([type, count]) => ({
          type,
          count,
        })),
        freshnessAtConsumption: Object.entries(freshnessAtConsumption).map(
          ([status, count]) => ({
            status,
            count,
          }),
        ),
        currentFreshness: Object.entries(currentFreshness).map(
          ([status, count]) => ({
            status,
            count,
          }),
        ),
      },
    };
  },
);

/**
 * Export consumption data as CSV
 */
export const exportConsumptionCSVAction = authAction.action(
  async ({ ctx: { user } }) => {
    const t = await getTranslations("fridge.statistics.exportHeaders");
    const access = await getFridgeAccess(user);

    if (!access) {
      return { csv: null };
    }

    const consumptions = await prisma.eggConsumption.findMany({
      where: {
        eggBox: {
          fridgeId: access.fridge.id,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        eggBox: true,
      },
    });

    // Generate CSV
    const headers = [
      t("date"),
      t("quantity"),
      t("cookingType"),
      t("box"),
      t("notes"),
    ];
    const rows = consumptions.map((c) => [
      c.createdAt.toISOString().split("T")[0],
      c.quantity.toString(),
      c.cookingType,
      c.eggBox.name ?? t("box"),
      c.notes ?? "",
    ]);

    const csv = [
      headers.map(csvCell).join(","),
      ...rows.map((row) => row.map(csvCell).join(",")),
    ].join("\n");

    return { csv };
  },
);

/**
 * Get consumption history with pagination
 */
const getHistorySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  cookingType: z.string().optional(),
  eggBoxId: z.string().optional(),
  userId: z.string().optional(),
});

export const getConsumptionHistoryAction = authAction
  .schema(getHistorySchema)
  .action(
    async ({
      ctx: { user },
      parsedInput: { page, limit, cookingType, eggBoxId, userId },
    }) => {
      const access = await getFridgeAccess(user);

      if (!access) {
        return {
          history: [],
          total: 0,
          pages: 0,
          eggBoxes: [],
          consumers: [],
        };
      }

      const consumerMap = new Map<string, { id: string; name: string }>();
      consumerMap.set(access.fridge.owner.id, {
        id: access.fridge.owner.id,
        name: access.fridge.owner.name,
      });
      for (const member of access.fridge.members) {
        consumerMap.set(member.user.id, {
          id: member.user.id,
          name: member.user.name,
        });
      }
      consumerMap.set(user.id, {
        id: user.id,
        name: user.name,
      });

      const where = {
        eggBox: {
          fridgeId: access.fridge.id,
        },
        ...(cookingType ? { cookingType: cookingType as never } : {}),
        ...(eggBoxId ? { eggBoxId } : {}),
        ...(userId ? { userId } : {}),
      };

      const [consumptions, total] = await Promise.all([
        prisma.eggConsumption.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            eggBox: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
        prisma.eggConsumption.count({ where }),
      ]);

      const history = consumptions.map((c) => ({
        id: c.id,
        date: c.createdAt,
        quantity: c.quantity,
        cookingType: c.cookingType,
        rating: c.rating,
        notes: c.notes,
        eggBoxName: c.eggBox.name ?? "Sans nom",
        userId: c.userId,
        userName: c.user.name,
        canUndo: access.role === "OWNER" || c.userId === user.id,
      }));

      return {
        history,
        total,
        pages: Math.ceil(total / limit),
        eggBoxes: access.fridge.eggBoxes.map((box) => ({
          id: box.id,
          name: box.name ?? "Sans nom",
        })),
        consumers: Array.from(consumerMap.values()),
      };
    },
  );
