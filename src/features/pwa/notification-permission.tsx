"use client";

import { NeoButton } from "@/components/neo/neo-button";
import { cn } from "@/lib/utils";
import {
  subscribeToPush,
  PushSubscriptionError,
} from "@/lib/pwa/push-notifications";
import { motion } from "motion/react";
import { Bell, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

export function NotificationPermission() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [showCard, setShowCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        toast.success("Notifications activees avec succes !");
        setShowCard(false);
      } else if (result === "denied") {
        toast.error(
          "Vous avez refuse les notifications. Vous pouvez les activer dans les parametres de votre navigateur.",
        );
        setShowCard(false);
      }
    } catch (error) {
      if (error instanceof PushSubscriptionError) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur est survenue lors de l'activation");
      }
      // Ne pas fermer la modal en cas d'erreur pour permettre de reessayer
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => setShowCard(false);

  if (!mounted || permission !== "default" || !showCard) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleClose}
        className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={cn(
          "fixed top-1/2 left-1/2 z-[111] -translate-x-1/2 -translate-y-1/2",
          "w-[calc(100%-2rem)] max-w-sm",
          "bg-neo-card",
          "rounded-[var(--radius-neo-2xl)]",
          "border-neo-border/30 border-[length:var(--border-neo)]",
          "shadow-[var(--shadow-neo-xl)]",
          "overflow-hidden",
        )}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className={cn(
            "absolute top-3 right-3 z-10",
            "rounded-full p-2",
            "bg-neo-bg text-neo-text-muted",
            "border-neo-border/20 border-[length:var(--border-neo)]",
            "shadow-[var(--shadow-neo-sm)]",
            "hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-md)]",
            "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
            "transition-all duration-200",
          )}
        >
          <X className="size-4" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className="bg-neo-accent/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
            <Bell className="text-neo-accent size-8" />
          </div>

          {/* Text */}
          <div className="mb-6 text-center">
            <h2 className="text-neo-text mb-2 text-xl font-bold">
              Activer les notifications
            </h2>
            <p className="text-neo-text-muted text-sm">
              Soyez alerté quand vos oeufs arrivent à expiration pour éviter le
              gaspillage.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <NeoButton
              onClick={handleEnable}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Activation..." : "Activer les notifications"}
            </NeoButton>
            <NeoButton variant="ghost" onClick={handleClose} className="w-full">
              Plus tard
            </NeoButton>
          </div>
        </div>
      </motion.div>
    </>
  );

  return <>{createPortal(modalContent, document.body)}</>;
}
