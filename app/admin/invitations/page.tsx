import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredAdmin } from "@/lib/auth/auth-user";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { InvitationsStats } from "./_components/invitations-stats";
import { InvitationsTabs } from "./_components/invitations-tabs";

export default async function Page() {
  await getRequiredAdmin();
  const t = await getTranslations("admin.invitations");

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>{t("title")}</LayoutTitle>
        <LayoutDescription>
          Gerez les liens de partage et les invitations par email
        </LayoutDescription>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-6">
        <Suspense fallback={<div>Chargement des stats...</div>}>
          <InvitationsStats />
        </Suspense>
        <InvitationsTabs />
      </LayoutContent>
    </Layout>
  );
}
