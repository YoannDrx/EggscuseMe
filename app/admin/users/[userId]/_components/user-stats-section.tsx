"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="bg-muted h-4 w-20 animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="bg-muted h-8 w-16 animate-pulse rounded" />
            </CardContent>
          </Card>
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
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-xs font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="text-muted-foreground size-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-muted-foreground text-xs">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {data.fridge && data.fridge.members.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              Membres du frigo ({data.fridge.members.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}

      {data.memberships.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Membre de frigos ({data.memberships.length})</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}

      {data.recentConsumptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Consommations recentes</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
