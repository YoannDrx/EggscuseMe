import { Eggy } from "@/features/mascot";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { combineWithParentMetadata } from "@/lib/metadata";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { EditProfileCardForm } from "./edit-profile-form";

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
  const user = await getRequiredUser();

  return <EditProfileCardForm defaultValues={user} />;
}

function ProfileSkeleton() {
  return (
    <div className="h-64 animate-pulse rounded-xl border border-stone-800 bg-stone-900" />
  );
}
