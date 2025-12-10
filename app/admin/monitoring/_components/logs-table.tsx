"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { useQuery } from "@tanstack/react-query";
import {
  Ban,
  Download,
  Mail,
  Shield,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { getAdminLogsAction } from "../../_actions/admin-logs.action";

type ActionFilter =
  | "all"
  | "IMPERSONATE"
  | "BAN_USER"
  | "UNBAN_USER"
  | "SET_ROLE"
  | "SEND_TEST_EMAIL"
  | "CANCEL_INVITATION"
  | "EXPORT_DATA";

const actionIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  IMPERSONATE: Users,
  BAN_USER: Ban,
  UNBAN_USER: UserCheck,
  SET_ROLE: Shield,
  SEND_TEST_EMAIL: Mail,
  CANCEL_INVITATION: XCircle,
  EXPORT_DATA: Download,
};

const actionColors: Record<string, string> = {
  IMPERSONATE: "default",
  BAN_USER: "destructive",
  UNBAN_USER: "default",
  SET_ROLE: "secondary",
  SEND_TEST_EMAIL: "outline",
  CANCEL_INVITATION: "destructive",
  EXPORT_DATA: "outline",
};

export function LogsTable() {
  const t = useTranslations("admin.logs");
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<ActionFilter>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-logs", page, action],
    queryFn: async () => {
      const result = await getAdminLogsAction({
        page,
        limit: 20,
        action: action === "all" ? undefined : action,
      });
      return result.data;
    },
  });

  const logs = data?.logs ?? [];
  const totalPages = data?.pages ?? 1;

  const getActionBadge = (actionType: string) => {
    const Icon = actionIcons[actionType];
    const variant = actionColors[actionType] as
      | "default"
      | "destructive"
      | "secondary"
      | "outline";

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="size-3" />
        {t(`actions.${actionType}`)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Select
          value={action}
          onValueChange={(v) => {
            setAction(v as ActionFilter);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.all")}</SelectItem>
            <SelectItem value="IMPERSONATE">
              {t("actions.IMPERSONATE")}
            </SelectItem>
            <SelectItem value="BAN_USER">{t("actions.BAN_USER")}</SelectItem>
            <SelectItem value="UNBAN_USER">
              {t("actions.UNBAN_USER")}
            </SelectItem>
            <SelectItem value="SET_ROLE">{t("actions.SET_ROLE")}</SelectItem>
            <SelectItem value="SEND_TEST_EMAIL">
              {t("actions.SEND_TEST_EMAIL")}
            </SelectItem>
            <SelectItem value="CANCEL_INVITATION">
              {t("actions.CANCEL_INVITATION")}
            </SelectItem>
            <SelectItem value="EXPORT_DATA">
              {t("actions.EXPORT_DATA")}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.admin")}</TableHead>
              <TableHead>{t("table.action")}</TableHead>
              <TableHead>{t("table.target")}</TableHead>
              <TableHead>{t("table.metadata")}</TableHead>
              <TableHead>{t("table.date")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Aucun log trouve
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Link
                      href={`/admin/users/${log.admin.id}`}
                      className="flex items-center gap-2 hover:underline"
                    >
                      <Avatar className="size-8">
                        <AvatarImage src={log.admin.image ?? undefined} />
                        <AvatarFallback>
                          {log.admin.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <div>{log.admin.name}</div>
                        <div className="text-muted-foreground text-xs">
                          {log.admin.email}
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell>
                    {log.targetUser ? (
                      <Link
                        href={`/admin/users/${log.targetUser.id}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <Avatar className="size-8">
                          <AvatarImage
                            src={log.targetUser.image ?? undefined}
                          />
                          <AvatarFallback>
                            {log.targetUser.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <div>{log.targetUser.name}</div>
                          <div className="text-muted-foreground text-xs">
                            {log.targetUser.email}
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {log.metadata ? (
                      <code className="bg-muted rounded px-2 py-1 text-xs">
                        {JSON.stringify(log.metadata)}
                      </code>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {dayjs(log.createdAt).format("DD/MM/YYYY HH:mm")}
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
