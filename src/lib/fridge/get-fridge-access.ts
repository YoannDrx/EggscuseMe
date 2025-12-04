import type {
  EggBox,
  Fridge,
  FridgeMember,
  FridgeRole,
  User as PrismaUser,
  UserSubscription,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { getRequiredUser, getSession } from "../auth/auth-user";
import { getUserSubscription } from "./get-user-subscription";

// Session user type (from Better Auth)
type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

export type FridgeWithRelations = Fridge & {
  eggBoxes: EggBox[];
  members: (FridgeMember & {
    user: Pick<PrismaUser, "id" | "name" | "image">;
  })[];
  owner: Pick<PrismaUser, "id" | "name" | "image" | "email">;
};

export type FridgeAccessResult = {
  fridge: FridgeWithRelations;
  role: "OWNER" | "GUEST";
  subscription: UserSubscription | null;
  user: SessionUser;
};

/**
 * Get or create the user's fridge access
 *
 * This function:
 * 1. Checks if user owns a fridge -> returns it with role OWNER
 * 2. Checks if user is a guest of a fridge -> returns it with role GUEST
 * 3. If no fridge access, creates a new fridge for the user
 *
 * The subscription is always fetched from the fridge owner.
 */
export async function getFridgeAccess(
  user: SessionUser,
): Promise<FridgeAccessResult | null> {
  // 1. Check if user owns a fridge
  const ownedFridge = await prisma.fridge.findUnique({
    where: { ownerId: user.id },
    include: {
      eggBoxes: {
        orderBy: { layingDate: "asc" },
      },
      members: {
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      },
      owner: {
        select: { id: true, name: true, image: true, email: true },
      },
    },
  });

  if (ownedFridge) {
    const subscription = await getUserSubscription(user.id);
    return {
      fridge: ownedFridge,
      role: "OWNER",
      subscription,
      user,
    };
  }

  // 2. Check if user is guest of a fridge
  const guestMembership = await prisma.fridgeMember.findFirst({
    where: { userId: user.id },
    include: {
      fridge: {
        include: {
          eggBoxes: {
            orderBy: { layingDate: "asc" },
          },
          members: {
            include: {
              user: {
                select: { id: true, name: true, image: true },
              },
            },
          },
          owner: {
            select: { id: true, name: true, image: true, email: true },
          },
        },
      },
    },
  });

  if (guestMembership) {
    // For guests, subscription is based on the fridge owner
    const subscription = await getUserSubscription(
      guestMembership.fridge.ownerId,
    );
    return {
      fridge: guestMembership.fridge,
      role: "GUEST",
      subscription,
      user,
    };
  }

  // 3. No fridge access - return null (caller will create if needed)
  return null;
}

/**
 * Get or create fridge for the user
 * Creates a new fridge if user doesn't have one and isn't a guest anywhere
 * Uses upsert to prevent race conditions (P2002 unique constraint errors)
 */
export async function getOrCreateFridge(
  user: SessionUser,
): Promise<FridgeAccessResult> {
  const existingAccess = await getFridgeAccess(user);

  if (existingAccess) {
    return existingAccess;
  }

  // Use upsert to prevent race conditions when multiple requests
  // try to create a fridge for the same user simultaneously
  const fridge = await prisma.fridge.upsert({
    where: { ownerId: user.id },
    create: {
      id: nanoid(11),
      name: "Mon Frigo",
      ownerId: user.id,
    },
    update: {}, // No updates needed if it already exists
    include: {
      eggBoxes: true,
      members: {
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      },
      owner: {
        select: { id: true, name: true, image: true, email: true },
      },
    },
  });

  const subscription = await getUserSubscription(user.id);

  return {
    fridge,
    role: "OWNER",
    subscription,
    user,
  };
}

/**
 * Get current fridge access from session
 * Returns null if not authenticated or no fridge access
 */
export async function getCurrentFridge(): Promise<FridgeAccessResult | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return getFridgeAccess(session.user);
}

/**
 * Get required current fridge - throws unauthorized if no access
 * Note: getOrCreateFridge always returns a result (creates fridge if needed)
 */
export async function getRequiredCurrentFridge(): Promise<FridgeAccessResult> {
  const user = await getRequiredUser();
  return getOrCreateFridge(user);
}

/**
 * Check if user can modify fridge (is owner)
 */
export function canModifyFridge(role: FridgeRole | "OWNER" | "GUEST"): boolean {
  return role === "OWNER";
}

/**
 * Check if user can consume eggs (owner or guest)
 * Both OWNER and GUEST can consume eggs, so this always returns true
 */
export function canConsumeEggs(_role: FridgeRole | "OWNER" | "GUEST"): boolean {
  // Both OWNER and GUEST can consume eggs
  return true;
}

export type { FridgeRole };
