"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { EmailInvitationsTable } from "./email-invitations-table";
import { ShareLinksTable } from "./share-links-table";

export function InvitationsTabs() {
  const t = useTranslations("admin.invitations.tabs");

  return (
    <Tabs defaultValue="shareLinks">
      <TabsList>
        <TabsTrigger value="shareLinks">{t("shareLinks")}</TabsTrigger>
        <TabsTrigger value="emailInvitations">
          {t("emailInvitations")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="shareLinks" className="mt-4">
        <ShareLinksTable />
      </TabsContent>
      <TabsContent value="emailInvitations" className="mt-4">
        <EmailInvitationsTable />
      </TabsContent>
    </Tabs>
  );
}
