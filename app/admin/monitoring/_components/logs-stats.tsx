import {
  NeoCard,
  NeoCardContent,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo/neo-card";
import { prisma } from "@/lib/prisma";
import {
  Activity,
  Ban,
  Download,
  Mail,
  Shield,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";

async function getLogsStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [total, todayCount, actionCounts] = await Promise.all([
    prisma.adminLog.count(),
    prisma.adminLog.count({ where: { createdAt: { gte: today } } }),
    prisma.adminLog.groupBy({
      by: ["action"],
      _count: { action: true },
    }),
  ]);

  return {
    total,
    todayCount,
    actionCounts: Object.fromEntries(
      actionCounts.map((item) => [item.action, item._count.action]),
    ) as Record<string, number>,
  };
}

export async function LogsStats() {
  const stats = await getLogsStats();

  const statItems = [
    {
      title: "Total logs",
      value: stats.total,
      description: "Actions enregistrees",
      icon: Activity,
    },
    {
      title: "Aujourd'hui",
      value: stats.todayCount,
      description: "Actions aujourd'hui",
      icon: Activity,
    },
    {
      title: "Impersonations",
      value: stats.actionCounts.IMPERSONATE || 0,
      description: "Connexions en tant que",
      icon: Users,
    },
    {
      title: "Bannissements",
      value: stats.actionCounts.BAN_USER || 0,
      description: "Utilisateurs bannis",
      icon: Ban,
    },
    {
      title: "Debannissements",
      value: stats.actionCounts.UNBAN_USER || 0,
      description: "Utilisateurs debannis",
      icon: UserCheck,
    },
    {
      title: "Roles modifies",
      value: stats.actionCounts.SET_ROLE || 0,
      description: "Changements de role",
      icon: Shield,
    },
    {
      title: "Emails test",
      value: stats.actionCounts.SEND_TEST_EMAIL || 0,
      description: "Emails envoyes",
      icon: Mail,
    },
    {
      title: "Invitations annulees",
      value: stats.actionCounts.CANCEL_INVITATION || 0,
      description: "Invitations annulees",
      icon: XCircle,
    },
    {
      title: "Exports",
      value: stats.actionCounts.EXPORT_DATA || 0,
      description: "Fichiers exportes",
      icon: Download,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-9">
      {statItems.map((stat) => {
        const Icon = stat.icon;
        return (
          <NeoCard key={stat.title}>
            <NeoCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <NeoCardTitle className="text-neo-text-muted text-xs font-medium">
                {stat.title}
              </NeoCardTitle>
              <Icon className="text-neo-text-muted size-4" />
            </NeoCardHeader>
            <NeoCardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-neo-text-muted text-xs">{stat.description}</p>
            </NeoCardContent>
          </NeoCard>
        );
      })}
    </div>
  );
}
