import webPush from "web-push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT =
  process.env.VAPID_SUBJECT ?? "mailto:hello@eggscuseme.app";

// Configure web-push si les clés sont disponibles
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

export { webPush };

export type PushPayload = {
  title: string;
  body: string;
  tag?: string;
  url?: string;
  icon?: string;
  badge?: string;
  requireInteraction?: boolean;
  actions?: { action: string; title: string }[];
};

export async function sendPushNotification(
  subscription: {
    endpoint: string;
    p256dh: string;
    auth: string;
  },
  payload: PushPayload,
): Promise<boolean> {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return false;
  }

  const pushPayload = JSON.stringify({
    title: payload.title,
    body: payload.body,
    tag: payload.tag ?? "default",
    url: payload.url ?? "/",
    icon: payload.icon ?? "/icons/icon-192x192.png",
    badge: payload.badge ?? "/icons/badge-72x72.png",
    requireInteraction: payload.requireInteraction ?? false,
    actions: payload.actions ?? [],
  });

  try {
    await webPush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      pushPayload,
    );
    return true;
  } catch (error) {
    // 410 = subscription invalide, doit être supprimée
    if (
      error instanceof Error &&
      "statusCode" in error &&
      (error as Error & { statusCode: number }).statusCode === 410
    ) {
      return false;
    }
    throw error;
  }
}
