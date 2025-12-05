"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useThemeColors } from "../theme";

type NavItemProps = {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
};

export function NavItem({
  icon: Icon,
  label,
  isActive,
  onClick,
}: NavItemProps) {
  const colors = useThemeColors();

  return (
    <motion.button
      onClick={onClick}
      className="relative flex flex-col items-center justify-center space-y-1"
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
    >
      <motion.div
        animate={{
          scale: isActive ? 1.1 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
        }}
      >
        <Icon
          className={cn(
            "transition-colors duration-200",
            isActive ? colors.navActive : colors.textMuted,
          )}
          size={24}
          strokeWidth={isActive ? 2.5 : 2}
        />
      </motion.div>

      <span
        className={cn(
          "text-[10px] font-bold transition-colors duration-200",
          isActive ? colors.text : colors.textMuted,
        )}
      >
        {label}
      </span>
    </motion.button>
  );
}
