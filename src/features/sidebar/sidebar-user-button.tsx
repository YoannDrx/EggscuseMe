"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { ChevronsUpDown } from "lucide-react";
import { UserDropdown } from "../auth/user-dropdown";

export const SidebarUserButton = () => {
  const session = useSession();
  const data = session.data?.user;

  // Afficher un skeleton pendant le chargement pour éviter le mismatch d'hydratation
  if (session.isPending) {
    return (
      <SidebarMenuButton variant="outline" className="h-12" disabled>
        <Skeleton className="size-8 rounded-lg" />
        <div className="grid flex-1 gap-1">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </SidebarMenuButton>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <UserDropdown>
      <SidebarMenuButton
        variant="outline"
        className="h-12"
        data-testid="user-menu-trigger"
      >
        <Avatar className="size-8 rounded-lg">
          <AvatarImage src={data.image ?? ""} alt={data.name[0]} />
          <AvatarFallback className="rounded-lg">{data.name[0]}</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{data.name}</span>
          <span className="truncate text-xs">{data.email}</span>
        </div>
        <ChevronsUpDown className="ml-auto size-4" />
      </SidebarMenuButton>
    </UserDropdown>
  );
};
