import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredAdmin } from "@/lib/auth/auth-user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <Tabs defaultValue="emails" className="space-y-6">
          <TabsList>
            <TabsTrigger value="emails" className="gap-2">
              <Mail className="size-4" />
              Test Emails
            </TabsTrigger>
            <TabsTrigger value="export" className="gap-2">
              <FileDown className="size-4" />
              Export CSV
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emails" className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Testez les templates d&apos;emails transactionnels avant de les
              envoyer aux utilisateurs.
            </p>
            <EmailTemplatesList />
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Exportez les données de la plateforme au format CSV.
            </p>
            <ExportSection />
          </TabsContent>
        </Tabs>
      </LayoutContent>
    </Layout>
  );
}
