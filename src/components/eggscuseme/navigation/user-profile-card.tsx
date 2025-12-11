"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NeoBadge } from "@/components/neo/neo-badge";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Crown, Shield } from "lucide-react";

type UserProfileCardProps = {
  name: string;
  email: string;
  image?: string | null;
  isOwner?: boolean;
  isPremium?: boolean;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function UserProfileCard({
  name,
  email,
  image,
  isOwner = false,
  isPremium = false,
}: UserProfileCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", damping: 25, stiffness: 300 },
        },
      }}
      className={cn(
        "flex items-center gap-4 p-4",
        "rounded-[var(--radius-neo-2xl)]",
        "bg-neo-bg",
        "border-neo-border/20 border-[length:var(--border-neo)]",
        "shadow-[var(--shadow-neo-md)]",
      )}
    >
      {/* Avatar */}
      <Avatar className="border-neo-border/30 size-14 border-[length:var(--border-neo)] shadow-[var(--shadow-neo-sm)]">
        {image && <AvatarImage src={image} alt={name} />}
        <AvatarFallback className="bg-neo-accent/10 text-neo-accent text-lg font-bold">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="text-neo-text truncate text-lg font-bold">{name}</h3>
        <p className="text-neo-text-muted truncate text-sm">{email}</p>

        {/* Badges */}
        {(isOwner || isPremium) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {isOwner && (
              <NeoBadge
                variant="success"
                size="sm"
                icon={<Shield className="size-3" />}
              >
                Propriétaire
              </NeoBadge>
            )}
            {isPremium && (
              <NeoBadge
                variant="default"
                size="sm"
                icon={<Crown className="size-3" />}
              >
                Premium
              </NeoBadge>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
