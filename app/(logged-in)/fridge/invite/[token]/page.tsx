import { NeoButton } from "@/components/neo";
import {
  NeoCard,
  NeoCardContent,
  NeoCardDescription,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import {
  acceptEmailInvitationAction,
  getEmailInvitationByTokenAction,
} from "@/features/fridge/email-invitation.action";
import { Eggy } from "@/features/mascot";
import { AlertTriangle, Check, RefrigeratorIcon, Users } from "lucide-react";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

type InvitePageProps = {
  params: Promise<{ token: string }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const locale = await getLocale();
  const t = await getTranslations("fridge.invite");

  // Get invitation info
  const result = await getEmailInvitationByTokenAction({ token });

  // Handle errors or invalid invitation
  if (result.data?.error || !result.data?.invitation) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <NeoCard className="max-w-md">
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

  const invitation = result.data.invitation;

  // Show join confirmation
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <NeoCard className="max-w-md">
        <NeoCardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Eggy mood="happy" size="lg" />
          </div>
          <NeoCardTitle className="font-heading text-xl">
            {t("joinTitle")}
          </NeoCardTitle>
          <NeoCardDescription>
            {invitation.inviterName} {t("inviteText")}
          </NeoCardDescription>
        </NeoCardHeader>
        <NeoCardContent className="space-y-6">
          {/* Fridge Info */}
          <div className="bg-neo-card/50 flex items-center gap-4 rounded-xl p-4">
            <div className="bg-neo-accent/10 flex size-12 items-center justify-center rounded-full">
              <RefrigeratorIcon className="text-neo-accent size-6" />
            </div>
            <div>
              <p className="font-heading font-semibold">
                {invitation.fridgeName}
              </p>
              <p className="text-neo-text-muted text-sm">
                par {invitation.inviterName}
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

          {/* Expiration info */}
          <div className="bg-neo-card/30 flex items-center justify-center gap-2 rounded-lg p-3">
            <AlertTriangle className="text-neo-text-muted size-4" />
            <p className="text-neo-text-muted text-xs">
              {t("expires", {
                date: new Date(invitation.expiresAt).toLocaleDateString(
                  locale === "fr" ? "fr-FR" : "en-US",
                ),
              })}
            </p>
          </div>

          {/* Join Form */}
          <form
            action={async () => {
              "use server";
              const joinResult = await acceptEmailInvitationAction({ token });
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

          <p className="text-neo-text-muted text-center text-xs">
            {t("leaveNote")}
          </p>
        </NeoCardContent>
      </NeoCard>
    </div>
  );
}
