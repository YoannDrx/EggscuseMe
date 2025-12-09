import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredAdmin } from "@/lib/auth/auth-user";
import { getTranslations } from "next-intl/server";
import { EmailTemplatesList } from "./_components/email-templates-list";

export default async function Page() {
  await getRequiredAdmin();
  const t = await getTranslations("admin.emails");

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>{t("title")}</LayoutTitle>
        <LayoutDescription>{t("description")}</LayoutDescription>
      </LayoutHeader>
      <LayoutContent>
        <EmailTemplatesList />
      </LayoutContent>
    </Layout>
  );
}
