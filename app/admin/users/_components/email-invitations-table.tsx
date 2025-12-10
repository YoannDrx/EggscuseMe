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
        return <Badge variant="outline">{t("stats.pending")}</Badge>;
      case "ACCEPTED":
        return <Badge variant="default">{t("stats.accepted")}</Badge>;
      case "EXPIRED":
        return <Badge variant="secondary">{t("stats.expired")}</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">{t("stats.cancelled")}</Badge>;
      default:
        return <Badge variant="outline">{invitationStatus}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
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
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.email")}</TableHead>
              <TableHead>{t("table.fridge")}</TableHead>
              <TableHead>Invite par</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead>{t("table.expiresAt")}</TableHead>
              <TableHead>{t("table.createdAt")}</TableHead>
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
            ) : invitations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Aucune invitation trouvee
                </TableCell>
              </TableRow>
            ) : (
              invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell>{invitation.email}</TableCell>
                  <TableCell>{invitation.fridge.name}</TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/users/${invitation.invitedBy.id}`}
                      className="hover:underline"
                    >
                      <div className="text-sm">
                        <div>{invitation.invitedBy.name}</div>
                        <div className="text-muted-foreground">
                          {invitation.invitedBy.email}
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                  <TableCell>
                    {dayjs(invitation.expiresAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>
                    {dayjs(invitation.createdAt).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                  <TableCell>
                    {invitation.status === "PENDING" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
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
