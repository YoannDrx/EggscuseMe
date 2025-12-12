const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export class PushSubscriptionError extends Error {
  constructor(
    message: string,
    public code:
      | "NOT_SUPPORTED"
      | "VAPID_MISSING"
      | "SERVICE_WORKER_ERROR"
      | "SUBSCRIPTION_ERROR"
      | "SERVER_ERROR",
  ) {
    super(message);
    this.name = "PushSubscriptionError";
  }
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const uint8Array = Uint8Array.from(
    [...rawData].map((char) => char.charCodeAt(0)),
  );
  return uint8Array.buffer as ArrayBuffer;
}

export async function subscribeToPush(): Promise<PushSubscription> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new PushSubscriptionError(
      "Les notifications push ne sont pas supportées par ce navigateur",
      "NOT_SUPPORTED",
    );
  }

  if (!VAPID_PUBLIC_KEY) {
    throw new PushSubscriptionError(
      "Configuration du serveur manquante",
      "VAPID_MISSING",
    );
  }

  const registration = await navigator.serviceWorker.ready.catch(() => {
    throw new PushSubscriptionError(
      "Le service worker n'est pas disponible",
      "SERVICE_WORKER_ERROR",
    );
  });

  const existingSubscription = await registration.pushManager.getSubscription();

  const subscription =
    existingSubscription ??
    (await registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })
      .catch(() => {
        throw new PushSubscriptionError(
          "Impossible de s'abonner aux notifications",
          "SUBSCRIPTION_ERROR",
        );
      }));

  // Envoyer au serveur
  const response = await fetch("/api/push-subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription.toJSON()),
  });

  if (!response.ok) {
    throw new PushSubscriptionError(
      "Erreur lors de l'enregistrement sur le serveur",
      "SERVER_ERROR",
    );
  }

  return subscription;
}

export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await fetch("/api/push-subscription", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
      await subscription.unsubscribe();
    }

    return true;
  } catch {
    return false;
  }
}

export async function getPushSubscription(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator)) return null;

  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch {
    return null;
  }
}

export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function getNotificationPermission(): NotificationPermission | null {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return null;
  }
  return Notification.permission;
}
