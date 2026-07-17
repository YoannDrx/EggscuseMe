import {
  hasLifetimeChefAccess,
  resolveEffectiveBillingEntitlement,
} from "@/features/fridge/billing-entitlement";
import { describe, expect, it } from "vitest";

describe("billing entitlement layers", () => {
  it("gives lifetime Chef priority over a Brigade subscription", () => {
    expect(
      resolveEffectiveBillingEntitlement({
        subscriptionPlan: "brigade",
        subscriptionStatus: "active",
        oneTimePlan: "chef",
      }),
    ).toEqual({ plan: "chef", status: "active" });
  });

  it("falls back to an active historical subscription", () => {
    expect(
      resolveEffectiveBillingEntitlement({
        subscriptionPlan: "brigade",
        subscriptionStatus: "trialing",
        oneTimePlan: null,
      }),
    ).toEqual({ plan: "brigade", status: "trialing" });
  });

  it("falls back to free after cancellation without a purchase", () => {
    expect(
      resolveEffectiveBillingEntitlement({
        subscriptionPlan: "brigade",
        subscriptionStatus: "canceled",
        oneTimePlan: null,
      }),
    ).toEqual({ plan: "free", status: "canceled" });
  });

  it("detects lifetime access explicitly", () => {
    expect(hasLifetimeChefAccess({ oneTimePlan: "chef" })).toBe(true);
    expect(hasLifetimeChefAccess({ oneTimePlan: null })).toBe(false);
  });
});
