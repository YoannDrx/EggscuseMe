import { prisma } from "@/lib/prisma";
import { differenceInCalendarDays, startOfDay } from "date-fns";

type ExpiringEggBox = {
  id: string;
  name: string | null;
  remaining: number;
  daysRemaining: number;
  layingDate: Date;
  dcrDate: Date;
  fridge: {
    id: string;
    name: string;
  } | null;
};

export type UserWithExpiringEggs = {
  userId: string;
  userName: string;
  userEmail: string;
  notifyDaysBefore: number;
  emailEnabled: boolean;
  pushEnabled: boolean;
  eggs: ExpiringEggBox[];
};

/**
 * Get all users who have eggs expiring within their notification threshold
 */
export async function getUsersWithExpiringEggs(): Promise<
  UserWithExpiringEggs[]
> {
  // Get all users with notifications enabled
  const usersWithPrefs = await prisma.userPreferences.findMany({
    where: {
      notifyEnabled: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const today = startOfDay(new Date());

  const results = await Promise.all(
    usersWithPrefs.map(async (pref): Promise<UserWithExpiringEggs | null> => {
      if (!pref.user.email) return null;

      const [ownedFridges, memberships] = await Promise.all([
        prisma.fridge.findMany({
          where: { ownerId: pref.userId },
          select: { id: true },
        }),
        prisma.fridgeMember.findMany({
          where: { userId: pref.userId },
          select: { fridgeId: true },
        }),
      ]);

      const fridgeIds = [
        ...ownedFridges.map((fridge) => fridge.id),
        ...memberships.map((membership) => membership.fridgeId),
      ];

      if (fridgeIds.length === 0) return null;

      const eggBoxes = await prisma.eggBox.findMany({
        where: {
          fridgeId: { in: fridgeIds },
          remaining: { gt: 0 },
        },
        include: {
          fridge: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const expiringEggs = eggBoxes
        .map((box): ExpiringEggBox | null => {
          const daysRemaining = differenceInCalendarDays(
            startOfDay(box.dcrDate),
            today,
          );

          if (daysRemaining < 0 || daysRemaining > pref.notifyDaysBefore) {
            return null;
          }

          return {
            id: box.id,
            name: box.name,
            remaining: box.remaining,
            daysRemaining,
            layingDate: box.layingDate,
            dcrDate: box.dcrDate,
            fridge: box.fridge,
          };
        })
        .filter((egg): egg is ExpiringEggBox => egg !== null);

      if (expiringEggs.length === 0) return null;

      return {
        userId: pref.userId,
        userName: pref.user.name || "Chef",
        userEmail: pref.user.email,
        notifyDaysBefore: pref.notifyDaysBefore,
        emailEnabled: pref.emailEnabled,
        pushEnabled: pref.pushEnabled,
        eggs: expiringEggs.sort((a, b) => a.daysRemaining - b.daysRemaining),
      };
    }),
  );

  return results.filter(
    (result): result is UserWithExpiringEggs => result !== null,
  );
}

/**
 * Group expiring eggs by fridge for better email formatting
 */
export function groupEggsByFridge(eggs: ExpiringEggBox[]): Map<
  string,
  {
    fridgeName: string;
    eggs: ExpiringEggBox[];
  }
> {
  const groups = new Map<
    string,
    {
      fridgeName: string;
      eggs: ExpiringEggBox[];
    }
  >();

  for (const egg of eggs) {
    const fridgeId = egg.fridge?.id ?? "personal";
    const fridgeName = egg.fridge?.name ?? "Mon Frigo";

    const existingGroup = groups.get(fridgeId);
    if (!existingGroup) {
      groups.set(fridgeId, {
        fridgeName,
        eggs: [egg],
      });
    } else {
      existingGroup.eggs.push(egg);
    }
  }

  return groups;
}
