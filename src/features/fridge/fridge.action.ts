"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { ActionError } from "@/lib/errors/action-error";
import {
  canModifyFridge,
  getOrCreateFridge,
} from "@/lib/fridge/get-fridge-access";
import { getLayingDateFromDcrDate } from "@/features/eggs/lib/freshness-calculator";
import { isPaidSubscription } from "@/lib/stripe/check-premium";
import { prisma } from "@/lib/prisma";
import { SiteConfig } from "@/site-config";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import {
  ConsumeEggsSchema,
  CreateEggBoxSchema,
  DeleteEggBoxSchema,
  UndoConsumptionSchema,
  UpdateEggBoxSchema,
} from "./fridge.schema";

/**
 * Get the current user's fridge with all egg boxes
 * Creates a fridge if user doesn't have one
 */
export const getMyFridgeAction = authAction.action(
  async ({ ctx: { user } }) => {
    const { fridge, role, subscription } = await getOrCreateFridge(user);

    return {
      fridge,
      role,
      subscription,
      isPremium: isPaidSubscription(subscription),
    };
  },
);

/**
 * Create a new egg box in the user's fridge
 * Simplified: always creates in the user's fridge (no organizationId needed)
 */
export const createEggBoxAction = authAction
  .inputSchema(CreateEggBoxSchema)
  .action(async ({ parsedInput: data, ctx: { user } }) => {
    const t = await getTranslations("errors.fridge");
    const { fridge, subscription, role } = await getOrCreateFridge(user);

    // Check if user can modify fridge (only owners can add boxes)
    if (!canModifyFridge(role)) {
      throw new ActionError(t("ownerOnly"));
    }

    // Check plan limits
    const isPremium = isPaidSubscription(subscription);
    const limit = isPremium ? Infinity : SiteConfig.freePlan.maxEggBoxes;

    const existingBoxes = await prisma.eggBox.count({
      where: { fridgeId: fridge.id },
    });

    if (existingBoxes >= limit) {
      throw new ActionError(
        t("freePlanLimit", { count: SiteConfig.freePlan.maxEggBoxes }),
      );
    }

    const eggBox = await prisma.eggBox.create({
      data: {
        name: data.name,
        layingDate: data.layingDate ?? getLayingDateFromDcrDate(data.dcrDate),
        dcrDate: data.dcrDate,
        quantity: data.quantity,
        remaining: data.quantity,
        size: data.size,
        source: data.source,
        barcode: data.barcode,
        lotNumber: data.lotNumber,
        producerCode: data.producerCode,
        userId: user.id,
        fridgeId: fridge.id,
      },
    });

    revalidatePath("/fridge");
    return { eggBox };
  });

/**
 * Update an egg box
 */
export const updateEggBoxAction = authAction
  .inputSchema(UpdateEggBoxSchema)
  .action(async ({ parsedInput: data, ctx: { user } }) => {
    const t = await getTranslations("errors.fridge");
    const { fridge, role } = await getOrCreateFridge(user);

    // Check if user can modify fridge
    if (!canModifyFridge(role)) {
      throw new ActionError(t("ownerOnly"));
    }

    // Verify box belongs to this fridge
    const existingBox = await prisma.eggBox.findFirst({
      where: {
        id: data.id,
        fridgeId: fridge.id,
      },
    });

    if (!existingBox) {
      throw new ActionError(t("notFound"));
    }

    const nextQuantity = data.quantity ?? existingBox.quantity;
    const nextRemaining = data.remaining ?? existingBox.remaining;

    if (nextRemaining > nextQuantity) {
      throw new ActionError(t("remainingGreaterThanQuantity"));
    }

    const dcrDate = data.dcrDate;
    const eggBox = await prisma.eggBox.update({
      where: { id: data.id },
      data: {
        name: data.name,
        dcrDate,
        layingDate:
          data.layingDate ??
          (dcrDate ? getLayingDateFromDcrDate(dcrDate) : undefined),
        quantity: data.quantity,
        remaining: data.remaining,
        size: data.size,
        source: data.source,
        lotNumber: data.lotNumber,
        producerCode: data.producerCode,
      },
    });

    revalidatePath("/fridge");
    revalidatePath("/fridge/history");
    revalidatePath("/fridge/statistics");
    return { eggBox };
  });

/**
 * Delete an egg box
 */
export const deleteEggBoxAction = authAction
  .inputSchema(DeleteEggBoxSchema)
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const t = await getTranslations("errors.fridge");
    const { fridge, role } = await getOrCreateFridge(user);

    // Check if user can modify fridge
    if (!canModifyFridge(role)) {
      throw new ActionError(t("ownerOnly"));
    }

    // Verify box belongs to this fridge
    const existingBox = await prisma.eggBox.findFirst({
      where: {
        id,
        fridgeId: fridge.id,
      },
    });

    if (!existingBox) {
      throw new ActionError(t("notFound"));
    }

    await prisma.eggBox.delete({
      where: { id },
    });

    revalidatePath("/fridge");
    return { success: true };
  });

/**
 * Consume eggs from a box
 * Both owners and guests can consume eggs
 */
export const consumeEggsAction = authAction
  .inputSchema(ConsumeEggsSchema)
  .action(async ({ parsedInput: data, ctx: { user } }) => {
    const t = await getTranslations("errors.fridge");
    const { fridge } = await getOrCreateFridge(user);

    const consumption = await prisma.$transaction(async (tx) => {
      const updated = await tx.eggBox.updateMany({
        where: {
          id: data.eggBoxId,
          fridgeId: fridge.id,
          remaining: { gte: data.quantity },
        },
        data: {
          remaining: { decrement: data.quantity },
        },
      });

      if (updated.count === 0) {
        const currentBox = await tx.eggBox.findFirst({
          where: {
            id: data.eggBoxId,
            fridgeId: fridge.id,
          },
          select: { remaining: true },
        });

        if (!currentBox) {
          throw new ActionError(t("notFound"));
        }

        throw new ActionError(t("notEnough", { count: currentBox.remaining }));
      }

      return tx.eggConsumption.create({
        data: {
          eggBoxId: data.eggBoxId,
          quantity: data.quantity,
          cookingType: data.cookingType,
          rating: data.rating,
          notes: data.notes,
          userId: user.id,
        },
      });
    });

    revalidatePath("/fridge");
    revalidatePath("/fridge/history");
    revalidatePath("/fridge/statistics");
    return { consumption };
  });

/**
 * Undo a consumption entry and put the eggs back in the box.
 * Owners can undo any entry in the current fridge.
 * Guests can only undo their own entries.
 */
export const undoConsumptionAction = authAction
  .inputSchema(UndoConsumptionSchema)
  .action(async ({ parsedInput: { consumptionId }, ctx: { user } }) => {
    const t = await getTranslations("errors.fridge");
    const { fridge, role } = await getOrCreateFridge(user);

    const consumption = await prisma.eggConsumption.findFirst({
      where: {
        id: consumptionId,
        ...(role === "GUEST" ? { userId: user.id } : {}),
        eggBox: { fridgeId: fridge.id },
      },
      include: {
        eggBox: {
          select: {
            id: true,
            quantity: true,
            remaining: true,
          },
        },
      },
    });

    if (!consumption) {
      throw new ActionError(t("notFound"));
    }

    await prisma.$transaction([
      prisma.eggConsumption.delete({
        where: { id: consumption.id },
      }),
      prisma.eggBox.update({
        where: { id: consumption.eggBoxId },
        data: {
          remaining: Math.min(
            consumption.eggBox.quantity,
            consumption.eggBox.remaining + consumption.quantity,
          ),
        },
      }),
    ]);

    revalidatePath("/fridge");
    revalidatePath("/fridge/history");
    revalidatePath("/fridge/statistics");
    return { success: true };
  });

/**
 * Get statistics for the current user's fridge
 */
export const getFridgeStatsAction = authAction.action(
  async ({ ctx: { user } }) => {
    const { fridge } = await getOrCreateFridge(user);

    const [totalBoxes, totalConsumed, activeBoxes] = await Promise.all([
      prisma.eggBox.count({
        where: { fridgeId: fridge.id },
      }),
      prisma.eggConsumption.aggregate({
        where: {
          eggBox: { fridgeId: fridge.id },
        },
        _sum: { quantity: true },
      }),
      prisma.eggBox.count({
        where: {
          fridgeId: fridge.id,
          remaining: { gt: 0 },
        },
      }),
    ]);

    // Calculate eggs saved (eggs consumed before expiration)
    const eggsSaved = totalConsumed._sum.quantity ?? 0;

    // Estimate money saved (average egg price ~0.25€)
    const moneySaved = eggsSaved * 0.25;

    return {
      stats: {
        totalBoxes,
        activeBoxes,
        eggsSaved,
        moneySaved: moneySaved.toFixed(2),
      },
    };
  },
);
