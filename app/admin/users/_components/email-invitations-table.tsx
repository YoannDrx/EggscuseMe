"use client";

import { NeoBadge } from "@/components/neo/neo-badge";
import { NeoButton } from "@/components/neo/neo-button";
import {
  NeoCard,
  NeoCardContent,
  NeoCardHeader,
} from "@/components/neo/neo-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  NeoTable,
  NeoTableBody,
  NeoTableCell,
  NeoTableHead,
  NeoTableHeader,
  NeoTableRow,
} from "@/components/neo/neo-table";
import { dayjs } from "@/lib/dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Search, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  adminCancelEmailInvitationAction,
  getAdminEmailInvitationsAction,
} from "../../_actions/admin-invitations.action";

type StatusFilter = "all" | "PENDING" | "ACCEPTED" | "EXPIRED" | "CANCELLED";

export function EmailInvitationsTable() {
  const t = useTranslations("admin.invitations");
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-email-invitations", page, status, search],
    queryFn: async () => {
      const result = await getAdminEmailInvitationsAction({
        page,
        limit: 10,
        status,
        search: search || undefined,
      });
      return result.data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const result = await adminCancelEmailInvitationAction({ invitationId });
      if (result.data && result.data.success === false) {
        throw new Error(result.data.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Invitation annulee");
      void queryClient.invalidateQueries({
        queryKey: ["admin-email-invitations"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const invitations = data?.invitations ?? [];
  const totalPages = data?.pages ?? 1;

  const getStatusBadge = (invitationStatus: string) => {
    switch (invitationStatus) {
      case "PENDING":
        return <NeoBadge variant="outline">{t("stats.pending")}</NeoBadge>;
      case "ACCEPTED":
        return <NeoBadge variant="default">{t("stats.accepted")}</NeoBadge>;
      case "EXPIRED":
        return <NeoBadge variant="secondary">{t("stats.expired")}</NeoBadge>;
      case "CANCELLED":
        return (
          <NeoBadge variant="destructive">{t("stats.cancelled")}</NeoBadge>
        );
      default:
        return <NeoBadge variant="outline">{invitationStatus}</NeoBadge>;
    }
  };

  return (
    <NeoCard>
      <NeoCardHeader className="flex flex-row items-center gap-4">
        <InputGroup className="flex-1">
          <InputGroupInput
            placeholder="Rechercher par email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <InputGroupAddon align="inline-start">
            <Search className="text-muted-foreground size-4" />
          </InputGroupAddon>
        </InputGroup>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as StatusFilter);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.all")}</SelectItem>
            <SelectItem value="PENDING">{t("stats.pending")}</SelectItem>
            <SelectItem value="ACCEPTED">{t("stats.accepted")}</SelectItem>
            <SelectItem value="EXPIRED">{t("stats.expired")}</SelectItem>
            <SelectItem value="CANCELLED">{t("stats.cancelled")}</SelectItem>
          </SelectContent>
        </Select>
      </NeoCardHeader>
      <NeoCardContent>
        <NeoTable>
          <NeoTableHeader>
            <NeoTableRow>
              <NeoTableHead>{t("table.email")}</NeoTableHead>
              <NeoTableHead>{t("table.fridge")}</NeoTableHead>
              <NeoTableHead>Invite par</NeoTableHead>
              <NeoTableHead>{t("table.status")}</NeoTableHead>
              <NeoTableHead>{t("table.expiresAt")}</NeoTableHead>
              <NeoTableHead>{t("table.createdAt")}</NeoTableHead>
              <NeoTableHead>{t("table.actions")}</NeoTableHead>
            </NeoTableRow>
          </NeoTableHeader>
          <NeoTableBody>
            {isLoading ? (
              <NeoTableRow>
                <NeoTableCell colSpan={7} className="text-center">
                  Chargement...
                </NeoTableCell>
              </NeoTableRow>
            ) : invitations.length === 0 ? (
              <NeoTableRow>
                <NeoTableCell colSpan={7} className="text-center">
                  Aucune invitation trouvee
                </NeoTableCell>
              </NeoTableRow>
            ) : (
              invitations.map((invitation) => (
                <NeoTableRow key={invitation.id}>
                  <NeoTableCell>{invitation.email}</NeoTableCell>
                  <NeoTableCell>{invitation.fridge.name}</NeoTableCell>
                  <NeoTableCell>
                    <Link
                      href={`/admin/users/${invitation.invitedBy.id}`}
                      className="hover:underline"
                    >
                      <div className="text-sm">
                        <div>{invitation.invitedBy.name}</div>
                        <div className="text-neo-text-muted">
                          {invitation.invitedBy.email}
                        </div>
                      </div>
                    </Link>
                  </NeoTableCell>
                  <NeoTableCell>
                    {getStatusBadge(invitation.status)}
                  </NeoTableCell>
                  <NeoTableCell>
                    {dayjs(invitation.expiresAt).format("DD/MM/YYYY")}
                  </NeoTableCell>
                  <NeoTableCell>
                    {dayjs(invitation.createdAt).format("DD/MM/YYYY HH:mm")}
                  </NeoTableCell>
                  <NeoTableCell>
                    {invitation.status === "PENDING" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <NeoButton variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </NeoButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => cancelMutation.mutate(invitation.id)}
                            className="text-destructive"
                          >
                            <XCircle className="mr-2 size-4" />
                            {t("actions.cancel")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </NeoTableCell>
                </NeoTableRow>
              ))
            )}
          </NeoTableBody>
        </NeoTable>
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            <NeoButton
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Precedent
            </NeoButton>
            <span className="text-neo-text-muted flex items-center text-sm">
              Page {page} / {totalPages}
            </span>
            <NeoButton
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant
            </NeoButton>
          </div>
        )}
      </NeoCardContent>
    </NeoCard>
  );
}
