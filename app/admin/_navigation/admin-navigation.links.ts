import type { NavigationGroup } from "@/features/navigation/navigation.type";
import { Building2, Home, MessageSquare, Users } from "lucide-react";

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
        href: `${ADMIN_PATH}/organizations`,
        Icon: Building2,
        labelKey: "organizations",
      },
      {
        href: `${ADMIN_PATH}/feedback`,
        Icon: MessageSquare,
        labelKey: "feedback",
      },
    ],
  },
] satisfies NavigationGroup[];

export const getAdminNavigation = (): NavigationGroup[] => {
  return ADMIN_LINKS;
};
