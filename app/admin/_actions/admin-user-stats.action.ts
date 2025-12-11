"use server";

import { adminAction } from "@/lib/actions/safe-actions";
import { calculateFreshness } from "@/features/eggs/lib/freshness-calculator";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const GetUserStatsSchema = z.object({
  userId: z.string(),
});

export const getUserDetailedStatsAction = adminAction
  .inputSchema(GetUserStatsSchema)
  .action(async ({ parsedInput: { userId } }) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userSubscription: true,
        ownedFridges: {
          where: { isDefault: true },
          take: 1,
          include: {
            eggBoxes: {
              include: {
                consumptions: true,
              },
            },
            members: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, image: true },
                },
              },
            },
            emailInvitations: {
              orderBy: { createdAt: "desc" },
              take: 10,
              include: {
                acceptedBy: { select: { name: true, email: true } },
              },
            },
            shareLinks: {
              orderBy: { createdAt: "desc" },
              take: 10,
            },
          },
        },
        fridgeMemberships: {
          include: {
            fridge: {
              select: {
                id: true,
                name: true,
                owner: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
        sentInvitations: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            fridge: { select: { name: true } },
            acceptedBy: { select: { name: true, email: true } },
          },
        },
        eggConsumptions: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: {
            eggBox: { select: { name: true } },
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    // Calculs statistiques
    const fridge = user.ownedFridges[0] as
      | (typeof user.ownedFridges)[0]
      | undefined;
    const stats = {
      totalEggBoxes: 0,
      activeEggBoxes: 0,
      totalEggsAdded: 0,
      totalEggsConsumed: 0,
      totalEggsRemaining: 0,
      totalEggsWasted: 0,
      moneySaved: 0,
    };

    if (fridge) {
      stats.totalEggBoxes = fridge.eggBoxes.length;

      for (const box of fridge.eggBoxes) {
        const freshness = calculateFreshness(box.layingDate);
        const consumed = box.consumptions.reduce(
          (sum: number, c: { quantity: number }) => sum + c.quantity,
          0,
        );

        stats.totalEggsAdded += box.quantity;
        stats.totalEggsConsumed += consumed;
        stats.totalEggsRemaining += box.remaining;

        if (freshness.status === "expired" && box.remaining > 0) {
          stats.totalEggsWasted += box.remaining;
        } else if (box.remaining > 0) {
          stats.activeEggBoxes++;
        }
      }

      // Estimation des economies (0.30 EUR par oeuf consomme vs achete au supermarche)
      stats.moneySaved = Math.round(stats.totalEggsConsumed * 0.3 * 100) / 100;
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        banned: user.banned,
        banReason: user.banReason,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      subscription: user.userSubscription,
      stats,
      fridge: fridge
        ? {
            id: fridge.id,
            name: fridge.name,
            members: fridge.members.map(
              (m: (typeof fridge.members)[number]) => ({
                id: m.id,
                role: m.role,
                user: m.user,
                joinedAt: m.createdAt,
              }),
            ),
            recentInvitations: fridge.emailInvitations,
            recentShareLinks: fridge.shareLinks,
          }
        : null,
      memberships: user.fridgeMemberships.map(
        (m: (typeof user.fridgeMemberships)[number]) => ({
          fridgeId: m.fridge.id,
          fridgeName: m.fridge.name,
          ownerName: m.fridge.owner.name,
          ownerEmail: m.fridge.owner.email,
          role: m.role,
          joinedAt: m.createdAt,
        }),
      ),
      recentConsumptions: user.eggConsumptions.map(
        (c: (typeof user.eggConsumptions)[number]) => ({
          id: c.id,
          quantity: c.quantity,
          cookingType: c.cookingType,
          eggBoxName: c.eggBox.name,
          createdAt: c.createdAt,
        }),
      ),
    };
  });
