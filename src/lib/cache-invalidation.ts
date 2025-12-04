import { logger } from "./logger";
import { redisClient } from "./redis";
import { CacheKeys } from "./redis-keys";

export async function invalidateUserFridgeCache(userId: string) {
  try {
    await redisClient.del(CacheKeys.userFridge(userId));
  } catch (error) {
    logger.error("[Cache] Failed to invalidate user fridge:", error);
  }
}

export async function invalidateUserSubscriptionCache(userId: string) {
  try {
    await redisClient.del(CacheKeys.userSubscription(userId));
  } catch (error) {
    logger.error("[Cache] Failed to invalidate user subscription:", error);
  }
}

export async function invalidateAllUserCaches(userId: string) {
  try {
    await Promise.all([
      redisClient.del(CacheKeys.userFridge(userId)),
      redisClient.del(CacheKeys.userSubscription(userId)),
    ]);
  } catch (error) {
    logger.error("[Cache] Failed to invalidate all user caches:", error);
  }
}
