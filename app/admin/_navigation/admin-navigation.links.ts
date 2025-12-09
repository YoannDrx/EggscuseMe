import type { NavigationGroup } from "@/features/navigation/navigation.type";
import {
  FileDown,
  Home,
  Mail,
  MailQuestion,
  MessageSquare,
  ScrollText,
  Users,
} from "lucide-react";

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
        href: `${ADMIN_PATH}/invitations`,
        Icon: MailQuestion,
        labelKey: "invitations",
      },
      {
        href: `${ADMIN_PATH}/emails`,
        Icon: Mail,
        labelKey: "emails",
      },
      {
        href: `${ADMIN_PATH}/export`,
        Icon: FileDown,
        labelKey: "export",
      },
      {
        href: `${ADMIN_PATH}/logs`,
        Icon: ScrollText,
        labelKey: "logs",
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
