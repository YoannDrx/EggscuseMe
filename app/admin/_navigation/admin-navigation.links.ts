import type { NavigationGroup } from "@/features/navigation/navigation.type";
import { Activity, Home, Users, Wrench } from "lucide-react";

const ADMIN_PATH = `/admin`;

const ADMIN_LINKS: NavigationGroup[] = [
  {
    titleKey: "admin",
    links: [
      {
        href: ADMIN_PATH,
        Icon: Home,
        labelKey: "dashboard",
      },
      {
        href: `${ADMIN_PATH}/users`,
        Icon: Users,
        labelKey: "users",
      },
      {
        href: `${ADMIN_PATH}/tools`,
        Icon: Wrench,
        labelKey: "tools",
      },
      {
        href: `${ADMIN_PATH}/monitoring`,
        Icon: Activity,
        labelKey: "monitoring",
      },
    ],
  },
] satisfies NavigationGroup[];

export const getAdminNavigation = (): NavigationGroup[] => {
  return ADMIN_LINKS;
};
