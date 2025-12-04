import { dayjs } from "@/lib/dayjs";
import { prisma } from "@/lib/prisma";

const EXPIRATION_DAYS = 28; // Eggs expire 28 days after laying

type ExpiringEggBox = {
  id: string;
  name: string | null;
  remaining: number;
  daysRemaining: number;
  layingDate: Date;
  fridge: {
    id: string;
    name: string;
  } | null;
};

type UserWithExpiringEggs = {
  userId: string;
  userName: string;
  userEmail: string;
  notifyDaysBefore: number;
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

  // Get all egg boxes for these users in a single query
  const userIds = usersWithPrefs.map((p) => p.userId);
  const allEggBoxes = await prisma.eggBox.findMany({
    where: {
      userId: { in: userIds },
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

  // Group egg boxes by user
  const eggBoxesByUser = new Map<string, typeof allEggBoxes>();
  for (const box of allEggBoxes) {
    const userBoxes = eggBoxesByUser.get(box.userId);
    if (userBoxes) {
      userBoxes.push(box);
    } else {
      eggBoxesByUser.set(box.userId, [box]);
    }
  }

  const results: UserWithExpiringEggs[] = [];

  for (const pref of usersWithPrefs) {
    if (!pref.user.email) continue;

    const eggBoxes = eggBoxesByUser.get(pref.userId) ?? [];

    // Filter boxes that are expiring within the user's notification threshold
    const expiringEggs: ExpiringEggBox[] = [];

    for (const box of eggBoxes) {
      const expirationDate = dayjs(box.layingDate).add(EXPIRATION_DAYS, "day");
      const daysRemaining = expirationDate.diff(dayjs(), "day");

      // Include if expiring within threshold and not already expired
      if (daysRemaining >= 0 && daysRemaining <= pref.notifyDaysBefore) {
        expiringEggs.push({
          id: box.id,
          name: box.name,
          remaining: box.remaining,
          daysRemaining,
          layingDate: box.layingDate,
          fridge: box.fridge,
        });
      }
    }

    // Only include users who have expiring eggs
    if (expiringEggs.length > 0) {
      results.push({
        userId: pref.userId,
        userName: pref.user.name || "Chef",
        userEmail: pref.user.email,
        notifyDaysBefore: pref.notifyDaysBefore,
        eggs: expiringEggs.sort((a, b) => a.daysRemaining - b.daysRemaining),
      });
    }
  }

  return results;
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
