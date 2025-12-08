"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Star, Users, Egg, Award } from "lucide-react";
import { Eggy } from "@/features/mascot";

type BentoGridProps = {
  className?: string;
};

export function BentoGrid({ className }: BentoGridProps) {
  return (
    <section className={cn("bg-background py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Steps */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary text-sm font-semibold tracking-wider uppercase"
            >
              Comment ca marche
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-heading text-foreground mt-3 text-3xl font-bold sm:text-4xl"
            >
              Si simple que vous n&apos;aurez{" "}
              <span className="text-primary">aucune excuse</span>.
            </motion.h2>

            {/* Steps List */}
            <div className="mt-10 space-y-8">
              {[
                {
                  num: "01",
                  title: "Scannez ou Saisissez",
                  desc: "Ajoutez vos boites d'oeufs en scannant le code ou en entrant la date de ponte.",
                },
                {
                  num: "02",
                  title: "Laissez faire la magie",
                  desc: "L'app calcule automatiquement la fraicheur et vous suggere les meilleures recettes.",
                },
                {
                  num: "03",
                  title: "Cuisinez & Savourez",
                  desc: "Suivez le timer intelligent pour des oeufs parfaitement cuits a chaque fois.",
                },
              ].map((step, index) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <span className="font-heading text-muted text-4xl font-bold">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-heading text-foreground text-lg font-semibold">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Bento Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Rating Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bento-item border-border bg-card/50 rounded-3xl border p-6"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="fill-primary text-primary size-5" />
                ))}
              </div>
              <div className="text-foreground mt-4 text-4xl font-bold">
                4.9/5
              </div>
              <p className="text-muted-foreground mt-1 text-sm">App Store</p>
            </motion.div>

            {/* Users Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bento-item border-border bg-card/50 rounded-3xl border p-6"
            >
              <Users className="text-fresh size-8" />
              <div className="text-foreground mt-4 text-4xl font-bold">
                10K+
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                Utilisateurs actifs
              </p>
            </motion.div>

            {/* Eggs Saved Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bento-item border-border bg-card/50 rounded-3xl border p-6"
            >
              <Egg className="text-primary size-8" />
              <div className="text-foreground mt-4 text-4xl font-bold">
                2.4M
              </div>
              <p className="text-muted-foreground mt-1 text-sm">Oeufs sauves</p>
            </motion.div>

            {/* Family Sharing Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bento-item border-border bg-primary/10 rounded-3xl border p-6"
            >
              <Award className="text-primary size-8" />
              <div className="text-foreground mt-4 text-lg font-semibold">
                Partage Familial
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                Synchronisez avec votre famille
              </p>
            </motion.div>

            {/* Testimonial Card - Spans full width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="border-border bg-card/50 col-span-2 flex items-center gap-4 rounded-3xl border p-6"
            >
              <div className="shrink-0">
                <Eggy mood="happy" size="sm" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm italic">
                  &quot;Depuis que j&apos;utilise EggscuseMe, je n&apos;ai plus
                  jamais jete un seul oeuf. L&apos;app est geniale !&quot;
                </p>
                <p className="text-primary mt-2 text-xs font-semibold">
                  Marie D. - Paris
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
