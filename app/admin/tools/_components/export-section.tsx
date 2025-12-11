"use client";

import { NeoButton } from "@/components/neo/neo-button";
import {
  NeoCard,
  NeoCardContent,
  NeoCardDescription,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo/neo-card";
import { useMutation } from "@tanstack/react-query";
import { Download, FileSpreadsheet, Loader2, Mail, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  exportEmailInvitationsCSVAction,
  exportShareLinksCSVAction,
  exportUsersCSVAction,
} from "../../_actions/admin-export.action";

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function ExportSection() {
  const t = useTranslations("admin.export");

  const usersMutation = useMutation({
    mutationFn: async () => {
      const result = await exportUsersCSVAction();
      return result.data;
    },
    onSuccess: (data) => {
      if (data) {
        downloadCSV(data.csv, data.filename);
        toast.success(t("exports.users.success"));
      }
    },
    onError: () => {
      toast.error(t("exports.users.error"));
    },
  });

  const shareLinksMutation = useMutation({
    mutationFn: async () => {
      const result = await exportShareLinksCSVAction();
      return result.data;
    },
    onSuccess: (data) => {
      if (data) {
        downloadCSV(data.csv, data.filename);
        toast.success(t("exports.shareLinks.success"));
      }
    },
    onError: () => {
      toast.error(t("exports.shareLinks.error"));
    },
  });

  const emailInvitationsMutation = useMutation({
    mutationFn: async () => {
      const result = await exportEmailInvitationsCSVAction();
      return result.data;
    },
    onSuccess: (data) => {
      if (data) {
        downloadCSV(data.csv, data.filename);
        toast.success(t("exports.emailInvitations.success"));
      }
    },
    onError: () => {
      toast.error(t("exports.emailInvitations.error"));
    },
  });

  const exports = [
    {
      id: "users",
      name: t("exports.users.name"),
      description: t("exports.users.description"),
      icon: Users,
      mutation: usersMutation,
    },
    {
      id: "share-links",
      name: t("exports.shareLinks.name"),
      description: t("exports.shareLinks.description"),
      icon: FileSpreadsheet,
      mutation: shareLinksMutation,
    },
    {
      id: "email-invitations",
      name: t("exports.emailInvitations.name"),
      description: t("exports.emailInvitations.description"),
      icon: Mail,
      mutation: emailInvitationsMutation,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {exports.map((exportItem) => {
        const Icon = exportItem.icon;
        const isPending = exportItem.mutation.isPending;

        return (
          <NeoCard key={exportItem.id}>
            <NeoCardHeader>
              <div className="flex items-center gap-2">
                <Icon className="text-neo-text-muted size-5" />
                <NeoCardTitle className="text-lg">
                  {exportItem.name}
                </NeoCardTitle>
              </div>
              <NeoCardDescription>{exportItem.description}</NeoCardDescription>
            </NeoCardHeader>
            <NeoCardContent>
              <NeoButton
                className="w-full"
                onClick={() => exportItem.mutation.mutate()}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Download className="mr-2 size-4" />
                )}
                {t("download")}
              </NeoButton>
            </NeoCardContent>
          </NeoCard>
        );
      })}
    </div>
  );
}
