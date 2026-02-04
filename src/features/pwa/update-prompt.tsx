"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useServiceWorker } from "@/hooks/use-service-worker";
import { RefreshCw, X } from "lucide-react";
import { useState } from "react";

export function UpdatePrompt() {
  const { updateAvailable, update, registration } = useServiceWorker();
  const [dismissed, setDismissed] = useState(false);

  if (!updateAvailable || dismissed) return null;

  const handleUpdate = () => {
    // Si le SW est déjà actif (skipWaiting automatique), juste recharger
    if (!registration?.waiting) {
      window.location.reload();
      return;
    }
    void update();
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="animate-in fade-in fixed inset-0 z-40 bg-black/50"
        onClick={handleDismiss}
      />

      {/* Card centrée */}
      <Card className="animate-in zoom-in-95 fade-in fixed top-1/2 left-1/2 z-50 w-80 -translate-x-1/2 -translate-y-1/2 shadow-2xl">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">Mise à jour disponible</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={handleDismiss}
            >
              <X className="size-4" />
            </Button>
          </div>
          <CardDescription>
            Une nouvelle version d&apos;EggscuseMe est disponible
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button variant="outline" onClick={handleDismiss} className="flex-1">
            Plus tard
          </Button>
          <Button onClick={handleUpdate} className="flex-1">
            <RefreshCw className="mr-2 size-4" />
            Mettre à jour
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
