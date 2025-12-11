"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Award, Euro, Leaf, TrendingUp } from "lucide-react";
import { Eggy } from "@/features/mascot/components/eggy";
import { PageHeader } from "../../shared";
import { NumberCounter } from "./number-counter";
import { NeoButton } from "@/components/neo";

type StatCardProps = {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  icon: React.ReactNode;
  color: string;
  delay?: number;
};

function StatCard({
  title,
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  icon,
  color,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-neo-xl)] p-4",
        "bg-neo-card border-neo-border border-[length:var(--border-neo)]",
        "shadow-[var(--shadow-neo-md)]",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-neo-text-muted text-sm font-medium">{title}</p>
          <p className="text-neo-text mt-1 text-3xl font-bold">
            <NumberCounter
              value={value}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
            />
          </p>
        </div>
        <div className={cn("rounded-xl p-2", color)}>{icon}</div>
      </div>
    </motion.div>
  );
}

type MonthData = {
  month: string;
  saved: number;
};

const mockMonthlyData: MonthData[] = [
  { month: "Jan", saved: 4 },
  { month: "Fév", saved: 6 },
  { month: "Mar", saved: 3 },
  { month: "Avr", saved: 8 },
  { month: "Mai", saved: 5 },
  { month: "Juin", saved: 12 },
];

function MonthlyChart() {
  const maxValue = Math.max(...mockMonthlyData.map((d) => d.saved));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={cn(
        "rounded-[var(--radius-neo-xl)] p-4",
        "bg-neo-card border-neo-border border-[length:var(--border-neo)]",
        "shadow-[var(--shadow-neo-md)]",
      )}
    >
      <h3 className="text-neo-text mb-4 font-bold">Oeufs sauvés par mois</h3>

      <div className="flex h-32 items-end justify-between gap-2">
        {mockMonthlyData.map((data, index) => {
          const height = (data.saved / maxValue) * 100;
          return (
            <div key={data.month} className="flex flex-1 flex-col items-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className="bg-neo-accent w-full rounded-t-lg"
              />
              <span className="text-neo-text-muted mt-2 text-xs">
                {data.month}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

type StatsViewProps = {
  eggsSaved?: number;
  moneySaved?: number;
  co2Saved?: number;
  streak?: number;
};

export function StatsView({
  eggsSaved = 38,
  moneySaved = 11.4,
  co2Saved = 2.3,
  streak = 12,
}: StatsViewProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Impact"
        subtitle="Ton anti-gaspi en chiffres"
        eggyMood="celebrating"
      />

      {/* Content */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-24">
        {/* Eggy Celebration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={cn(
            "flex flex-col items-center rounded-[var(--radius-neo-xl)] py-6",
            "bg-neo-card border-neo-border border-[length:var(--border-neo)]",
            "shadow-[var(--shadow-neo-md)]",
          )}
        >
          <Eggy mood="celebrating" size="lg" />
          <p className="text-neo-text mt-4 text-center font-bold">
            Bravo pour ton engagement !
          </p>
          <p className="text-neo-text-muted text-sm">
            Tu fais une vraie différence
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Oeufs sauvés"
            value={eggsSaved}
            icon={<Award size={20} className="text-white" />}
            color="bg-fresh-extra"
            delay={0.1}
          />
          <StatCard
            title="Économisés"
            value={moneySaved}
            prefix=""
            suffix=" €"
            decimals={2}
            icon={<Euro size={20} className="text-white" />}
            color="bg-fresh"
            delay={0.2}
          />
          <StatCard
            title="CO₂ évité"
            value={co2Saved}
            suffix=" kg"
            decimals={1}
            icon={<Leaf size={20} className="text-white" />}
            color="bg-emerald-500"
            delay={0.3}
          />
          <StatCard
            title="Streak"
            value={streak}
            suffix=" jours"
            icon={<TrendingUp size={20} className="text-white" />}
            color="bg-neo-accent"
            delay={0.35}
          />
        </div>

        {/* Monthly Chart */}
        <MonthlyChart />

        {/* Premium CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={cn(
            "relative overflow-hidden rounded-[var(--radius-neo-xl)] p-4",
            "bg-neo-card border-neo-border border-[length:var(--border-neo)]",
            "shadow-[var(--shadow-neo-md)]",
          )}
        >
          <div className="flex items-center gap-4">
            <Eggy mood="hero" size="sm" />
            <div className="flex-1">
              <h4 className="text-neo-text font-bold">Passe en Premium</h4>
              <p className="text-neo-text-muted text-sm">
                Historique complet et notifications
              </p>
            </div>
            <NeoButton size="sm">2.99€</NeoButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
