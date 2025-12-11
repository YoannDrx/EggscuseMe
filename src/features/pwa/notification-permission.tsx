"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { subscribeToPush } from "@/lib/pwa/push-notifications";
import { Bell, X } from "lucide-react";
import { useEffect, useState } from "react";

export function NotificationPermission() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [showCard, setShowCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);

      // Montrer après quelques interactions (1 minute)
      if (Notification.permission === "default") {
        const timer = setTimeout(() => setShowCard(true), 60000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleEnable = async () => {
    setIsLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        await subscribeToPush();
      }
    } finally {
      setIsLoading(false);
      setShowCard(false);
    }
  };

  if (permission !== "default" || !showCard) return null;

  return (
    <Card className="animate-in slide-in-from-bottom-4 fixed bottom-4 left-4 z-50 w-80 shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="size-5" />
            Notifications
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            onClick={() => setShowCard(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
        <CardDescription>
          Soyez alerté quand vos œufs arrivent à expiration
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button onClick={handleEnable} className="flex-1" disabled={isLoading}>
          {isLoading ? "Activation..." : "Activer"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowCard(false)}
          className="flex-1"
        >
          Plus tard
        </Button>
      </CardContent>
    </Card>
  );
}
