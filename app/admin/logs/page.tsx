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
import { LogsStats } from "./_components/logs-stats";
import { LogsTable } from "./_components/logs-table";

export default async function Page() {
  await getRequiredAdmin();
  const t = await getTranslations("admin.logs");

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>{t("title")}</LayoutTitle>
        <LayoutDescription>{t("description")}</LayoutDescription>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-6">
        <Suspense fallback={<div>Chargement des stats...</div>}>
          <LogsStats />
        </Suspense>
        <LogsTable />
      </LayoutContent>
    </Layout>
  );
}
