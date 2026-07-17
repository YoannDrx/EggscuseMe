"use client";

import type { FridgeAccessResult } from "@/lib/fridge/get-fridge-access";
import {
  hasChefAccess,
  hasPaidAccess,
  normalizePlanName,
  type PlanName,
} from "@/lib/auth/stripe/auth-plans";
import { useEffect, useRef } from "react";
import { create } from "zustand";

type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | null;

type FridgeStoreState = {
  id: string;
  name: string;
  role: "OWNER" | "GUEST";
  isPremium: boolean;
  isChef: boolean;
  plan: PlanName;
  ownerName: string;
  ownerImage: string | null;
  // Subscription info for trial/cancellation display
  subscriptionStatus: SubscriptionStatus;
  periodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  isTrialing: boolean;
  hasRecurringSubscription: boolean;
};

export const useCurrentFridge = create<FridgeStoreState | null>(() => null);

type InjectProps = {
  fridge: FridgeAccessResult;
  children: React.ReactNode;
};

export function InjectCurrentFridgeStore({ fridge, children }: InjectProps) {
  const isInitialized = useRef(false);

  const plan = normalizePlanName(fridge.subscription?.plan);

  // Extract subscription info for trial/cancellation display
  const subscription = fridge.subscription;
  const subscriptionStatus =
    (subscription?.status as SubscriptionStatus) ?? null;
  const periodEnd = subscription?.periodEnd ?? null;
  const cancelAtPeriodEnd = subscription?.cancelAtPeriodEnd ?? false;
  const isTrialing = subscriptionStatus === "trialing";
  const hasRecurringSubscription = Boolean(subscription?.stripeSubscriptionId);
  const hasUsableSubscription =
    subscriptionStatus === "active" ||
    subscriptionStatus === "trialing" ||
    subscriptionStatus === "past_due";
  const isPremium =
    hasPaidAccess(fridge.subscription?.plan) && hasUsableSubscription;
  const isChef =
    hasChefAccess(fridge.subscription?.plan) && hasUsableSubscription;

  // Set initial state synchronously on first render (before effects)
  // This ensures children have access to the store immediately
  if (!isInitialized.current) {
    isInitialized.current = true;
    useCurrentFridge.setState({
      id: fridge.fridge.id,
      name: fridge.fridge.name,
      role: fridge.role,
      isPremium,
      isChef,
      plan,
      ownerName: fridge.fridge.owner.name,
      ownerImage: fridge.fridge.owner.image,
      subscriptionStatus,
      periodEnd,
      cancelAtPeriodEnd,
      isTrialing,
      hasRecurringSubscription,
    });
  }

  // Update state when fridge changes
  useEffect(() => {
    useCurrentFridge.setState({
      id: fridge.fridge.id,
      name: fridge.fridge.name,
      role: fridge.role,
      isPremium,
      isChef,
      plan,
      ownerName: fridge.fridge.owner.name,
      ownerImage: fridge.fridge.owner.image,
      subscriptionStatus,
      periodEnd,
      cancelAtPeriodEnd,
      isTrialing,
      hasRecurringSubscription,
    });
  }, [
    fridge,
    isPremium,
    isChef,
    plan,
    subscriptionStatus,
    periodEnd,
    cancelAtPeriodEnd,
    isTrialing,
    hasRecurringSubscription,
  ]);

  return <>{children}</>;
}
