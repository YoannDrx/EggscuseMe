"use client";

import { NeoSheet } from "@/components/neo/neo-sheet";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { AddEggBoxForm } from "@app/(logged-in)/fridge/add-egg-box-form";
import { ConsumeEggsQuickSelect } from "@app/(logged-in)/fridge/consume-eggs-quick-select";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Package, UtensilsCrossed } from "lucide-react";
import { useTranslations } from "next-intl";

type QuickActionsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isOwner?: boolean;
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export function QuickActionsSheet({
  open,
  onOpenChange,
  isOwner = false,
}: QuickActionsSheetProps) {
  const t = useTranslations("fridge.quickActions");

  const handleAddBox = () => {
    onOpenChange(false);
    // Délai pour laisser le sheet se fermer avant d'ouvrir le dialog
    // Évite le conflit de body scroll lock entre NeoSheet et AlertDialog
    setTimeout(() => {
      dialogManager.custom({
        title: t("addBox.title"),
        description: t("addBox.description"),
        children: <AddEggBoxForm />,
      });
    }, 150);
  };

  const handleConsumeEggs = () => {
    onOpenChange(false);
    setTimeout(() => {
      dialogManager.custom({
        title: t("consume.title"),
        description: t("consume.description"),
        children: <ConsumeEggsQuickSelect />,
      });
    }, 150);
  };

  const actions = [
    {
      id: "add-box",
      icon: Package,
      label: t("addBox.label"),
      description: t("addBox.hint"),
      onClick: handleAddBox,
      color: "bg-fresh-extra/10 text-fresh-extra",
      iconColor: "text-fresh-extra",
      disabled: !isOwner,
    },
    {
      id: "consume",
      icon: UtensilsCrossed,
      label: t("consume.label"),
      description: t("consume.hint"),
      onClick: handleConsumeEggs,
      color: "bg-fresh/10 text-fresh",
      iconColor: "text-fresh",
      disabled: false,
    },
  ];

  return (
    <NeoSheet
      open={open}
      onOpenChange={onOpenChange}
      side="bottom"
      showHandle={true}
      showCloseButton={true}
      title={t("title")}
    >
      <motion.div
        className="grid gap-3 py-2"
        variants={containerVariants}
        initial="hidden"
        animate={open ? "visible" : "hidden"}
      >
        {actions.map((action) => (
          <motion.button
            key={action.id}
            variants={itemVariants}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              "flex items-center gap-4 rounded-[var(--radius-neo-xl)] p-4",
              "bg-neo-card",
              "border-neo-border/20 border-[length:var(--border-neo)]",
              "shadow-[var(--shadow-neo-sm)]",
              "transition-all duration-200",
              "hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-md)]",
              "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
              "text-left",
            )}
          >
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-neo-lg)]",
                action.color,
              )}
            >
              <action.icon className={cn("size-6", action.iconColor)} />
            </div>
            <div className="flex-1">
              <p className="text-neo-text font-semibold">{action.label}</p>
              <p className="text-neo-text-muted text-sm">
                {action.description}
              </p>
            </div>
          </motion.button>
        ))}

        {!isOwner && (
          <p className="text-neo-text-muted mt-2 text-center text-xs">
            {t("ownerOnlyHint")}
          </p>
        )}
      </motion.div>
    </NeoSheet>
  );
}
