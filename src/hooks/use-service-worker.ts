"use client";

import { registerServiceWorker } from "@/lib/pwa/service-worker-registration";
import { useEffect, useState } from "react";

export function useServiceWorker() {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Vérifier le support
    setIsSupported("serviceWorker" in navigator);

    // Enregistrer le service worker
    void registerServiceWorker().then(setRegistration);

    // Écouter les mises à jour disponibles
    const handleUpdate = () => setUpdateAvailable(true);
    window.addEventListener("sw-update-available", handleUpdate);

    return () => {
      window.removeEventListener("sw-update-available", handleUpdate);
    };
  }, []);

  const update = async () => {
    if (!registration?.waiting) return;
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
    window.location.reload();
  };

  return {
    registration,
    updateAvailable,
    isSupported,
    update,
  };
}
