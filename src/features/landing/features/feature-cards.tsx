"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import {
  Refrigerator,
  Timer,
  ChefHat,
  ScanLine,
  Users,
  Bell,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type FeatureKey =
  | "virtualFridge"
  | "smartTimer"
  | "cookingGuide"
  | "quickScan"
  | "familySharing"
  | "smartAlerts";

type Feature = {
  icon: LucideIcon;
  key: FeatureKey;
};

const features: Feature[] = [
  { icon: Refrigerator, key: "virtualFridge" },
  { icon: Timer, key: "smartTimer" },
  { icon: ChefHat, key: "cookingGuide" },
  { icon: ScanLine, key: "quickScan" },
  { icon: Users, key: "familySharing" },
  { icon: Bell, key: "smartAlerts" },
];

type FeatureCardsProps = {
  className?: string;
};

export function FeatureCards({ className }: FeatureCardsProps) {
  const t = useTranslations("landing.featureCards");

  return (
    <section id="features" className={cn("bg-background py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-semibold tracking-wider uppercase"
          >
            {t("badge")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-foreground mt-3 text-3xl font-bold sm:text-4xl"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mt-4 text-lg"
          >
            {t("description")}
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bento-item border-border bg-card/50 group rounded-3xl border p-6 backdrop-blur-sm"
            >
              {/* Icon */}
              <div className="bg-primary/10 flex size-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="text-primary size-6" />
              </div>

              {/* Content */}
              <h3 className="font-heading text-foreground mt-5 text-lg font-semibold">
                {t(`${feature.key}.title`)}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {t(`${feature.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
