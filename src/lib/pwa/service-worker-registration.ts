export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  // Ne pas enregistrer en développement
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });

    // Vérifier les mises à jour périodiquement (toutes les heures)
    setInterval(
      () => {
        void registration.update();
      },
      60 * 60 * 1000,
    );

    // Gérer les mises à jour
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          // Nouvelle version disponible
          window.dispatchEvent(new CustomEvent("sw-update-available"));
        }
      });
    });

    return registration;
  } catch {
    return null;
  }
}

export async function unregisterServiceWorker(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.unregister();
  } catch {
    return false;
  }
}

export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;

  try {
    return await navigator.serviceWorker.ready;
  } catch {
    return null;
  }
}

export function sendMessageToServiceWorker(
  message: Record<string, unknown>,
): void {
  if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) {
    return;
  }

  navigator.serviceWorker.controller.postMessage(message);
}
