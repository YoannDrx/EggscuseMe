import { Eggy } from "@/features/mascot";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { combineWithParentMetadata } from "@/lib/metadata";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  Download,
  MailCheck,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Suspense, type ElementType } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { EditProfileCardForm } from "./edit-profile-form";
import {
  NeoCard,
  NeoCardContent,
  NeoCardDescription,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";

export const generateMetadata = combineWithParentMetadata({
  title: "Mon profil",
  description: "Gérez vos informations personnelles.",
});

export default async function ProfilePage() {
  const t = await getTranslations("fridge.settings.profilePage");
  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/fridge/settings"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ChevronLeft className="size-4" />
        {t("back")}
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Eggy mood="happy" size="lg" />
        <div>
          <h1 className="font-heading text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      {/* Content */}
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>
    </div>
  );
}

async function ProfileContent() {
  const t = await getTranslations("fridge.settings.profilePage");
  const locale = await getLocale();
  const user = await getRequiredUser();
  const createdAt = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(user.createdAt));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <NeoCard variant="elevated">
          <NeoCardHeader>
            <NeoCardTitle className="flex items-center gap-2 text-base">
              <MailCheck className="size-4" />
              {t("accountStatus")}
            </NeoCardTitle>
            <NeoCardDescription>{t("accountStatusDesc")}</NeoCardDescription>
          </NeoCardHeader>
          <NeoCardContent className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-3">
              <p className="text-neo-text-muted text-xs">{t("emailStatus")}</p>
              <p className="font-medium">
                {user.emailVerified ? t("emailVerified") : t("emailPending")}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-neo-text-muted text-xs">{t("createdAt")}</p>
              <p className="font-medium">{createdAt}</p>
            </div>
          </NeoCardContent>
        </NeoCard>

        <NeoCard variant="elevated">
          <NeoCardHeader>
            <NeoCardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="size-4" />
              {t("quickActions")}
            </NeoCardTitle>
            <NeoCardDescription>{t("quickActionsDesc")}</NeoCardDescription>
          </NeoCardHeader>
          <NeoCardContent className="grid gap-2">
            <ProfileShortcut
              href="/fridge/settings/security"
              icon={ShieldCheck}
              label={t("security")}
            />
            <ProfileShortcut
              href="/fridge/settings/notifications"
              icon={Bell}
              label={t("notifications")}
            />
            <ProfileShortcut
              href="/fridge/settings/danger"
              icon={Download}
              label={t("exportData")}
            />
          </NeoCardContent>
        </NeoCard>
      </div>

      <EditProfileCardForm defaultValues={user} />
    </div>
  );
}

function ProfileShortcut({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: ElementType;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="hover:bg-neo-accent/10 flex items-center gap-3 rounded-lg border p-3 text-sm font-medium transition-colors"
    >
      <Icon className="text-neo-text-muted size-4" />
      {label}
    </Link>
  );
}

function ProfileSkeleton() {
  return (
    <div className="h-64 animate-pulse rounded-xl border border-stone-800 bg-stone-900" />
  );
}
