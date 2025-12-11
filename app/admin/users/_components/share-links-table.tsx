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
import {
  Link as LinkIcon,
  MoreHorizontal,
  Search,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  adminDeactivateShareLinkAction,
  getAdminShareLinksAction,
} from "../../_actions/admin-invitations.action";

export function ShareLinksTable() {
  const t = useTranslations("admin.invitations");
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"all" | "active" | "expired" | "maxed">(
    "all",
  );
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-share-links", page, status, search],
    queryFn: async () => {
      const result = await getAdminShareLinksAction({
        page,
        limit: 10,
        status,
        search: search || undefined,
      });
      return result.data;
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: async (shareLinkId: string) => {
      const result = await adminDeactivateShareLinkAction({ shareLinkId });
      if (result.data && result.data.success === false) {
        throw new Error(result.data.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Lien desactive");
      void queryClient.invalidateQueries({ queryKey: ["admin-share-links"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const links = data?.links ?? [];
  const totalPages = data?.pages ?? 1;

  const getStatusBadge = (link: (typeof links)[0]) => {
    const now = new Date();
    if (!link.isActive) {
      return <NeoBadge variant="secondary">Desactive</NeoBadge>;
    }
    if (new Date(link.expiresAt) < now) {
      return <NeoBadge variant="destructive">Expire</NeoBadge>;
    }
    if (link.usedCount >= link.maxUses) {
      return <NeoBadge variant="outline">Max atteint</NeoBadge>;
    }
    return <NeoBadge variant="default">Actif</NeoBadge>;
  };

  return (
    <NeoCard>
      <NeoCardHeader className="flex flex-row items-center gap-4">
        <InputGroup className="flex-1">
          <InputGroupInput
            placeholder="Rechercher par code ou frigo..."
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
            setStatus(v as typeof status);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.all")}</SelectItem>
            <SelectItem value="active">{t("filters.active")}</SelectItem>
            <SelectItem value="expired">{t("filters.expired")}</SelectItem>
            <SelectItem value="maxed">{t("filters.maxed")}</SelectItem>
          </SelectContent>
        </Select>
      </NeoCardHeader>
      <NeoCardContent>
        <NeoTable>
          <NeoTableHeader>
            <NeoTableRow>
              <NeoTableHead>{t("table.code")}</NeoTableHead>
              <NeoTableHead>{t("table.fridge")}</NeoTableHead>
              <NeoTableHead>{t("table.owner")}</NeoTableHead>
              <NeoTableHead>{t("table.uses")}</NeoTableHead>
              <NeoTableHead>{t("table.status")}</NeoTableHead>
              <NeoTableHead>{t("table.expiresAt")}</NeoTableHead>
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
            ) : links.length === 0 ? (
              <NeoTableRow>
                <NeoTableCell colSpan={7} className="text-center">
                  Aucun lien trouve
                </NeoTableCell>
              </NeoTableRow>
            ) : (
              links.map((link) => (
                <NeoTableRow key={link.id}>
                  <NeoTableCell>
                    <code className="bg-neo-bg rounded px-2 py-1 text-sm">
                      {link.code}
                    </code>
                  </NeoTableCell>
                  <NeoTableCell>
                    <Link
                      href={`/admin/users/${link.fridge.owner.id}`}
                      className="hover:underline"
                    >
                      {link.fridge.name}
                    </Link>
                  </NeoTableCell>
                  <NeoTableCell>
                    <div className="text-sm">
                      <div>{link.fridge.owner.name}</div>
                      <div className="text-neo-text-muted">
                        {link.fridge.owner.email}
                      </div>
                    </div>
                  </NeoTableCell>
                  <NeoTableCell>
                    {link.usedCount} / {link.maxUses}
                  </NeoTableCell>
                  <NeoTableCell>{getStatusBadge(link)}</NeoTableCell>
                  <NeoTableCell>
                    {dayjs(link.expiresAt).format("DD/MM/YYYY")}
                  </NeoTableCell>
                  <NeoTableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <NeoButton variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </NeoButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/users/${link.fridge.owner.id}`}>
                            <LinkIcon className="mr-2 size-4" />
                            {t("actions.viewFridge")}
                          </Link>
                        </DropdownMenuItem>
                        {link.isActive && (
                          <DropdownMenuItem
                            onClick={() => deactivateMutation.mutate(link.id)}
                            className="text-destructive"
                          >
                            <XCircle className="mr-2 size-4" />
                            {t("actions.deactivate")}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
