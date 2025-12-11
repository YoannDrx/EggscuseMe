"use client";

import {
  NeoTabs,
  NeoTabsList,
  NeoTabsTrigger,
  NeoTabsContent,
} from "@/components/neo";
import { useTranslations } from "next-intl";
import { EmailInvitationsTable } from "./email-invitations-table";
import { ShareLinksTable } from "./share-links-table";

export function InvitationsTabs() {
  const t = useTranslations("admin.invitations.tabs");

  return (
    <NeoTabs defaultValue="shareLinks">
      <NeoTabsList>
        <NeoTabsTrigger value="shareLinks">{t("shareLinks")}</NeoTabsTrigger>
        <NeoTabsTrigger value="emailInvitations">
          {t("emailInvitations")}
        </NeoTabsTrigger>
      </NeoTabsList>
      <NeoTabsContent value="shareLinks">
        <ShareLinksTable />
      </NeoTabsContent>
      <NeoTabsContent value="emailInvitations">
        <EmailInvitationsTable />
      </NeoTabsContent>
    </NeoTabs>
  );
}
