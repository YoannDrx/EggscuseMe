type PeriodicSyncManager = {
  register: (tag: string, options?: { minInterval: number }) => Promise<void>;
  unregister: (tag: string) => Promise<void>;
  getTags: () => Promise<string[]>;
};

type ServiceWorkerRegistrationWithPeriodicSync = ServiceWorkerRegistration & {
  periodicSync?: PeriodicSyncManager;
};

export async function registerPeriodicSync(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = (await navigator.serviceWorker
      .ready) as ServiceWorkerRegistrationWithPeriodicSync;

    if (!registration.periodicSync) {
      return false;
    }

    // Vérifier la permission
    const status = await navigator.permissions.query({
      name: "periodic-background-sync" as PermissionName,
    });

    if (status.state !== "granted") {
      return false;
    }

    // Enregistrer la sync périodique (minimum 12 heures)
    await registration.periodicSync.register("check-expiring-eggs", {
      minInterval: 12 * 60 * 60 * 1000, // 12 heures
    });

    return true;
  } catch {
    return false;
  }
}

export async function unregisterPeriodicSync(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = (await navigator.serviceWorker
      .ready) as ServiceWorkerRegistrationWithPeriodicSync;

    if (!registration.periodicSync) {
      return false;
    }

    await registration.periodicSync.unregister("check-expiring-eggs");
    return true;
  } catch {
    return false;
  }
}

export async function isPeriodicSyncRegistered(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = (await navigator.serviceWorker
      .ready) as ServiceWorkerRegistrationWithPeriodicSync;

    if (!registration.periodicSync) {
      return false;
    }

    const tags = await registration.periodicSync.getTags();
    return tags.includes("check-expiring-eggs");
  } catch {
    return false;
  }
}

export function isPeriodicSyncSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    "serviceWorker" in navigator &&
    "periodicSync" in ServiceWorkerRegistration.prototype
  );
}
