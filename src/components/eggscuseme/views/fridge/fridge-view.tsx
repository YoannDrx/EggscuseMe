"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from 'motion/react';
import { Info, Plus, Refrigerator, Trash2 } from "lucide-react";
import { useState } from "react";
import { Eggy } from "@/features/mascot/components/eggy";
import { useThemeColors } from "../../theme";
import { BottomSheet, FloatingActionButton, PageHeader } from "../../shared";

// Types
export type EggBox = {
  id: number;
  laidDate: string;
  quantity: number;
};

type FreshnessStatus = {
  label: string;
  color: string;
  progress: string;
  usage: string;
  days: number;
};

// Freshness calculation
function getFreshness(laidDate: string): FreshnessStatus {
  const today = new Date();
  const laid = new Date(laidDate);
  const diffTime = Math.abs(today.getTime() - laid.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 9) {
    return {
      label: "Extra Frais",
      color: "text-fresh-extra",
      progress: "bg-fresh-extra",
      usage: "Cru, Mollet, Poché",
      days: diffDays,
    };
  }
  if (diffDays <= 21) {
    return {
      label: "Frais",
      color: "text-fresh",
      progress: "bg-fresh",
      usage: "Omelette, Gâteau",
      days: diffDays,
    };
  }
  if (diffDays <= 28) {
    return {
      label: "Cuire à coeur",
      color: "text-fresh-cook",
      progress: "bg-fresh-cook",
      usage: "Oeuf Dur uniquement",
      days: diffDays,
    };
  }
  return {
    label: "Périmé",
    color: "text-expired",
    progress: "bg-expired",
    usage: "Ne pas consommer",
    days: diffDays,
  };
}

type FridgeViewProps = {
  boxes: EggBox[];
  onAddBox: (box: EggBox) => void;
  onDeleteBox: (id: number) => void;
};

export function FridgeView({ boxes, onAddBox, onDeleteBox }: FridgeViewProps) {
  const colors = useThemeColors();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBoxDate, setNewBoxDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [newBoxQty, setNewBoxQty] = useState(6);

  const handleAdd = () => {
    onAddBox({
      id: Date.now(),
      laidDate: newBoxDate,
      quantity: newBoxQty,
    });
    setShowAddModal(false);
    setNewBoxQty(6);
  };

  const totalEggs = boxes.reduce((acc, b) => acc + b.quantity, 0);
  const extraFreshEggs = boxes
    .filter((b) => getFreshness(b.laidDate).label === "Extra Frais")
    .reduce((acc, b) => acc + b.quantity, 0);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Mon Frigo"
        subtitle="Gère tes stocks d'oeufs"
        eggyMood="happy"
      />

      {/* Content */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-24">
        {/* Stats Summary */}
        <div
          className={cn(
            "flex items-center justify-between rounded-3xl border p-4 shadow-sm",
            colors.card,
            colors.cardBorder,
          )}
        >
          <div>
            <p
              className={cn(
                "text-xs font-bold tracking-wider uppercase",
                colors.accent,
              )}
            >
              Total
            </p>
            <p className={cn("text-2xl font-bold", colors.text)}>
              {totalEggs}{" "}
              <span className="text-sm font-normal opacity-50">oeufs</span>
            </p>
          </div>
          <div
            className={cn("h-10 w-px bg-current opacity-20", colors.cardBorder)}
          />
          <div>
            <p className="text-fresh-extra text-xs font-bold tracking-wider uppercase">
              Extra Frais
            </p>
            <p className={cn("text-2xl font-bold", colors.text)}>
              {extraFreshEggs}
            </p>
          </div>
        </div>

        {/* Egg Box List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {boxes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center py-10 text-center opacity-50"
              >
                <div
                  className={cn(
                    "mb-4 rounded-full border p-6",
                    colors.card,
                    colors.cardBorder,
                  )}
                >
                  <Refrigerator className={cn("h-12 w-12", colors.textMuted)} />
                </div>
                <p className={colors.textMuted}>Ton frigo est vide.</p>
                <Eggy mood="sad" size="md" className="mt-4" />
              </motion.div>
            ) : (
              boxes.map((box, index) => {
                const status = getFreshness(box.laidDate);
                return (
                  <motion.div
                    key={box.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                    className={cn(
                      "relative overflow-hidden rounded-3xl border p-5 shadow-sm transition-all active:scale-[0.98]",
                      colors.card,
                      colors.cardBorder,
                    )}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className={cn(
                            "h-3 w-3 rounded-full",
                            status.progress,
                          )}
                        />
                        <h3 className={cn("font-bold", status.color)}>
                          {status.label}
                        </h3>
                      </div>
                      <button
                        onClick={() => onDeleteBox(box.id)}
                        className={cn(
                          "p-1 transition-colors hover:text-red-400",
                          colors.textMuted,
                        )}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className={cn("mb-1 text-sm", colors.text)}>
                          Ponte :{" "}
                          {new Date(box.laidDate).toLocaleDateString("fr-FR")}
                        </p>
                        <div
                          className={cn(
                            "flex items-center space-x-2 text-xs",
                            colors.textMuted,
                          )}
                        >
                          <Info size={12} />
                          <span>{status.usage}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn("text-2xl font-bold", colors.text)}>
                          {box.quantity}
                        </span>
                        <span className={cn("block text-xs", colors.textMuted)}>
                          restants
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 h-1 w-full bg-black/5">
                      <div
                        className={cn("h-full", status.progress)}
                        style={{
                          width: `${Math.min(100, (status.days / 28) * 100)}%`,
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FAB */}
      <FloatingActionButton
        icon={Plus}
        onClick={() => setShowAddModal(true)}
        label="Ajouter une boîte"
      />

      {/* Add Modal */}
      <BottomSheet
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Nouvelle boîte"
      >
        <div className="space-y-6">
          <div>
            <label className={cn("mb-2 block text-sm", colors.textMuted)}>
              Date de ponte (sur l&apos;oeuf)
            </label>
            <input
              type="date"
              value={newBoxDate}
              onChange={(e) => setNewBoxDate(e.target.value)}
              className={cn(
                "w-full rounded-xl border p-4 transition-colors focus:outline-none",
                colors.input,
                colors.inputBorder,
                colors.inputFocus,
                colors.text,
              )}
            />
          </div>

          <div>
            <label className={cn("mb-2 block text-sm", colors.textMuted)}>
              Quantité
            </label>
            <div
              className={cn(
                "flex items-center justify-between rounded-xl border p-2",
                colors.input,
                colors.cardBorder,
              )}
            >
              <button
                onClick={() => setNewBoxQty((q) => Math.max(1, q - 1))}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-lg shadow-sm",
                  colors.card,
                  colors.text,
                )}
              >
                -
              </button>
              <span className={cn("text-xl font-bold", colors.text)}>
                {newBoxQty}
              </span>
              <button
                onClick={() => setNewBoxQty((q) => q + 1)}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-lg text-white shadow-sm",
                  colors.accentBg,
                )}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className={cn(
              "w-full rounded-xl py-4 font-bold text-white shadow-md transition-opacity hover:opacity-90",
              colors.accentBg,
            )}
          >
            Ajouter au frigo
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
