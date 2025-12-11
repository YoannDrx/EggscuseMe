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
    // Guests see only main menu (settings are in drawer)
    return [FRIDGE_LINKS[0]];
  }
  // Owners see only main menu (settings are in drawer)
  return [FRIDGE_LINKS[0]];
};

export const getSettingsLinks = (role: "OWNER" | "GUEST") => {
  if (role === "GUEST") {
    return GUEST_SETTINGS.links;
  }
  return FRIDGE_LINKS[1].links;
};

// Settings section for guests (limited options)
const GUEST_SETTINGS: NavigationGroup = {
  titleKey: "settings",
  defaultOpenStartPath: "/fridge/settings",
  links: [
    {
      href: "/fridge/settings",
      Icon: Settings,
      labelKey: "settings",
    },
    {
      href: "/fridge/settings/profile",
      Icon: User,
      labelKey: "profile",
    },
    {
      href: "/fridge/settings/security",
      Icon: KeyRound,
      labelKey: "security",
    },
    {
      href: "/fridge/settings/appearance",
      Icon: Palette,
      labelKey: "appearance",
    },
    {
      href: "/fridge/settings/danger",
      Icon: AlertTriangle,
      labelKey: "dangerZone",
    },
  ],
};

const FRIDGE_LINKS: NavigationGroup[] = [
  {
    titleKey: "menu",
    links: [
      {
        href: "/fridge",
        Icon: Home,
        labelKey: "myFridge",
      },
      {
        href: "/fridge/timer",
        Icon: Timer,
        labelKey: "timer",
      },
      {
        href: "/fridge/recipes",
        Icon: BookOpen,
        labelKey: "recipes",
      },
      {
        href: "/fridge/statistics",
        Icon: ChartLine,
        labelKey: "statistics",
      },
      {
        href: "/fridge/history",
        Icon: History,
        labelKey: "history",
      },
    ],
  },
  {
    titleKey: "settings",
    defaultOpenStartPath: "/fridge/settings",
    links: [
      {
        href: "/fridge/settings",
        Icon: Settings,
        labelKey: "settings",
      },
      {
        href: "/fridge/settings/profile",
        Icon: User,
        labelKey: "profile",
      },
      {
        href: "/fridge/settings/security",
        Icon: KeyRound,
        labelKey: "security",
      },
      {
        href: "/fridge/settings/appearance",
        Icon: Palette,
        labelKey: "appearance",
      },
      {
        href: "/fridge/settings/sharing",
        Icon: Users,
        labelKey: "sharing",
      },
      {
        href: "/fridge/settings/notifications",
        Icon: Bell,
        labelKey: "notifications",
      },
      {
        href: "/fridge/settings/billing",
        Icon: CreditCard,
        labelKey: "billing",
      },
      {
        href: "/fridge/settings/danger",
        Icon: AlertTriangle,
        labelKey: "dangerZone",
      },
    ],
  },
];
