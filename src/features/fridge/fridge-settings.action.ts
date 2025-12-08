"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { ActionError } from "@/lib/errors/action-error";
import {
  canModifyFridge,
  getOrCreateFridge,
} from "@/lib/fridge/get-fridge-access";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Schema for renaming a fridge
 */
const RenameFridgeSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(50, "Nom trop long"),
});

/**
 * Rename the user's fridge
 * OWNER only
 */
export const renameFridgeAction = authAction
  .inputSchema(RenameFridgeSchema)
  .action(async ({ parsedInput: { name }, ctx: { user } }) => {
    const { fridge, role } = await getOrCreateFridge(user);

    if (!canModifyFridge(role)) {
      throw new ActionError("Seul le propriétaire peut renommer le frigo.");
    }

    const updatedFridge = await prisma.fridge.update({
      where: { id: fridge.id },
      data: { name },
    });

    revalidatePath("/fridge");
    revalidatePath("/fridge/settings");
    return { fridge: updatedFridge };
  });

/**
 * Clear all consumption history
 * Keeps the egg boxes but removes all consumption records
 * Available for OWNER
 */
export const clearFridgeHistoryAction = authAction.action(
  async ({ ctx: { user } }) => {
    const { fridge, role } = await getOrCreateFridge(user);

    if (!canModifyFridge(role)) {
      throw new ActionError("Seul le propriétaire peut effacer l'historique.");
    }

    // Delete all consumption records for all egg boxes in this fridge
    const result = await prisma.eggConsumption.deleteMany({
      where: {
        eggBox: {
          fridgeId: fridge.id,
        },
      },
    });

    revalidatePath("/fridge");
    revalidatePath("/fridge/history");
    revalidatePath("/fridge/statistics");
    return { deletedCount: result.count };
  },
);

/**
 * Clear all egg boxes from the fridge
 * OWNER only - this removes all egg boxes and their history
 */
export const clearFridgeDataAction = authAction.action(
  async ({ ctx: { user } }) => {
    const { fridge, role } = await getOrCreateFridge(user);

    if (!canModifyFridge(role)) {
      throw new ActionError("Seul le propriétaire peut vider le frigo.");
    }

    // Delete all egg boxes (consumption records will cascade delete)
    const result = await prisma.eggBox.deleteMany({
      where: { fridgeId: fridge.id },
    });

    revalidatePath("/fridge");
    revalidatePath("/fridge/history");
    revalidatePath("/fridge/statistics");
    return { deletedCount: result.count };
  },
);

/**
 * Leave a shared fridge (for GUESTS only)
 */
export const leaveFridgeAction = authAction.action(
  async ({ ctx: { user } }) => {
    const { fridge, role } = await getOrCreateFridge(user);

    // Only guests can leave - owners delete by deleting their account
    if (role === "OWNER") {
      throw new ActionError(
        "Les propriétaires ne peuvent pas quitter leur frigo. Supprimez votre compte pour supprimer le frigo.",
      );
    }

    // Remove the user from fridge members
    await prisma.fridgeMember.deleteMany({
      where: {
        fridgeId: fridge.id,
        userId: user.id,
      },
    });

    revalidatePath("/fridge");
    return { success: true };
  },
);

/**
 * Export fridge data as JSON
 * Returns all egg boxes and consumption history for the fridge
 */
export const exportFridgeDataAction = authAction.action(
  async ({ ctx: { user } }) => {
    const { fridge, role } = await getOrCreateFridge(user);

    if (!canModifyFridge(role)) {
      throw new ActionError("Seul le propriétaire peut exporter les données.");
    }

    // Get all egg boxes with their consumption history
    const eggBoxes = await prisma.eggBox.findMany({
      where: { fridgeId: fridge.id },
      include: {
        consumptions: {
          select: {
            quantity: true,
            cookingType: true,
            rating: true,
            notes: true,
            createdAt: true,
          },
        },
      },
    });

    // Format data for export
    const exportData = {
      fridge: {
        name: fridge.name,
        createdAt: fridge.createdAt,
      },
      exportDate: new Date().toISOString(),
      eggBoxes: eggBoxes.map((box) => ({
        name: box.name,
        layingDate: box.layingDate,
        quantity: box.quantity,
        remaining: box.remaining,
        size: box.size,
        source: box.source,
        barcode: box.barcode,
        createdAt: box.createdAt,
        consumptions: box.consumptions.map((c) => ({
          quantity: c.quantity,
          cookingType: c.cookingType,
          rating: c.rating,
          notes: c.notes,
          date: c.createdAt,
        })),
      })),
      summary: {
        totalBoxes: eggBoxes.length,
        totalEggsTracked: eggBoxes.reduce((sum, box) => sum + box.quantity, 0),
        totalEggsConsumed: eggBoxes.reduce(
          (sum, box) =>
            sum + box.consumptions.reduce((cSum, c) => cSum + c.quantity, 0),
          0,
        ),
      },
    };

    return { data: exportData };
  },
);

/**
 * Get fridge settings (for display)
 */
export const getFridgeSettingsAction = authAction.action(
  async ({ ctx: { user } }) => {
    const { fridge, role, subscription } = await getOrCreateFridge(user);

    // Count stats
    const [eggBoxCount, consumptionCount, memberCount] = await Promise.all([
      prisma.eggBox.count({ where: { fridgeId: fridge.id } }),
      prisma.eggConsumption.count({
        where: { eggBox: { fridgeId: fridge.id } },
      }),
      prisma.fridgeMember.count({ where: { fridgeId: fridge.id } }),
    ]);

    return {
      fridge: {
        id: fridge.id,
        name: fridge.name,
        createdAt: fridge.createdAt,
      },
      role,
      isOwner: role === "OWNER",
      isPremium: subscription?.plan !== "free",
      stats: {
        eggBoxCount,
        consumptionCount,
        memberCount: memberCount + 1, // +1 for owner
      },
    };
  },
);
