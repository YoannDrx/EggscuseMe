import { Badge } from "@/components/ui/badge";
import type { ComponentProps } from "react";

export type StatusType =
  | "active"
  | "inactive"
  | "pending"
  | "expired"
  | "cancelled"
  | "banned"
  | "trialing"
  | "maxed";

type BadgeVariant = ComponentProps<typeof Badge>["variant"];

const statusConfig: Record<
  StatusType,
  { label: { fr: string; en: string }; variant: BadgeVariant }
> = {
  active: {
    label: { fr: "Actif", en: "Active" },
    variant: "default",
  },
  inactive: {
    label: { fr: "Inactif", en: "Inactive" },
    variant: "secondary",
  },
  pending: {
    label: { fr: "En attente", en: "Pending" },
    variant: "outline",
  },
  expired: {
    label: { fr: "Expiré", en: "Expired" },
    variant: "destructive",
  },
  cancelled: {
    label: { fr: "Annulé", en: "Cancelled" },
    variant: "secondary",
  },
  banned: {
    label: { fr: "Banni", en: "Banned" },
    variant: "destructive",
  },
  trialing: {
    label: { fr: "Essai", en: "Trial" },
    variant: "outline",
  },
  maxed: {
    label: { fr: "Max atteint", en: "Max reached" },
    variant: "outline",
  },
};

type AdminStatusBadgeProps = {
  status: StatusType;
  customLabel?: string;
  locale?: "fr" | "en";
};

export function AdminStatusBadge({
  status,
  customLabel,
  locale = "fr",
}: AdminStatusBadgeProps) {
  const config = statusConfig[status];
  const label = customLabel ?? config.label[locale];

  return <Badge variant={config.variant}>{label}</Badge>;
}
