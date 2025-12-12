"use client";

import { cn } from "@/lib/utils";
import { RefreshCw, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowBanner(true);
    };

    setIsOffline(!navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 z-50 -translate-x-1/2",
        "flex items-center gap-2 rounded-full px-4 py-2 shadow-lg",
        "text-sm font-medium",
        "animate-in slide-in-from-bottom-4",
        isOffline
          ? "bg-destructive text-destructive-foreground"
          : "bg-green-500 text-white",
      )}
    >
      {isOffline ? (
        <>
          <WifiOff className="size-4" />
          Mode hors ligne
        </>
      ) : (
        <>
          <RefreshCw className="size-4" />
          Connexion rétablie
        </>
      )}
    </div>
  );
}
