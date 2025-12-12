"use client";

import { registerServiceWorker } from "@/lib/pwa/service-worker-registration";
import { setupOnlineListener } from "@/lib/pwa/offline-sync";
import { registerPeriodicSync } from "@/lib/pwa/periodic-sync";
import { useEffect } from "react";
import { InstallPrompt } from "./install-prompt";
import { NotificationPermission } from "./notification-permission";
import { OfflineIndicator } from "./offline-indicator";
import { UpdatePrompt } from "./update-prompt";

export function PWAProvider() {
  useEffect(() => {
    // Enregistrer le service worker
    void registerServiceWorker().then((registration) => {
      if (registration) {
        // Essayer d'enregistrer le periodic sync
        void registerPeriodicSync();
      }
    });

    // Configurer l'écouteur pour la reconnexion
    setupOnlineListener();
  }, []);

  return (
    <>
      <OfflineIndicator />
      <InstallPrompt />
      <UpdatePrompt />
      <NotificationPermission />
    </>
  );
}
