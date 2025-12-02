import Redis from "ioredis";
import { logger } from "./logger";

// In-memory cache fallback when Redis is not configured
const memoryCache = new Map<string, { value: string; expireAt?: number }>();

const createMemoryRedisProxy = (): Redis => {
  return new Proxy({} as Redis, {
    get(_, prop) {
      if (prop === "get") {
        return async (key: string) => {
          const item = memoryCache.get(key);
          if (!item) return null;
          if (item.expireAt && Date.now() > item.expireAt) {
            memoryCache.delete(key);
            return null;
          }
          return item.value;
        };
      }
      if (prop === "set") {
        return async (
          key: string,
          value: string,
          _mode?: string,
          ttl?: number,
        ) => {
          memoryCache.set(key, {
            value,
            expireAt: ttl ? Date.now() + ttl * 1000 : undefined,
          });
          return "OK";
        };
      }
      if (prop === "del") {
        return async (key: string) => {
          memoryCache.delete(key);
          return 1;
        };
      }
      if (prop === "exists") {
        return async (key: string) => (memoryCache.has(key) ? 1 : 0);
      }
      if (prop === "expire") {
        return async (key: string, seconds: number) => {
          const item = memoryCache.get(key);
          if (item) {
            item.expireAt = Date.now() + seconds * 1000;
            return 1;
          }
          return 0;
        };
      }
      // Return no-op for other methods
      return async () => null;
    },
  });
};

export const redisClient: Redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          return null;
        }
        return Math.min(times * 50, 2000);
      },
      lazyConnect: false,
    })
  : (() => {
      logger.warn(
        "[Redis] REDIS_URL not configured, using in-memory cache fallback",
      );
      return createMemoryRedisProxy();
    })();
