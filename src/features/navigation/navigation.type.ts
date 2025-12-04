import type { IconProps } from "@radix-ui/react-icons/dist/types";
import type { LucideIcon } from "lucide-react";

// Simplified role type for fridge system
export type FridgeRole = "OWNER" | "GUEST";

export type NavigationGroup = {
  title: string;
  roles?: FridgeRole[];
  links: NavigationLink[];
  defaultOpenStartPath?: string;
};

type NavigationLink = {
  href: string;
  Icon:
    | React.ForwardRefExoticComponent<
        IconProps & React.RefAttributes<SVGSVGElement>
      >
    | LucideIcon;
  label: string;
  roles?: FridgeRole[];
  hidden?: boolean;
  links?: NavigationLink[];
};
