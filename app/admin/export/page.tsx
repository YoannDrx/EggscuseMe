import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredAdmin } from "@/lib/auth/auth-user";
import { getTranslations } from "next-intl/server";
import { ExportSection } from "./_components/export-section";

export default async function Page() {
  await getRequiredAdmin();
  const t = await getTranslations("admin.export");

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>{t("title")}</LayoutTitle>
        <LayoutDescription>{t("description")}</LayoutDescription>
      </LayoutHeader>
      <LayoutContent>
        <ExportSection />
      </LayoutContent>
    </Layout>
  );
}
