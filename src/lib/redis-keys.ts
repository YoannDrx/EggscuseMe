export const CacheKeys = {
  sessionData: (sessionId: string) => `session:${sessionId}`,
  userFridge: (userId: string) => `user:${userId}:fridge`,
  userSubscription: (userId: string) => `user:${userId}:subscription`,
} as const;

export const CacheTTL = {
  SESSION_DATA: 60 * 15, // 15 minutes
  USER_FRIDGE: 60 * 10, // 10 minutes
  USER_SUBSCRIPTION: 60 * 60, // 1 hour
} as const;
