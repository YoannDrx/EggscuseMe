import {
  NeoCard,
  NeoCardContent,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import { prisma } from "@/lib/prisma";
import {
  CheckCircle2,
  Clock,
  Link as LinkIcon,
  Mail,
  XCircle,
  Zap,
} from "lucide-react";

async function getInvitationsStats() {
  const now = new Date();

  const [
    totalShareLinks,
    activeShareLinks,
    totalEmailInvitations,
    pendingInvitations,
    acceptedInvitations,
    expiredInvitations,
  ] = await Promise.all([
    prisma.fridgeShareLink.count(),
    prisma.fridgeShareLink.count({
      where: { isActive: true, expiresAt: { gt: now } },
    }),
    prisma.fridgeEmailInvitation.count(),
    prisma.fridgeEmailInvitation.count({ where: { status: "PENDING" } }),
    prisma.fridgeEmailInvitation.count({ where: { status: "ACCEPTED" } }),
    prisma.fridgeEmailInvitation.count({ where: { status: "EXPIRED" } }),
  ]);

  return {
    shareLinks: { total: totalShareLinks, active: activeShareLinks },
    emailInvitations: {
      total: totalEmailInvitations,
      pending: pendingInvitations,
      accepted: acceptedInvitations,
      expired: expiredInvitations,
    },
  };
}

export async function InvitationsStats() {
  const stats = await getInvitationsStats();

  const statItems = [
    {
      title: "Total liens",
      value: stats.shareLinks.total,
      description: "Liens de partage crees",
      icon: LinkIcon,
    },
    {
      title: "Liens actifs",
      value: stats.shareLinks.active,
      description: "Liens encore valides",
      icon: Zap,
    },
    {
      title: "Invitations email",
      value: stats.emailInvitations.total,
      description: "Total invitations",
      icon: Mail,
    },
    {
      title: "En attente",
      value: stats.emailInvitations.pending,
      description: "Invitations non acceptees",
      icon: Clock,
    },
    {
      title: "Acceptees",
      value: stats.emailInvitations.accepted,
      description: "Invitations reussies",
      icon: CheckCircle2,
    },
    {
      title: "Expirees",
      value: stats.emailInvitations.expired,
      description: "Invitations expirees",
      icon: XCircle,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      {statItems.map((stat) => {
        const Icon = stat.icon;
        return (
          <NeoCard key={stat.title}>
            <NeoCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <NeoCardTitle className="text-muted-foreground text-xs font-medium">
                {stat.title}
              </NeoCardTitle>
              <Icon className="text-muted-foreground size-4" />
            </NeoCardHeader>
            <NeoCardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground text-xs">
                {stat.description}
              </p>
            </NeoCardContent>
          </NeoCard>
        );
      })}
    </div>
  );
}
