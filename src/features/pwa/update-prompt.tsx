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
import { RefreshCw } from "lucide-react";

export function UpdatePrompt() {
  const { updateAvailable, update } = useServiceWorker();

  if (!updateAvailable) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="animate-in fade-in fixed inset-0 z-40 bg-black/50" />

      {/* Card centrée */}
      <Card className="animate-in zoom-in-95 fade-in fixed top-1/2 left-1/2 z-50 w-80 -translate-x-1/2 -translate-y-1/2 shadow-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Mise à jour disponible</CardTitle>
          <CardDescription>
            Une nouvelle version d&apos;EggscuseMe est disponible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={update} className="w-full">
            <RefreshCw className="mr-2 size-4" />
            Mettre à jour
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
