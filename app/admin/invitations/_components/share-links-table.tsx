"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      return <Badge variant="secondary">Desactive</Badge>;
    }
    if (new Date(link.expiresAt) < now) {
      return <Badge variant="destructive">Expire</Badge>;
    }
    if (link.usedCount >= link.maxUses) {
      return <Badge variant="outline">Max atteint</Badge>;
    }
    return <Badge variant="default">Actif</Badge>;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
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
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.code")}</TableHead>
              <TableHead>{t("table.fridge")}</TableHead>
              <TableHead>{t("table.owner")}</TableHead>
              <TableHead>{t("table.uses")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead>{t("table.expiresAt")}</TableHead>
              <TableHead>{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : links.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Aucun lien trouve
                </TableCell>
              </TableRow>
            ) : (
              links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <code className="bg-muted rounded px-2 py-1 text-sm">
                      {link.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/users/${link.fridge.owner.id}`}
                      className="hover:underline"
                    >
                      {link.fridge.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{link.fridge.owner.name}</div>
                      <div className="text-muted-foreground">
                        {link.fridge.owner.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {link.usedCount} / {link.maxUses}
                  </TableCell>
                  <TableCell>{getStatusBadge(link)}</TableCell>
                  <TableCell>
                    {dayjs(link.expiresAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Precedent
            </Button>
            <span className="text-muted-foreground flex items-center text-sm">
              Page {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
