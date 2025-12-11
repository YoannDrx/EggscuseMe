"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import {
  Refrigerator,
  Timer,
  ChefHat,
  BarChart3,
  Plus,
  Egg,
  Utensils,
  PiggyBank,
  Clock,
  Play,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import { useState } from "react";

// =============================================================================
// TYPES
// =============================================================================

type PhoneTab = "fridge" | "timer" | "guide" | "stats";

// =============================================================================
// FAKE DATA
// =============================================================================

const eggBoxes = [
  {
    id: "1",
    name: "Œufs bio",
    source: "Ferme du Soleil",
    remaining: 6,
    total: 6,
    status: "extra-fresh" as const,
    daysLeft: "J-4",
    progress: 85,
    size: "L",
  },
  {
    id: "2",
    name: "Boîte famille",
    source: "Carrefour",
    remaining: 8,
    total: 12,
    status: "fresh" as const,
    daysLeft: "J-12",
    progress: 55,
    size: "M",
  },
  {
    id: "3",
    name: "Œufs fermiers",
    source: "Marché local",
    remaining: 2,
    total: 6,
    status: "cook" as const,
    daysLeft: "J-25",
    progress: 15,
    size: "XL",
  },
];

const timerOptions = [
  { id: "runny", label: "Coulant", time: "4 min", color: "bg-amber-400" },
  { id: "soft", label: "Mollet", time: "6 min", color: "bg-amber-500" },
  { id: "medium", label: "Mi-cuit", time: "8 min", color: "bg-orange-400" },
  { id: "hard", label: "Dur", time: "10 min", color: "bg-orange-500" },
];

const recipes = [
  {
    name: "Omelette",
    time: "10 min",
    eggs: 3,
    tag: "Rapide",
    status: "fresh" as const,
  },
  {
    name: "Brouillés",
    time: "8 min",
    eggs: 2,
    tag: "Facile",
    status: "fresh" as const,
  },
  {
    name: "Mousse choco",
    time: "20 min",
    eggs: 4,
    tag: "Dessert",
    status: "extra-fresh" as const,
  },
  {
    name: "Dur mayo",
    time: "15 min",
    eggs: 2,
    tag: "Classique",
    status: "cook" as const,
  },
  {
    name: "Au plat",
    time: "5 min",
    eggs: 1,
    tag: "Express",
    status: "fresh" as const,
  },
  {
    name: "Crème anglaise",
    time: "25 min",
    eggs: 3,
    tag: "Dessert",
    status: "extra-fresh" as const,
  },
];

const kpis = [
  {
    label: "Total",
    value: "24",
    icon: Egg,
    trend: "+6",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Consommés",
    value: "18",
    icon: Utensils,
    trend: "ce mois",
    color: "text-neutral-500",
    bg: "bg-neutral-500/10",
  },
  {
    label: "Économies",
    value: "12€",
    icon: PiggyBank,
    trend: "sauvés",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Fraîcheur",
    value: "8j",
    icon: Clock,
    trend: "moyenne",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const weeklyData = [
  { day: "L", value: 2 },
  { day: "M", value: 4 },
  { day: "M", value: 1 },
  { day: "J", value: 3 },
  { day: "V", value: 5 },
  { day: "S", value: 2 },
  { day: "D", value: 3 },
];

const cookingTypes = [
  { type: "Dur", percent: 35, color: "bg-amber-400" },
  { type: "Mollet", percent: 25, color: "bg-orange-400" },
  { type: "Plat", percent: 25, color: "bg-emerald-400" },
  { type: "Autre", percent: 15, color: "bg-neutral-400" },
];

const tabConfig = {
  fridge: { title: "Mon Frigo", subtitle: "3 boîtes en cours" },
  timer: { title: "Minuteur", subtitle: "Choisissez votre cuisson" },
  guide: { title: "Recettes", subtitle: "6 suggestions" },
  stats: { title: "Statistiques", subtitle: "Ce mois-ci" },
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function MiniEggyChef({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 120" fill="none">
      <ellipse
        cx="50"
        cy="12"
        rx="30"
        ry="12"
        stroke="#1C1917"
        fill="white"
        strokeWidth="2"
      />
      <rect
        x="25"
        y="10"
        width="50"
        height="15"
        stroke="#1C1917"
        fill="white"
        strokeWidth="2"
      />
      <ellipse cx="50" cy="10" rx="25" ry="10" fill="white" />
      <circle
        cx="35"
        cy="8"
        r="10"
        stroke="#1C1917"
        fill="white"
        strokeWidth="1.5"
      />
      <circle
        cx="50"
        cy="5"
        r="12"
        stroke="#1C1917"
        fill="white"
        strokeWidth="1.5"
      />
      <circle
        cx="65"
        cy="8"
        r="10"
        stroke="#1C1917"
        fill="white"
        strokeWidth="1.5"
      />
      <ellipse
        cx="50"
        cy="65"
        rx="40"
        ry="50"
        fill="#FDFBF7"
        stroke="#1C1917"
        strokeWidth="2"
      />
      <ellipse cx="35" cy="55" rx="6" ry="7" fill="#1C1917" />
      <ellipse cx="65" cy="55" rx="6" ry="7" fill="#1C1917" />
      <circle cx="37" cy="53" r="2" fill="white" />
      <circle cx="67" cy="53" r="2" fill="white" />
      <path
        d="M35 75 Q50 88, 65 75"
        stroke="#1C1917"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="25" cy="70" rx="5" ry="3" fill="#FFB6C1" fillOpacity="0.4" />
      <ellipse cx="75" cy="70" rx="5" ry="3" fill="#FFB6C1" fillOpacity="0.4" />
    </svg>
  );
}

function MiniFreshnessTag({
  status,
  label,
}: {
  status: "extra-fresh" | "fresh" | "cook";
  label: string;
}) {
  const config = {
    "extra-fresh": {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500",
      text: "text-emerald-600",
      fill: "#22C55E",
    },
    fresh: {
      bg: "bg-amber-400/10",
      border: "border-amber-400",
      text: "text-amber-600",
      fill: "#FBBF24",
    },
    cook: {
      bg: "bg-orange-500/10",
      border: "border-orange-500",
      text: "text-orange-600",
      fill: "#F97316",
    },
  };
  const c = config[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[8px] font-medium",
        c.bg,
        c.border,
        c.text,
      )}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <ellipse
          cx="12"
          cy="13"
          rx="8"
          ry="9"
          fill="#FDFBF7"
          stroke="#1C1917"
          strokeWidth={1.5}
        />
        <ellipse cx="9" cy="11" rx="1.5" ry="2" fill="#1C1917" />
        <ellipse cx="15" cy="11" rx="1.5" ry="2" fill="#1C1917" />
        <circle cx="9.5" cy="10.5" r="0.5" fill="white" />
        <circle cx="15.5" cy="10.5" r="0.5" fill="white" />
        <circle
          cx="19"
          cy="6"
          r="3"
          fill={c.fill}
          stroke="#1C1917"
          strokeWidth={0.5}
        />
      </svg>
      <span>{label}</span>
    </div>
  );
}

function NavButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Refrigerator;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-0.5 py-2 transition-colors",
        active ? "text-neo-accent" : "text-neo-text-muted",
      )}
    >
      <Icon className="size-5" />
      <span className="text-[9px] font-medium">{label}</span>
      {active && (
        <motion.div
          layoutId="phone-nav-pill"
          className="absolute -bottom-1 h-0.5 w-6 rounded-full bg-neo-accent"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}

// =============================================================================
// CONTENT VIEWS
// =============================================================================

function FridgeContent() {
  const statusLabels = {
    "extra-fresh": "Extra-frais",
    fresh: "Frais",
    cook: "À cuire",
  };
  const statusColors = {
    "extra-fresh": "bg-emerald-500",
    fresh: "bg-amber-400",
    cook: "bg-orange-500",
  };

  return (
    <div className="space-y-4">
      {/* Stats Cards - Horizontal Scroll */}
      <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 }}
            className="border-neo-border bg-neo-card flex min-w-[100px] flex-col rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)] p-2 shadow-[var(--shadow-neo-sm)]"
          >
            <div className="mb-1 flex items-center gap-1.5">
              <div
                className={cn(
                  "flex size-5 items-center justify-center rounded-full",
                  kpi.bg,
                )}
              >
                <kpi.icon className={cn("size-3", kpi.color)} />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-neo-text text-sm font-bold">
                {kpi.value}
              </span>
              <p className="text-neo-text-muted text-[8px] leading-tight">
                {kpi.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Egg Boxes List */}
      <div className="space-y-3">
        {eggBoxes.map((box, index) => (
          <motion.div
            key={box.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-neo-border bg-neo-card relative overflow-hidden rounded-[var(--radius-neo-2xl)] border-[length:var(--border-neo)] p-3 shadow-[var(--shadow-neo-md)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <MiniFreshnessTag
                status={box.status}
                label={statusLabels[box.status]}
              />
              <button className="text-neo-text-muted hover:text-neo-text">
                <MoreHorizontal className="size-4" />
              </button>
            </div>

            <div className="mb-2">
              <h3 className="text-neo-text truncate text-sm font-bold">
                {box.name}
              </h3>
              <p className="text-neo-text-muted text-[10px]">{box.source}</p>
            </div>

            <div className="mb-3 flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-neo-text-muted text-[10px]">
                  Taille: {box.size}
                </span>
                <span className="text-neo-text-muted text-[10px]">
                  {box.daysLeft}
                </span>
              </div>
              <div className="text-right">
                <span className="text-neo-text text-lg font-bold">
                  {box.remaining}
                </span>
                <span className="text-neo-text-muted ml-0.5 text-[10px]">
                  / {box.total}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="bg-neo-bg absolute bottom-0 left-0 h-1 w-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${box.progress}%` }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                className={cn("h-full", statusColors[box.status])}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TimerContent() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Timer display */}
      <div className="flex justify-center">
        <div className="border-neo-border bg-neo-card relative flex size-32 items-center justify-center rounded-full border-[length:var(--border-neo)] shadow-[var(--shadow-neo-lg)]">
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-neutral-200" />
          <div className="flex flex-col items-center">
            <span className="text-neo-text text-3xl font-bold">
              {selected
                ? timerOptions.find((t) => t.id === selected)?.time
                : "0:00"}
            </span>
            <span className="text-neo-text-muted text-[10px] font-medium">
              MINUTES
            </span>
          </div>
        </div>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-2">
        {timerOptions.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 }}
            onClick={() => setSelected(option.id)}
            className={cn(
              "border-neo-border flex flex-col items-center gap-1 rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)] p-3 transition-all",
              selected === option.id
                ? "bg-neo-accent shadow-[var(--shadow-neo-sm)]"
                : "bg-neo-card hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-sm)]",
            )}
          >
            <div className={cn("size-3 rounded-full", option.color)} />
            <span className="text-neo-text text-xs font-bold">
              {option.label}
            </span>
            <span className="text-neo-text-muted text-[10px]">
              {option.time}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Start button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-full py-3 font-bold transition-all",
          selected
            ? "bg-neo-text text-white shadow-[var(--shadow-neo-md)]"
            : "cursor-not-allowed bg-neutral-200 text-neutral-400",
        )}
      >
        <Play className="size-4 fill-current" />
        <span>Lancer le minuteur</span>
      </motion.button>
    </div>
  );
}

function GuideContent() {
  const statusColors = {
    "extra-fresh": "bg-emerald-500",
    fresh: "bg-amber-400",
    cook: "bg-orange-500",
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {recipes.map((recipe, index) => (
        <motion.div
          key={recipe.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="border-neo-border bg-neo-card flex flex-col gap-1.5 rounded-[var(--radius-neo-md)] border-[length:var(--border-neo)] p-2.5 shadow-[var(--shadow-neo-sm)] hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <div
              className={cn("size-2 rounded-full", statusColors[recipe.status])}
            />
            <span className="text-neo-text-muted text-[9px] font-medium">
              {recipe.time}
            </span>
          </div>
          <h4 className="text-neo-text truncate text-xs font-bold">
            {recipe.name}
          </h4>
          <div className="flex items-center justify-between">
            <span className="bg-neo-bg text-neo-text-muted rounded px-1.5 py-0.5 text-[8px] font-medium">
              {recipe.tag}
            </span>
            <span className="text-neo-text-muted text-[9px]">
              {recipe.eggs} œufs
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function StatsContent() {
  const maxValue = Math.max(...weeklyData.map((d) => d.value));

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-2">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 }}
            className="border-neo-border bg-neo-card flex flex-col rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)] p-3 shadow-[var(--shadow-neo-sm)]"
          >
            <div className="mb-2 flex items-center gap-1.5">
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full",
                  kpi.bg,
                )}
              >
                <kpi.icon className={cn("size-3.5", kpi.color)} />
              </div>
              <span className="text-neo-text-muted text-[10px] font-medium">
                {kpi.label}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-neo-text text-xl font-bold">
                {kpi.value}
              </span>
              <span className="text-neo-text-muted text-[9px]">
                {kpi.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="border-neo-border bg-neo-card rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)] p-3 shadow-[var(--shadow-neo-md)]">
        <h4 className="text-neo-text mb-3 text-[10px] font-bold uppercase tracking-wider">
          Cette semaine
        </h4>
        <div className="flex items-end justify-between gap-1">
          {weeklyData.map((day, index) => (
            <div
              key={index}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.value / maxValue) * 40}px` }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                className="bg-neo-accent w-full rounded-sm"
              />
              <span className="text-neo-text-muted text-[8px] font-medium">
                {day.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cooking types */}
      <div className="border-neo-border bg-neo-card rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)] p-3 shadow-[var(--shadow-neo-md)]">
        <h4 className="text-neo-text mb-3 text-[10px] font-bold uppercase tracking-wider">
          Types de cuisson
        </h4>
        <div className="space-y-2">
          {cookingTypes.map((type, index) => (
            <div key={type.type} className="flex items-center gap-2">
              <span className="text-neo-text-muted w-10 text-[9px] font-medium">
                {type.type}
              </span>
              <div className="bg-neo-bg h-2 flex-1 overflow-hidden rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${type.percent}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  className={cn("h-full rounded-full", type.color)}
                />
              </div>
              <span className="text-neo-text-muted w-6 text-right text-[8px]">
                {type.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function PhoneAppPreview({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<PhoneTab>("fridge");

  const renderContent = () => {
    switch (activeTab) {
      case "fridge":
        return <FridgeContent />;
      case "timer":
        return <TimerContent />;
      case "guide":
        return <GuideContent />;
      case "stats":
        return <StatsContent />;
    }
  };

  return (
    <div className={cn("bg-neo-bg text-neo-text flex h-full flex-col font-sans", className)}>
      {/* Status Bar */}
      <div className="flex h-12 items-center justify-between px-6 pt-8">
        <span className="text-neo-text-muted text-xs font-medium">9:41</span>
        <div className="flex items-center gap-1">
          <div className="bg-neo-text-muted h-2.5 w-4 rounded-sm" />
          <div className="bg-neo-text-muted h-2.5 w-2.5 rounded-full" />
          <div className="border-neo-text-muted h-2.5 w-5 rounded-sm border">
            <div className="bg-neo-text h-full w-3/4 rounded-sm" />
          </div>
        </div>
      </div>

      {/* Header (MobileHeader style) */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Mascot */}
        <div className="flex min-w-[40px] items-center">
          <MiniEggyChef size={32} />
        </div>

        {/* Center: Title */}
        <div className="flex flex-1 flex-col items-center">
          <motion.h2
            key={`${activeTab}-title`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-neo-text text-base font-bold"
          >
            {tabConfig[activeTab].title}
          </motion.h2>
          <motion.p
            key={`${activeTab}-subtitle`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-neo-text-muted text-[10px]"
          >
            {tabConfig[activeTab].subtitle}
          </motion.p>
        </div>

        {/* Right: Action */}
        <div className="flex min-w-[40px] justify-end">
          <button className="border-neo-border bg-neo-card text-neo-text flex size-9 items-center justify-center rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)] shadow-[var(--shadow-neo-sm)] hover:translate-y-0.5 hover:shadow-none">
            <Settings className="size-4" />
          </button>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="scrollbar-none flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="border-neo-border bg-neo-bg/95 border-t-[length:var(--border-neo)] px-2 pt-2 pb-4 backdrop-blur-xl">
        <div className="grid grid-cols-5 items-center">
          <NavButton
            icon={Refrigerator}
            label="Frigo"
            active={activeTab === "fridge"}
            onClick={() => setActiveTab("fridge")}
          />
          <NavButton
            icon={Timer}
            label="Timer"
            active={activeTab === "timer"}
            onClick={() => setActiveTab("timer")}
          />

          {/* FAB as regular nav button */}
          <div className="relative -top-5 flex justify-center">
            <button className="bg-neo-accent text-neo-accent-foreground border-neo-border flex size-12 items-center justify-center rounded-full border-[length:var(--border-neo)] shadow-[var(--shadow-neo-md)] hover:-translate-y-1 hover:shadow-[var(--shadow-neo-lg)] transition-all active:translate-y-0 active:shadow-[var(--shadow-neo-sm)]">
              <Plus className="size-6" strokeWidth={3} />
            </button>
          </div>

          <NavButton
            icon={ChefHat}
            label="Guide"
            active={activeTab === "guide"}
            onClick={() => setActiveTab("guide")}
          />
          <NavButton
            icon={BarChart3}
            label="Stats"
            active={activeTab === "stats"}
            onClick={() => setActiveTab("stats")}
          />
        </div>
      </div>
    </div>
  );
}
