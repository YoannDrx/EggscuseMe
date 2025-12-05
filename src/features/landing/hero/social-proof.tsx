"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const avatars = [
  { color: "bg-amber-400", initials: "JD" },
  { color: "bg-emerald-400", initials: "AS" },
  { color: "bg-purple-400", initials: "MK" },
  { color: "bg-rose-400", initials: "LP" },
  { color: "bg-sky-400", initials: "RT" },
];

type SocialProofProps = {
  className?: string;
};

export function SocialProof({ className }: SocialProofProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className={cn("flex items-center gap-4", className)}
    >
      {/* Avatar Stack */}
      <div className="flex -space-x-3">
        {avatars.map((avatar, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + index * 0.1, type: "spring" }}
            className={cn(
              "flex size-10 items-center justify-center rounded-full border-2 border-stone-950 text-xs font-bold text-stone-900",
              avatar.color,
            )}
          >
            {avatar.initials}
          </motion.div>
        ))}
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white">
          Rejoint par <span className="text-amber-400">+10,000</span>
        </span>
        <span className="text-xs text-stone-500">utilisateurs satisfaits</span>
      </div>
    </motion.div>
  );
}
