import type { NavigationGroup } from "@/features/navigation/navigation.type";
import {
  BookOpen,
  CreditCard,
  Home,
  Settings,
  Timer,
  Users,
} from "lucide-react";

export const getFridgeNavigation = (
  role: "OWNER" | "GUEST",
): NavigationGroup[] => {
  if (role === "GUEST") {
    // Guests only see main menu
    return [FRIDGE_LINKS[0]];
  }
  // Owners see everything
  return FRIDGE_LINKS;
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
    ],
  },
  {
    title: "Paramètres",
    defaultOpenStartPath: "/fridge/settings",
    links: [
      {
        href: "/fridge/settings",
        Icon: Settings,
        label: "Préférences",
      },
      {
        href: "/fridge/settings/sharing",
        Icon: Users,
        label: "Partage",
      },
      {
        href: "/fridge/settings/billing",
        Icon: CreditCard,
        label: "Abonnement",
      },
    ],
  },
];
