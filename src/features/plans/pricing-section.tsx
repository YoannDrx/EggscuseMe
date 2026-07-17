"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { PlanCard } from "./plan-card";

export function Pricing() {
  const t = useTranslations("landing.pricing");

  // Sur la landing page, on redirige vers signup avec le plan en paramètre
  // Le checkout Stripe sera fait après l'inscription
  const handleSelectSolo = () => {
    window.location.href = "/auth/signup";
  };

  const handleSelectChef = () => {
    window.location.href = "/auth/signup?plan=chef";
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
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl gap-6 md:grid-cols-2 lg:gap-8">
          <PlanCard
            plan="solo"
            onSelect={handleSelectSolo}
            showYearly={false}
          />
          <PlanCard
            plan="chef"
            onSelect={handleSelectChef}
            showYearly={false}
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
