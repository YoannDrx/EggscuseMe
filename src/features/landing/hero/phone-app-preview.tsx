"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import {
  Refrigerator,
  Timer,
  ChefHat,
  BarChart3,
  User,
  Plus,
  Egg,
  Utensils,
  PiggyBank,
  Clock,
  Play,
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
    color: "text-amber-400",
  },
  {
    label: "Consommés",
    value: "18",
    icon: Utensils,
    trend: "ce mois",
    color: "text-neutral-400",
  },
  {
    label: "Économies",
    value: "12€",
    icon: PiggyBank,
    trend: "sauvés",
    color: "text-emerald-400",
  },
  {
    label: "Fraîcheur",
    value: "8j",
    icon: Clock,
    trend: "moyenne",
    color: "text-amber-400",
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
  { type: "Autre", percent: 15, color: "bg-neutral-500" },
];

const tabConfig = {
  fridge: { title: "Mon Frigo", subtitle: "3 boîtes en cours" },
  timer: { title: "Timer", subtitle: "Choisissez votre cuisson" },
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
      bg: "bg-emerald-500/20",
      border: "border-emerald-500",
      text: "text-emerald-400",
      fill: "#22C55E",
    },
    fresh: {
      bg: "bg-amber-400/20",
      border: "border-amber-400",
      text: "text-amber-400",
      fill: "#FBBF24",
    },
    cook: {
      bg: "bg-orange-500/20",
      border: "border-orange-500",
      text: "text-orange-400",
      fill: "#F97316",
    },
  };
  const c = config[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border-2 px-2 py-0.5 text-[10px] font-medium",
        c.bg,
        c.border,
        c.text,
      )}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
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
        active ? "text-amber-400" : "text-neutral-500",
      )}
    >
      <Icon className="size-5" />
      <span className="text-[9px] font-medium">{label}</span>
      {active && (
        <motion.div
          layoutId="phone-nav-pill"
          className="absolute -bottom-1 h-0.5 w-6 rounded-full bg-amber-400"
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
  const borderColors = {
    "extra-fresh": "border-emerald-500/30",
    fresh: "border-amber-400/30",
    cook: "border-orange-500/30",
  };

  return (
    <div className="space-y-3">
      {eggBoxes.map((box, index) => (
        <motion.div
          key={box.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "relative overflow-hidden rounded-2xl border bg-neutral-900/80 p-3",
            borderColors[box.status],
          )}
        >
          <div className="mb-1.5 flex items-center justify-between">
            <MiniFreshnessTag
              status={box.status}
              label={statusLabels[box.status]}
            />
            <span className="text-[10px] text-neutral-500">{box.daysLeft}</span>
          </div>
          <h3 className="mb-1 truncate text-sm font-semibold text-white">
            {box.source}
          </h3>
          <div className="flex items-end justify-between">
            <span className="text-[10px] text-neutral-400">{box.name}</span>
            <div>
              <span className="text-lg font-bold text-white">
                {box.remaining}
              </span>
              <span className="text-[10px] text-neutral-500">
                {" "}
                / {box.total}
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-neutral-800">
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
  );
}

function TimerContent() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Timer display */}
      <div className="flex justify-center">
        <div className="relative flex size-28 items-center justify-center rounded-full border-4 border-neutral-700 bg-neutral-900">
          <div className="absolute inset-1 rounded-full border-4 border-amber-400/20" />
          <span className="text-2xl font-bold text-white">
            {selected
              ? timerOptions.find((t) => t.id === selected)?.time
              : "0:00"}
          </span>
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
              "flex flex-col items-center gap-1 rounded-xl border p-3 transition-all",
              selected === option.id
                ? "border-amber-400 bg-amber-400/10"
                : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700",
            )}
          >
            <div className={cn("size-3 rounded-full", option.color)} />
            <span className="text-xs font-medium text-white">
              {option.label}
            </span>
            <span className="text-[10px] text-neutral-500">{option.time}</span>
          </motion.button>
        ))}
      </div>

      {/* Start button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium transition-colors",
          selected
            ? "bg-amber-400 text-neutral-900"
            : "bg-neutral-800 text-neutral-500",
        )}
      >
        <Play className="size-4" />
        <span>Lancer</span>
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
          className="flex flex-col gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/50 p-2.5"
        >
          <div className="flex items-center justify-between">
            <div
              className={cn("size-2 rounded-full", statusColors[recipe.status])}
            />
            <span className="text-[9px] text-neutral-500">{recipe.time}</span>
          </div>
          <h4 className="truncate text-xs font-semibold text-white">
            {recipe.name}
          </h4>
          <div className="flex items-center justify-between">
            <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[8px] text-neutral-400">
              {recipe.tag}
            </span>
            <span className="text-[9px] text-neutral-500">
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
            className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-2.5"
          >
            <div className="mb-1 flex items-center gap-1.5">
              <kpi.icon className={cn("size-3.5", kpi.color)} />
              <span className="text-[9px] text-neutral-500">{kpi.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-white">{kpi.value}</span>
              <span className="text-[8px] text-neutral-500">{kpi.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-3">
        <h4 className="mb-2 text-[10px] font-medium text-neutral-400">
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
                className="w-full rounded-sm bg-amber-400"
              />
              <span className="text-[8px] text-neutral-500">{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cooking types */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-3">
        <h4 className="mb-2 text-[10px] font-medium text-neutral-400">
          Types de cuisson
        </h4>
        <div className="space-y-1.5">
          {cookingTypes.map((type, index) => (
            <div key={type.type} className="flex items-center gap-2">
              <span className="w-10 text-[9px] text-neutral-400">
                {type.type}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${type.percent}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  className={cn("h-full rounded-full", type.color)}
                />
              </div>
              <span className="w-6 text-right text-[8px] text-neutral-500">
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
    <div className={cn("flex h-full flex-col", className)}>
      {/* Status Bar */}
      <div className="flex h-12 items-center justify-between px-6 pt-8">
        <span className="text-xs font-medium text-neutral-400">9:41</span>
        <div className="flex items-center gap-1">
          <div className="h-2.5 w-4 rounded-sm bg-neutral-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-neutral-400" />
          <div className="h-2.5 w-5 rounded-sm border border-neutral-400">
            <div className="h-full w-3/4 rounded-sm bg-emerald-400" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-3">
          <MiniEggyChef size={32} />
          <div>
            <motion.h2
              key={`${activeTab}-title`}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base font-bold text-white"
            >
              {tabConfig[activeTab].title}
            </motion.h2>
            <motion.p
              key={`${activeTab}-subtitle`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-neutral-500"
            >
              {tabConfig[activeTab].subtitle}
            </motion.p>
          </div>
        </div>
        <div className="flex size-8 items-center justify-center rounded-full bg-amber-400/20">
          <User className="size-3.5 text-amber-400" />
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="scrollbar-none flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="rounded-t-[20px] border-t border-neutral-800 bg-neutral-900/95 px-2 pt-2 pb-4 backdrop-blur-xl">
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
          <button className="flex flex-col items-center gap-0.5 py-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-amber-400">
              <Plus className="size-4 text-neutral-900" strokeWidth={2.5} />
            </div>
          </button>

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
