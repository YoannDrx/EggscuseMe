import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredAdmin } from "@/lib/auth/auth-user";
import {
  NeoTabs,
  NeoTabsContent,
  NeoTabsList,
  NeoTabsTrigger,
} from "@/components/neo/neo-tabs";
import { FileDown, Mail } from "lucide-react";
import { EmailTemplatesList } from "./_components/email-templates-list";
import { ExportSection } from "./_components/export-section";

export default async function ToolsPage() {
  await getRequiredAdmin();
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Outils</LayoutTitle>
      </LayoutHeader>
      <LayoutContent>
        <NeoTabs defaultValue="emails" className="space-y-6">
          <NeoTabsList>
            <NeoTabsTrigger value="emails" className="gap-2">
              <Mail className="size-4" />
              Test Emails
            </NeoTabsTrigger>
            <NeoTabsTrigger value="export" className="gap-2">
              <FileDown className="size-4" />
              Export CSV
            </NeoTabsTrigger>
          </NeoTabsList>

          <NeoTabsContent value="emails" className="space-y-4">
            <p className="text-neo-text-muted text-sm">
              Testez les templates d&apos;emails transactionnels avant de les
              envoyer aux utilisateurs.
            </p>
            <EmailTemplatesList />
          </NeoTabsContent>

          <NeoTabsContent value="export" className="space-y-4">
            <p className="text-neo-text-muted text-sm">
              Exportez les données de la plateforme au format CSV.
            </p>
            <ExportSection />
          </NeoTabsContent>
        </NeoTabs>
      </LayoutContent>
    </Layout>
  );
}
