"use client";

import {
  NeoCard,
  NeoCardContent,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  DollarSign,
  Egg,
  Package,
  Trash2,
  Users,
} from "lucide-react";
import { getUserDetailedStatsAction } from "../../../_actions/admin-user-stats.action";

export function UserStatsSection({ userId }: { userId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-user-stats", userId],
    queryFn: async () => {
      const result = await getUserDetailedStatsAction({ userId });
      return result.data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <NeoCard key={i}>
            <NeoCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="bg-muted h-4 w-20 animate-pulse rounded" />
            </NeoCardHeader>
            <NeoCardContent>
              <div className="bg-muted h-8 w-16 animate-pulse rounded" />
            </NeoCardContent>
          </NeoCard>
        ))}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const stats = data.stats;

  const statItems = [
    {
      title: "Boites d'oeufs",
      value: stats.totalEggBoxes,
      description: `${stats.activeEggBoxes} actives`,
      icon: Package,
    },
    {
      title: "Oeufs ajoutes",
      value: stats.totalEggsAdded,
      description: "Total ajoute",
      icon: Egg,
    },
    {
      title: "Oeufs consommes",
      value: stats.totalEggsConsumed,
      description: "Total consomme",
      icon: BarChart3,
    },
    {
      title: "Oeufs restants",
      value: stats.totalEggsRemaining,
      description: "En stock",
      icon: Egg,
    },
    {
      title: "Oeufs gaspilles",
      value: stats.totalEggsWasted,
      description: "Expires",
      icon: Trash2,
    },
    {
      title: "Economies",
      value: `${stats.moneySaved} EUR`,
      description: "Estimees",
      icon: DollarSign,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
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

      {data.fridge && data.fridge.members.length > 0 && (
        <NeoCard>
          <NeoCardHeader>
            <NeoCardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              Membres du frigo ({data.fridge.members.length})
            </NeoCardTitle>
          </NeoCardHeader>
          <NeoCardContent>
            <div className="flex flex-col gap-2">
              {data.fridge.members.map((member) => (
                <div
                  key={member.id}
                  className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
                >
                  <div>
                    <div className="font-medium">{member.user.name}</div>
                    <div className="text-muted-foreground text-sm">
                      {member.user.email}
                    </div>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {member.role}
                  </div>
                </div>
              ))}
            </div>
          </NeoCardContent>
        </NeoCard>
      )}

      {data.memberships.length > 0 && (
        <NeoCard>
          <NeoCardHeader>
            <NeoCardTitle>
              Membre de frigos ({data.memberships.length})
            </NeoCardTitle>
          </NeoCardHeader>
          <NeoCardContent>
            <div className="flex flex-col gap-2">
              {data.memberships.map((membership) => (
                <div
                  key={membership.fridgeId}
                  className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
                >
                  <div>
                    <div className="font-medium">{membership.fridgeName}</div>
                    <div className="text-muted-foreground text-sm">
                      Proprietaire: {membership.ownerName} (
                      {membership.ownerEmail})
                    </div>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {membership.role}
                  </div>
                </div>
              ))}
            </div>
          </NeoCardContent>
        </NeoCard>
      )}

      {data.recentConsumptions.length > 0 && (
        <NeoCard>
          <NeoCardHeader>
            <NeoCardTitle>Consommations recentes</NeoCardTitle>
          </NeoCardHeader>
          <NeoCardContent>
            <div className="flex flex-col gap-2">
              {data.recentConsumptions.slice(0, 10).map((consumption) => (
                <div
                  key={consumption.id}
                  className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
                >
                  <div>
                    <div className="font-medium">
                      {consumption.quantity} oeuf(s) - {consumption.cookingType}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {consumption.eggBoxName}
                    </div>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {new Date(consumption.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </NeoCardContent>
        </NeoCard>
      )}
    </div>
  );
}
