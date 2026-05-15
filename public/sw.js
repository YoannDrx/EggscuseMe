/// <reference lib="webworker" />

const CACHE_NAME = "eggscuseme-v2";
const STATIC_CACHE_NAME = "eggscuseme-static-v2";
const DYNAMIC_CACHE_NAME = "eggscuseme-dynamic-v2";

// Assets à pré-cacher
const STATIC_ASSETS = [
  "/",
  "/fridge",
  "/fridge/timer",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Installation du Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      // Ne pas bloquer l'installation si certains assets ne sont pas disponibles
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("Some assets failed to cache:", err);
      });
    }),
  );
  // Activer immédiatement
  self.skipWaiting();
});

// Activation - nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return (
              name.startsWith("eggscuseme-") &&
              name !== STATIC_CACHE_NAME &&
              name !== DYNAMIC_CACHE_NAME
            );
          })
          .map((name) => caches.delete(name)),
      );
    }),
  );
  // Prendre le contrôle immédiatement
  self.clients.claim();
});

// Stratégies de fetch
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET
  if (request.method !== "GET") return;

  // Ignorer les extensions Chrome et autres protocoles
  if (!url.protocol.startsWith("http")) return;

  // API Auth - Network Only (jamais de cache)
  if (url.pathname.startsWith("/api/auth")) {
    event.respondWith(fetch(request));
    return;
  }

  // API Stripe - Network Only
  if (
    url.pathname.startsWith("/api/stripe") ||
    url.pathname.startsWith("/api/webhooks")
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // API Fridge - Network First to avoid stale authenticated inventory
  if (url.pathname.startsWith("/api/fridge")) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
    return;
  }

  // Assets Next.js (_next/static) - Network First pour éviter les problèmes de cache
  // Les hashes changent à chaque build, donc on veut toujours la dernière version
  if (url.pathname.startsWith("/_next/")) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
    return;
  }

  // Images et fonts - Cache First (ces fichiers changent rarement)
  if (request.destination === "image" || request.destination === "font") {
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
    return;
  }

  // CSS et JS hors Next.js - Network First pour éviter désynchronisation
  if (request.destination === "style" || request.destination === "script") {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
    return;
  }

  // Pages HTML - Network First avec fallback
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
    return;
  }

  // Par défaut - Network First
  event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
});

// Stratégie Cache First
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Retourner une réponse offline si disponible
    return new Response("Offline", { status: 503 });
  }
}

// Stratégie Network First
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }

    // Fallback pour les pages de navigation
    if (request.mode === "navigate") {
      const offlinePage = await cache.match("/");
      if (offlinePage) {
        return offlinePage;
      }
    }

    return new Response("Offline", { status: 503 });
  }
}

// Gestion des notifications push
self.addEventListener("push", (event) => {
  let data = { title: "EggscuseMe", body: "", tag: "default", url: "/" };

  try {
    data = { ...data, ...event.data?.json() };
  } catch (e) {
    data.body = event.data?.text() || "";
  }

  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    tag: data.tag,
    data: { url: data.url },
    vibrate: [200, 100, 200],
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Clic sur notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  // Gérer les actions
  if (event.action === "dismiss") {
    return;
  }

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        // Chercher une fenêtre existante
        for (const client of clients) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }
        // Ouvrir une nouvelle fenêtre
        return self.clients.openWindow(url);
      }),
  );
});

// Periodic Background Sync (Chrome 80+)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "check-expiring-eggs") {
    event.waitUntil(checkExpiringEggsInBackground());
  }
});

// Timer notification depuis le main thread
self.addEventListener("message", (event) => {
  if (event.data?.type === "TIMER_COMPLETE") {
    self.registration.showNotification("Minuteur terminé !", {
      body: event.data.message || "Vos œufs sont prêts !",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/badge-72x72.png",
      tag: "timer",
      vibrate: [500, 200, 500, 200, 500],
      requireInteraction: true,
      actions: [
        { action: "open", title: "Ouvrir" },
        { action: "dismiss", title: "Fermer" },
      ],
    });
  }

  // Skip waiting
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Vérification des œufs expirant en arrière-plan
async function checkExpiringEggsInBackground() {
  try {
    const response = await fetch("/api/fridge/expiring-summary");
    if (!response.ok) return;

    const data = await response.json();

    if (data.expiringCount > 0) {
      await self.registration.showNotification("Œufs bientôt périmés", {
        body: `${data.expiringCount} boîte(s) arrive(nt) à expiration`,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/badge-72x72.png",
        tag: "expiring-eggs-background",
        data: { url: "/fridge" },
      });

      // Mettre à jour le badge
      if ("setAppBadge" in navigator) {
        await navigator.setAppBadge(data.expiringCount);
      }
    }
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}
