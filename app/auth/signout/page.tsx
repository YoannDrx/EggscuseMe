"use client";

import { signOut } from "@/lib/auth-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NeoButton } from "@/components/neo/neo-button";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <LogOut className="text-neo-text-muted mx-auto mb-4 size-12" />
          <h1 className="text-xl font-bold">{t("signOutTitle")}</h1>
          <p className="text-neo-text-muted text-sm">
            {t("signOutDescription")}
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <NeoButton
            onClick={handleSignOut}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? t("signingOut") : t("signOut")}
          </NeoButton>
          <NeoButton
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
            className="w-full"
          >
            {t("cancel")}
          </NeoButton>
        </CardContent>
      </Card>
    </div>
  );
}
