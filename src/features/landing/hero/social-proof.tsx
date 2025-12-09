"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("landing.socialProof");

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
              "border-background text-foreground flex size-10 items-center justify-center rounded-full border-2 text-xs font-bold",
              avatar.color,
            )}
          >
            {avatar.initials}
          </motion.div>
        ))}
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="text-foreground text-sm font-semibold">
          {t("joinedBy")} <span className="text-primary">{t("count")}</span>
        </span>
        <span className="text-muted-foreground text-xs">
          {t("satisfiedUsers")}
        </span>
      </div>
    </motion.div>
  );
}
