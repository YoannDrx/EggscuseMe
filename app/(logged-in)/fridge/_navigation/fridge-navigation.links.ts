import type { NavigationGroup } from "@/features/navigation/navigation.type";
import {
  AlertTriangle,
  Bell,
  BookOpen,
  ChartLine,
  CreditCard,
  History,
  Home,
  KeyRound,
  Palette,
  Settings,
  Timer,
  User,
  Users,
} from "lucide-react";

export const getFridgeNavigation = (
  role: "OWNER" | "GUEST",
): NavigationGroup[] => {
  if (role === "GUEST") {
    // Guests see main menu + limited settings (profile, security, appearance, danger)
    return [FRIDGE_LINKS[0], GUEST_SETTINGS];
  }
  // Owners see everything
  return FRIDGE_LINKS;
};

// Settings section for guests (limited options)
const GUEST_SETTINGS: NavigationGroup = {
  title: "Paramètres",
  defaultOpenStartPath: "/fridge/settings",
  links: [
    {
      href: "/fridge/settings",
      Icon: Settings,
      label: "Paramètres",
    },
    {
      href: "/fridge/settings/profile",
      Icon: User,
      label: "Mon profil",
    },
    {
      href: "/fridge/settings/security",
      Icon: KeyRound,
      label: "Sécurité",
    },
    {
      href: "/fridge/settings/appearance",
      Icon: Palette,
      label: "Apparence",
    },
    {
      href: "/fridge/settings/danger",
      Icon: AlertTriangle,
      label: "Zone danger",
    },
  ],
};

const FRIDGE_LINKS: NavigationGroup[] = [
  {
    title: "Menu",
    links: [
      {
        href: "/fridge",
        Icon: Home,
        label: "Mon Frigo",
      },
      {
        href: "/fridge/timer",
        Icon: Timer,
        label: "Minuteur",
      },
      {
        href: "/fridge/recipes",
        Icon: BookOpen,
        label: "Recettes",
      },
      {
        href: "/fridge/statistics",
        Icon: ChartLine,
        label: "Statistiques",
      },
      {
        href: "/fridge/history",
        Icon: History,
        label: "Historique",
      },
    ],
  },
  {
    title: "Paramètres",
    defaultOpenStartPath: "/fridge/settings",
    links: [
      {
        href: "/fridge/settings",
        Icon: Settings,
        label: "Paramètres",
      },
      {
        href: "/fridge/settings/profile",
        Icon: User,
        label: "Mon profil",
      },
      {
        href: "/fridge/settings/security",
        Icon: KeyRound,
        label: "Sécurité",
      },
      {
        href: "/fridge/settings/appearance",
        Icon: Palette,
        label: "Apparence",
      },
      {
        href: "/fridge/settings/sharing",
        Icon: Users,
        label: "Partage",
      },
      {
        href: "/fridge/settings/notifications",
        Icon: Bell,
        label: "Notifications",
      },
      {
        href: "/fridge/settings/billing",
        Icon: CreditCard,
        label: "Abonnement",
      },
      {
        href: "/fridge/settings/danger",
        Icon: AlertTriangle,
        label: "Zone danger",
      },
    ],
  },
];
