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

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: Refrigerator,
    title: "Frigo Virtuel",
    description:
      "Suivez toutes vos boites d'oeufs avec des indicateurs de fraicheur colores. Ne perdez plus le fil.",
  },
  {
    icon: Timer,
    title: "Timer Intelligent",
    description:
      "Temps de cuisson ajustes a la taille et temperature. Resultats parfaits garantis a chaque fois.",
  },
  {
    icon: ChefHat,
    title: "Guide Cuisson",
    description:
      "Suggestions de cuisson selon l'age. Coque, frits ou durs ? On vous dit exactement quoi faire.",
  },
  {
    icon: ScanLine,
    title: "Scan Rapide",
    description:
      "Scannez le code-barres pour ajouter une boite en un instant. Date de ponte automatique.",
  },
  {
    icon: Users,
    title: "Partage Famille",
    description:
      "Partagez votre frigo avec famille ou colocs. Tout le monde synchronise en temps reel.",
  },
  {
    icon: Bell,
    title: "Alertes Smart",
    description:
      "Notifications quand vos oeufs approchent de l'expiration. Ne jetez plus jamais un oeuf.",
  },
];

type FeatureCardsProps = {
  className?: string;
};

export function FeatureCards({ className }: FeatureCardsProps) {
  return (
    <section id="features" className={cn("bg-stone-950 py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold tracking-wider text-amber-400 uppercase"
          >
            Tout en un
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading mt-3 text-3xl font-bold text-white sm:text-4xl"
          >
            Votre assistant culinaire de poche
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-stone-400"
          >
            Des outils simples pour suivre la fraicheur et reduire le gaspillage
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bento-item group rounded-3xl border border-stone-800 bg-stone-900/50 p-6 backdrop-blur-sm"
            >
              {/* Icon */}
              <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-400/10 transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="size-6 text-amber-400" />
              </div>

              {/* Content */}
              <h3 className="font-heading mt-5 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
