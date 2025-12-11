"use client";

import { Loader } from "@/components/nowts/loader";
import { NeoButton } from "@/components/neo";
import { signOut } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

export const SidebarLogoutButton = () => {
  const t = useTranslations("auth");
  const logout = useMutation({
    mutationFn: async () => signOut(),
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  return (
    <div className="relative">
      {/* Neubrutalist white offset */}
      <div className="absolute top-1 left-1 h-full w-full rounded-xl bg-white/90 dark:bg-white/30" />
      <NeoButton
        variant="outline"
        className="border-foreground/20 relative w-full justify-start gap-2 rounded-xl border-2"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
      >
        {logout.isPending ? (
          <Loader className="size-4" />
        ) : (
          <LogOut className="size-4" />
        )}
        <span>{t("signOut")}</span>
      </NeoButton>
    </div>
  );
};
