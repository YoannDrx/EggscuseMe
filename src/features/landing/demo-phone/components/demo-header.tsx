"use client";

import { cn } from "@/lib/utils";
import { EggyChefMix } from "@/features/mascot/components/eggy-sticker-components";
import { ChevronLeft, Download, Settings } from "lucide-react";
import { motion } from "motion/react";
import type { DemoTab } from "../demo-types";
import { TAB_CONFIG } from "../demo-data";

type DemoHeaderProps = {
  activeTab: DemoTab;
};

export function DemoHeader({ activeTab }: DemoHeaderProps) {
  const config = TAB_CONFIG[activeTab];
  const showBackButton = activeTab === "recipes" || activeTab === "stats";

  return (
    <div className="flex items-center justify-between px-4 py-3">
      {/* Left: Back button or Mascot */}
      <div className="flex min-w-[40px] items-center">
        {showBackButton ? (
          <button
            type="button"
            className="text-neo-text-muted hover:text-neo-text -ml-2 p-2"
          >
            <ChevronLeft className="size-5" />
          </button>
        ) : (
          <EggyChefMix className="size-10" />
        )}
      </div>

      {/* Center: Title */}
      <div className="flex flex-1 flex-col items-center">
        <motion.h2
          key={`${activeTab}-title`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-neo-text text-base font-bold"
        >
          {config.title}
        </motion.h2>
        <motion.p
          key={`${activeTab}-subtitle`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-neo-text-muted text-[10px]"
        >
          {config.subtitle}
        </motion.p>
      </div>

      {/* Right: Action button */}
      <div className="flex min-w-[40px] justify-end">
        {activeTab === "stats" ? (
          <button
            type="button"
            className={cn(
              "border-neo-border bg-neo-card text-neo-text",
              "flex size-9 items-center justify-center",
              "rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
              "shadow-[var(--shadow-neo-sm)]",
            )}
          >
            <Download className="size-4" />
          </button>
        ) : (
          <button
            type="button"
            className={cn(
              "border-neo-border bg-neo-card text-neo-text",
              "flex size-9 items-center justify-center",
              "rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
              "shadow-[var(--shadow-neo-sm)]",
            )}
          >
            <Settings className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
