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
    <Card className="animate-in slide-in-from-top-4 fixed top-4 right-4 z-50 w-80 shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Mise à jour disponible</CardTitle>
        <CardDescription>
          Une nouvelle version d'EggscuseMe est disponible
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={update} className="w-full">
          <RefreshCw className="mr-2 size-4" />
          Mettre à jour
        </Button>
      </CardContent>
    </Card>
  );
}
