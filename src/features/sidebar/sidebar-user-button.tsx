"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient, useSession } from "@/lib/auth-client";
import { LogOut, Settings, Shield, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const SidebarUserButton = () => {
  const session = useSession();
  const router = useRouter();
  const t = useTranslations("sidebar.userMenu");
  const data = session.data?.user;

  // Afficher un skeleton pendant le chargement pour éviter le mismatch d'hydratation
  if (session.isPending) {
    return (
      <div className="border-foreground/20 bg-muted/50 flex items-center gap-3 rounded-xl border-2 p-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="grid flex-1 gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const isAdmin = data.role === "admin";

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="border-foreground/20 bg-muted/50 hover:bg-muted flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-colors"
          data-testid="user-profile-button"
        >
          <Avatar className="border-foreground/10 size-10 rounded-full border-2">
            <AvatarImage src={data.image ?? ""} alt={data.name[0]} />
            <AvatarFallback className="rounded-full">
              {data.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{data.name}</span>
            <span className="text-muted-foreground truncate text-xs">
              {data.email}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link
            href="/fridge/settings/profile"
            className="flex cursor-pointer items-center gap-2"
          >
            <User className="size-4" />
            {t("profile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/fridge/settings"
            className="flex cursor-pointer items-center gap-2"
          >
            <Settings className="size-4" />
            {t("settings")}
          </Link>
        </DropdownMenuItem>

        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/admin"
                className="text-primary flex cursor-pointer items-center gap-2"
              >
                <Shield className="size-4" />
                {t("admin")}
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 size-4" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
