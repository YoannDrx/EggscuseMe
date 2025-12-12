import type { DBSchema, IDBPDatabase } from "idb";
import { openDB } from "idb";

// Types pour les données stockées
export type CachedFridge = {
  id: string;
  name: string;
  ownerId: string;
  fridgeType: string;
  location: string | null;
  isDefault: boolean;
  updatedAt: number;
};

export type CachedEggBox = {
  id: string;
  fridgeId: string;
  count: number;
  size: string;
  layingDate: string;
  status: string;
  temperature: string;
  createdAt: number;
  updatedAt: number;
};

export type SyncQueueItem = {
  id?: number;
  action: "create" | "update" | "delete" | "consume";
  entity: "eggBox" | "fridge" | "consumption";
  payload: Record<string, unknown>;
  timestamp: number;
  retries: number;
};

export type CachedSession = {
  id: string;
  userId: string;
  plan: "free" | "brigade" | "chef";
  expiresAt: number;
};

// Schema de la base de données
type EggscuseDB = {
  fridges: {
    key: string;
    value: CachedFridge;
    indexes: { "by-owner": string };
  };
  eggBoxes: {
    key: string;
    value: CachedEggBox;
    indexes: { "by-fridge": string };
  };
  syncQueue: {
    key: number;
    value: SyncQueueItem;
  };
  session: {
    key: string;
    value: CachedSession;
  };
} & DBSchema

const DB_NAME = "eggscuseme-offline";
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<EggscuseDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<EggscuseDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<EggscuseDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Fridges store
      if (!db.objectStoreNames.contains("fridges")) {
        const fridgeStore = db.createObjectStore("fridges", { keyPath: "id" });
        fridgeStore.createIndex("by-owner", "ownerId");
      }

      // EggBoxes store
      if (!db.objectStoreNames.contains("eggBoxes")) {
        const eggBoxStore = db.createObjectStore("eggBoxes", { keyPath: "id" });
        eggBoxStore.createIndex("by-fridge", "fridgeId");
      }

      // Sync queue
      if (!db.objectStoreNames.contains("syncQueue")) {
        db.createObjectStore("syncQueue", {
          keyPath: "id",
          autoIncrement: true,
        });
      }

      // Session cache
      if (!db.objectStoreNames.contains("session")) {
        db.createObjectStore("session", { keyPath: "id" });
      }
    },
  });

  return dbInstance;
}

// ==================== FRIDGES ====================

export async function cacheFridges(fridges: CachedFridge[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("fridges", "readwrite");
  await Promise.all(fridges.map(async (f) => tx.store.put(f)));
  await tx.done;
}

export async function getCachedFridges(
  ownerId: string,
): Promise<CachedFridge[]> {
  const db = await getDB();
  return db.getAllFromIndex("fridges", "by-owner", ownerId);
}

export async function getCachedFridge(
  id: string,
): Promise<CachedFridge | undefined> {
  const db = await getDB();
  return db.get("fridges", id);
}

export async function deleteCachedFridge(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("fridges", id);
}

// ==================== EGG BOXES ====================

export async function cacheEggBoxes(boxes: CachedEggBox[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("eggBoxes", "readwrite");
  await Promise.all(boxes.map(async (b) => tx.store.put(b)));
  await tx.done;
}

export async function getCachedEggBoxes(
  fridgeId: string,
): Promise<CachedEggBox[]> {
  const db = await getDB();
  return db.getAllFromIndex("eggBoxes", "by-fridge", fridgeId);
}

export async function getCachedEggBox(
  id: string,
): Promise<CachedEggBox | undefined> {
  const db = await getDB();
  return db.get("eggBoxes", id);
}

export async function deleteCachedEggBox(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("eggBoxes", id);
}

export async function clearCachedEggBoxesForFridge(
  fridgeId: string,
): Promise<void> {
  const db = await getDB();
  const boxes = await db.getAllFromIndex("eggBoxes", "by-fridge", fridgeId);
  const tx = db.transaction("eggBoxes", "readwrite");
  await Promise.all(boxes.map(async (b) => tx.store.delete(b.id)));
  await tx.done;
}

// ==================== SYNC QUEUE ====================

export async function addToSyncQueue(
  item: Omit<SyncQueueItem, "id">,
): Promise<number> {
  const db = await getDB();
  const id = await db.add("syncQueue", item as SyncQueueItem);

  // Demander une sync si Background Sync est supporté
  if (
    "serviceWorker" in navigator &&
    "sync" in ServiceWorkerRegistration.prototype
  ) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await (
        registration as ServiceWorkerRegistration & {
          sync: { register: (tag: string) => Promise<void> };
        }
      ).sync.register(`sync-${item.entity}-changes`);
    } catch {
      // Background Sync non disponible, sera synchronisé au prochain online
    }
  }

  return id;
}

export async function getSyncQueue(): Promise<SyncQueueItem[]> {
  const db = await getDB();
  return db.getAll("syncQueue");
}

export async function clearSyncQueueItem(id: number): Promise<void> {
  const db = await getDB();
  await db.delete("syncQueue", id);
}

export async function updateSyncQueueRetries(
  id: number,
  retries: number,
): Promise<void> {
  const db = await getDB();
  const item = await db.get("syncQueue", id);
  if (item) {
    item.retries = retries;
    await db.put("syncQueue", item);
  }
}

// ==================== SESSION ====================

export async function cacheSession(session: CachedSession): Promise<void> {
  const db = await getDB();
  await db.put("session", session);
}

export async function getCachedSession(): Promise<CachedSession | undefined> {
  const db = await getDB();
  const sessions = await db.getAll("session");
  // Retourner la session la plus récente non expirée
  const validSessions = sessions.filter((s) => s.expiresAt > Date.now());
  return validSessions[0];
}

export async function clearCachedSession(): Promise<void> {
  const db = await getDB();
  await db.clear("session");
}

// ==================== UTILITIES ====================

export async function clearAllData(): Promise<void> {
  const db = await getDB();
  await Promise.all([
    db.clear("fridges"),
    db.clear("eggBoxes"),
    db.clear("syncQueue"),
    db.clear("session"),
  ]);
}

export async function isOnline(): Promise<boolean> {
  return navigator.onLine;
}
