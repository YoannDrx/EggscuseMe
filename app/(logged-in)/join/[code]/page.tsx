import {
  NeoButton,
  NeoCard,
  NeoCardContent,
  NeoCardDescription,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import {
  acceptShareLinkAction,
  getShareLinkByCodeAction,
} from "@/features/fridge/sharing.action";
import { Eggy } from "@/features/mascot";
import { AlertTriangle, Check, RefrigeratorIcon, Users } from "lucide-react";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

type JoinPageProps = {
  params: Promise<{ code: string }>;
};

export default async function JoinPage({ params }: JoinPageProps) {
  const { code } = await params;
  const locale = await getLocale();
  const t = await getTranslations("fridge.invite");

  // Get share link info
  const result = await getShareLinkByCodeAction({ code });

  // Handle errors or invalid link
  if (result.data?.error || !result.data?.shareLink) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <NeoCard variant="elevated" className="max-w-md">
          <NeoCardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Eggy mood="sad" size="lg" />
            </div>
            <NeoCardTitle className="font-heading text-xl">
              {t("invalidTitle")}
            </NeoCardTitle>
            <NeoCardDescription>
              {result.data?.error ?? t("invalidDescription")}
            </NeoCardDescription>
          </NeoCardHeader>
          <NeoCardContent className="text-center">
            <Link href="/fridge">
              <NeoButton variant="primary">{t("backToFridge")}</NeoButton>
            </Link>
          </NeoCardContent>
        </NeoCard>
      </div>
    );
  }

  const shareLink = result.data.shareLink;

  // Show join confirmation
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <NeoCard variant="elevated" className="max-w-md">
        <NeoCardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Eggy mood="happy" size="lg" />
          </div>
          <NeoCardTitle className="font-heading text-xl">
            {t("joinTitle")}
          </NeoCardTitle>
          <NeoCardDescription>
            {shareLink.ownerName} {t("inviteText")}
          </NeoCardDescription>
        </NeoCardHeader>
        <NeoCardContent className="space-y-6">
          {/* Fridge Info */}
          <div className="bg-muted/50 flex items-center gap-4 rounded-xl p-4">
            <div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
              <RefrigeratorIcon className="text-primary size-6" />
            </div>
            <div>
              <p className="font-heading font-semibold">
                {shareLink.fridgeName}
              </p>
              <p className="text-muted-foreground text-sm">
                par {shareLink.ownerName}
              </p>
            </div>
          </div>

          {/* What you'll get */}
          <div className="space-y-3">
            <p className="text-sm font-medium">{t("guestIntro")}</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="text-fresh-extra size-4" />
                {t("bulletView")}
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="text-fresh-extra size-4" />
                {t("bulletConsume")}
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="text-fresh-extra size-4" />
                {t("bulletRecipes")}
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="text-fresh-extra size-4" />
                {t("bulletTimer")}
              </li>
            </ul>
          </div>

          {/* Link info */}
          <div className="bg-muted/30 flex items-center justify-center gap-2 rounded-lg p-3">
            <AlertTriangle className="text-muted-foreground size-4" />
            <p className="text-muted-foreground text-xs">
              {shareLink.remainingUses} utilisation
              {shareLink.remainingUses > 1 ? "s" : ""} restante
              {shareLink.remainingUses > 1 ? "s" : ""} •{" "}
              {t("expires", {
                date: new Date(shareLink.expiresAt).toLocaleDateString(
                  locale === "fr" ? "fr-FR" : "en-US",
                ),
              })}
            </p>
          </div>

          {/* Join Form */}
          <form
            action={async () => {
              "use server";
              const joinResult = await acceptShareLinkAction({ code });
              if (joinResult.data?.success) {
                redirect("/fridge");
              }
            }}
          >
            <NeoButton type="submit" variant="primary" className="w-full">
              <Users className="mr-2 size-4" />
              {t("joinCta")}
            </NeoButton>
          </form>

          <p className="text-muted-foreground text-center text-xs">
            {t("leaveNote")}
          </p>
        </NeoCardContent>
      </NeoCard>
    </div>
  );
}
