const ACTIVE_SUBSCRIPTION_STATUSES = new Set([
  "active",
  "trialing",
  "past_due",
]);

export type BillingEntitlementLayers = {
  subscriptionPlan: string | null;
  subscriptionStatus: string | null;
  oneTimePlan: string | null;
};

export function resolveEffectiveBillingEntitlement(
  layers: BillingEntitlementLayers,
) {
  if (layers.oneTimePlan === "chef") {
    return { plan: "chef", status: "active" } as const;
  }

  if (
    layers.subscriptionPlan &&
    layers.subscriptionStatus &&
    ACTIVE_SUBSCRIPTION_STATUSES.has(layers.subscriptionStatus)
  ) {
    return {
      plan: layers.subscriptionPlan,
      status: layers.subscriptionStatus,
    };
  }

  return { plan: "free", status: "canceled" } as const;
}

export function hasLifetimeChefAccess(
  layers: Pick<BillingEntitlementLayers, "oneTimePlan">,
) {
  return layers.oneTimePlan === "chef";
}
