"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { ActionError } from "@/lib/errors/action-error";
import {
  canModifyFridge,
  getOrCreateFridge,
} from "@/lib/fridge/get-fridge-access";
import { prisma } from "@/lib/prisma";
import { SiteConfig } from "@/site-config";
import { revalidatePath } from "next/cache";
import {
  ConsumeEggsSchema,
  CreateEggBoxSchema,
  DeleteEggBoxSchema,
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
      isPremium: subscription !== null && subscription.plan !== "free",
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
    const { fridge, subscription, role } = await getOrCreateFridge(user);

    // Check if user can modify fridge (only owners can add boxes)
    if (!canModifyFridge(role)) {
      throw new ActionError(
        "Seul le propriétaire du frigo peut ajouter des boîtes d'oeufs.",
      );
    }

    // Check plan limits
    const isPremium = subscription !== null && subscription.plan !== "free";
    const limit = isPremium ? Infinity : SiteConfig.freePlan.maxEggBoxes;

    const existingBoxes = await prisma.eggBox.count({
      where: { fridgeId: fridge.id },
    });

    if (existingBoxes >= limit) {
      throw new ActionError(
        `Le plan gratuit est limité à ${SiteConfig.freePlan.maxEggBoxes} boîtes d'oeufs. Passez Premium pour des boîtes illimitées !`,
      );
    }

    const eggBox = await prisma.eggBox.create({
      data: {
        name: data.name,
        layingDate: data.layingDate,
        quantity: data.quantity,
        remaining: data.quantity,
        size: data.size,
        source: data.source,
        barcode: data.barcode,
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
    const { fridge, role } = await getOrCreateFridge(user);

    // Check if user can modify fridge
    if (!canModifyFridge(role)) {
      throw new ActionError(
        "Seul le propriétaire du frigo peut modifier les boîtes d'oeufs.",
      );
    }

    // Verify box belongs to this fridge
    const existingBox = await prisma.eggBox.findFirst({
      where: {
        id: data.id,
        fridgeId: fridge.id,
      },
    });

    if (!existingBox) {
      throw new ActionError("Boîte d'oeufs introuvable.");
    }

    const eggBox = await prisma.eggBox.update({
      where: { id: data.id },
      data: {
        name: data.name,
        quantity: data.quantity,
        remaining: data.remaining,
        size: data.size,
        source: data.source,
      },
    });

    revalidatePath("/fridge");
    return { eggBox };
  });

/**
 * Delete an egg box
 */
export const deleteEggBoxAction = authAction
  .inputSchema(DeleteEggBoxSchema)
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const { fridge, role } = await getOrCreateFridge(user);

    // Check if user can modify fridge
    if (!canModifyFridge(role)) {
      throw new ActionError(
        "Seul le propriétaire du frigo peut supprimer les boîtes d'oeufs.",
      );
    }

    // Verify box belongs to this fridge
    const existingBox = await prisma.eggBox.findFirst({
      where: {
        id,
        fridgeId: fridge.id,
      },
    });

    if (!existingBox) {
      throw new ActionError("Boîte d'oeufs introuvable.");
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
    const { fridge } = await getOrCreateFridge(user);

    // Verify box belongs to this fridge
    const eggBox = await prisma.eggBox.findFirst({
      where: {
        id: data.eggBoxId,
        fridgeId: fridge.id,
      },
    });

    if (!eggBox) {
      throw new ActionError("Boîte d'oeufs introuvable.");
    }

    if (eggBox.remaining < data.quantity) {
      throw new ActionError(
        `Pas assez d'oeufs. Il reste seulement ${eggBox.remaining} oeuf(s).`,
      );
    }

    // Create consumption record and update remaining count
    const [consumption] = await prisma.$transaction([
      prisma.eggConsumption.create({
        data: {
          eggBoxId: data.eggBoxId,
          quantity: data.quantity,
          cookingType: data.cookingType,
          rating: data.rating,
          notes: data.notes,
          userId: user.id,
        },
      }),
      prisma.eggBox.update({
        where: { id: data.eggBoxId },
        data: {
          remaining: eggBox.remaining - data.quantity,
        },
      }),
    ]);

    revalidatePath("/fridge");
    return { consumption };
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
