"use client";

import { NeoBadge, NeoSwitch } from "@/components/neo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { PlanCard } from "./plan-card";

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const t = useTranslations("landing.pricing");

  // Sur la landing page, on redirige vers signup avec le plan en paramètre
  // Le checkout Stripe sera fait après l'inscription
  const handleSelectPremium = () => {
    const plan = isYearly ? "premium-yearly" : "premium";
    window.location.href = `/auth/signup?plan=${plan}`;
  };

  const handleSelectFree = () => {
    window.location.href = "/auth/signup";
  };

  return (
    <section id="pricing" className="bg-neo-bg w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {t("title")}
            </h2>
            <p className="text-neo-text-muted max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t("subtitle")}
            </p>
          </div>

          <div className="bg-neo-card border-neo-border/30 mt-8 flex items-center space-x-4 rounded-full border-[length:var(--border-neo)] p-2 shadow-[var(--shadow-neo-sm)]">
            <span
              className={cn(
                "rounded-full px-4 py-2 text-sm font-bold transition-all duration-200",
                !isYearly
                  ? "bg-neo-bg text-neo-text shadow-[var(--shadow-neo-sm)]"
                  : "text-neo-text-muted",
              )}
            >
              {t("monthly")}
            </span>
            <NeoSwitch checked={isYearly} onCheckedChange={setIsYearly} />
            <div
              className={cn(
                "flex items-center rounded-full px-4 py-2 transition-all duration-200",
                isYearly
                  ? "bg-neo-bg text-neo-text shadow-[var(--shadow-neo-sm)]"
                  : "text-neo-text-muted",
              )}
            >
              <span className="text-sm font-bold">{t("yearly")}</span>
              <NeoBadge variant="outline" className="ml-2">
                {t("discount")}
              </NeoBadge>
            </div>
          </div>
        </div>

        <div
          className="mx-auto mt-16 grid max-w-3xl gap-8 lg:gap-12"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          <PlanCard
            plan="free"
            onSelect={handleSelectFree}
            showYearly={false}
          />
          <PlanCard
            plan="premium"
            onSelect={handleSelectPremium}
            showYearly={isYearly}
          />
        </div>

        <div className="mt-16 text-center">
          <p className="text-neo-text-muted">{t("footer")}</p>
          <p className="text-neo-text-muted mt-2">
            {t("question")}{" "}
            <Link
              href="/contact"
              className="text-neo-accent font-bold hover:underline"
            >
              {t("contactUs")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
