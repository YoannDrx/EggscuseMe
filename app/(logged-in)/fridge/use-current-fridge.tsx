"use client";

import type { FridgeAccessResult } from "@/lib/fridge/get-fridge-access";
import { useEffect, useRef } from "react";
import { create } from "zustand";

type FridgeStoreState = {
  id: string;
  name: string;
  role: "OWNER" | "GUEST";
  isPremium: boolean;
  ownerName: string;
  ownerImage: string | null;
};

export const useCurrentFridge = create<FridgeStoreState | null>(() => null);

type InjectProps = {
  fridge: FridgeAccessResult;
  children: React.ReactNode;
};

export function InjectCurrentFridgeStore({ fridge, children }: InjectProps) {
  const isInitialized = useRef(false);

  // Set initial state synchronously on first render (before effects)
  // This ensures children have access to the store immediately
  if (!isInitialized.current) {
    isInitialized.current = true;
    useCurrentFridge.setState({
      id: fridge.fridge.id,
      name: fridge.fridge.name,
      role: fridge.role,
      isPremium:
        fridge.subscription !== null && fridge.subscription.plan !== "free",
      ownerName: fridge.fridge.owner.name,
      ownerImage: fridge.fridge.owner.image,
    });
  }

  // Update state when fridge changes
  useEffect(() => {
    useCurrentFridge.setState({
      id: fridge.fridge.id,
      name: fridge.fridge.name,
      role: fridge.role,
      isPremium:
        fridge.subscription !== null && fridge.subscription.plan !== "free",
      ownerName: fridge.fridge.owner.name,
      ownerImage: fridge.fridge.owner.image,
    });
  }, [fridge]);

  return <>{children}</>;
}
