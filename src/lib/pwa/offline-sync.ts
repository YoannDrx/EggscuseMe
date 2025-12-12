import type { SyncQueueItem } from "./idb-store";
import {
  clearSyncQueueItem,
  getSyncQueue,
  updateSyncQueueRetries,
} from "./idb-store";

const MAX_RETRIES = 3;

async function processSyncItem(item: SyncQueueItem): Promise<void> {
  if (!item.id) return;

  let endpoint: string;
  let method: string;
  let body: string | undefined;

  switch (item.action) {
    case "create":
      endpoint = `/api/${item.entity}`;
      method = "POST";
      body = JSON.stringify(item.payload);
      break;
    case "update":
      endpoint = `/api/${item.entity}/${item.payload.id}`;
      method = "PATCH";
      body = JSON.stringify(item.payload);
      break;
    case "delete":
      endpoint = `/api/${item.entity}/${item.payload.id}`;
      method = "DELETE";
      break;
    case "consume":
      endpoint = `/api/egg-consumption`;
      method = "POST";
      body = JSON.stringify(item.payload);
      break;
    default:
      return;
  }

  try {
    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (response.ok) {
      await clearSyncQueueItem(item.id);
    } else if (item.retries >= MAX_RETRIES) {
      await clearSyncQueueItem(item.id);
    } else {
      await updateSyncQueueRetries(item.id, item.retries + 1);
    }
  } catch {
    if (item.retries < MAX_RETRIES) {
      await updateSyncQueueRetries(item.id, item.retries + 1);
    } else {
      await clearSyncQueueItem(item.id);
    }
  }
}

export async function processSyncQueue(): Promise<void> {
  const queue = await getSyncQueue();
  // Traiter les items séquentiellement avec reduce
  await queue.reduce(
    async (promise, item) => promise.then(async () => processSyncItem(item)),
    Promise.resolve(),
  );
}

export function setupOnlineListener(): void {
  if (typeof window === "undefined") return;

  window.addEventListener("online", () => {
    void processSyncQueue();
  });
}

export function isOnline(): boolean {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine;
}
