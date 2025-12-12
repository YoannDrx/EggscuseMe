"use client";

import { updateAppBadge } from "@/lib/pwa/badge-api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useAppBadge() {
  const { data: expiringCount } = useQuery({
    queryKey: ["expiring-eggs-count"],
    queryFn: async () => {
      const response = await fetch("/api/fridge/expiring-count");
      if (!response.ok) return 0;
      const data = (await response.json()) as { count: number };
      return data.count;
    },
    refetchInterval: 60 * 60 * 1000, // Toutes les heures
    staleTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    if (typeof expiringCount === "number") {
      void updateAppBadge(expiringCount);
    }
  }, [expiringCount]);

  return expiringCount ?? 0;
}
