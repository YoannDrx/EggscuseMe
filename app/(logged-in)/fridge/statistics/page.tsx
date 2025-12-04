"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Eggy } from "@/features/mascot";
import {
  exportConsumptionCSVAction,
  getStatisticsAction,
} from "@/features/statistics/statistics.action";
import {
  ChartLine,
  Download,
  Egg,
  Euro,
  Leaf,
  Loader2,
  Package,
  TrendingUp,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

const FRESHNESS_COLORS: Record<string, string> = {
  "extra-fresh": "hsl(var(--fresh-extra))",
  fresh: "hsl(var(--fresh))",
  "cook-thoroughly": "hsl(var(--fresh-cook))",
  expired: "hsl(var(--muted))",
};

const FRESHNESS_LABELS: Record<string, string> = {
  "extra-fresh": "Extra-frais",
  fresh: "Frais",
  "cook-thoroughly": "A cuire",
  expired: "Perime",
};

const cookingChartConfig: ChartConfig = {
  count: {
    label: "Quantite",
    color: "hsl(var(--primary))",
  },
};

const consumptionChartConfig: ChartConfig = {
  count: {
    label: "Oeufs consommes",
    color: "hsl(var(--primary))",
  },
};

export default function StatisticsPage() {
  const {
    execute: loadStats,
    result,
    isPending,
  } = useAction(getStatisticsAction);
  const { execute: exportCSV, isPending: isExporting } = useAction(
    exportConsumptionCSVAction,
    {
      onSuccess: (data) => {
        const csv = data.data.csv;
        if (!csv) return;
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `eggscuseme-export-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      },
    },
  );

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const stats = result.data?.stats;

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <Loader2 className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground">Chargement des statistiques...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Eggy mood="sad" size="lg" />
          <div>
            <h1 className="font-heading text-2xl font-bold">Statistiques</h1>
            <p className="text-muted-foreground">
              Aucune donnee disponible pour le moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Eggy mood="happy" size="lg" />
          <div>
            <h1 className="font-heading text-2xl font-bold">Statistiques</h1>
            <p className="text-muted-foreground">
              Vos donnees de consommation sur 90 jours
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => exportCSV()}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Download className="mr-2 size-4" />
          )}
          Exporter CSV
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card variant="sunny">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock actuel</CardTitle>
            <Egg className="text-primary size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEggs}</div>
            <p className="text-muted-foreground text-xs">
              {stats.activeBoxes} boite{stats.activeBoxes > 1 ? "s" : ""} active
              {stats.activeBoxes > 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card variant="sunny">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consommes</CardTitle>
            <TrendingUp className="text-fresh-extra size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConsumed}</div>
            <p className="text-muted-foreground text-xs">
              Sur les 90 derniers jours
            </p>
          </CardContent>
        </Card>

        <Card variant="sunny">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economies</CardTitle>
            <Euro className="text-fresh size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.moneySaved.toFixed(2)} EUR
            </div>
            <p className="text-muted-foreground text-xs">
              Estimation anti-gaspi
            </p>
          </CardContent>
        </Card>

        <Card variant="sunny">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fraicheur moyenne
            </CardTitle>
            <Leaf className="text-fresh-extra size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgFreshnessScore} jours
            </div>
            <p className="text-muted-foreground text-xs">
              Avant expiration en moyenne
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Consumption over time */}
        <Card variant="sunny">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ChartLine className="text-primary size-5" />
              <CardTitle>Consommation quotidienne</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {stats.dailyConsumption.length > 0 ? (
              <ChartContainer
                config={consumptionChartConfig}
                className="h-[300px] w-full"
              >
                <AreaChart data={stats.dailyConsumption}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value: string) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip
                    content={(props) => (
                      <ChartTooltipContent
                        {...props}
                        labelFormatter={(value) => {
                          const date = new Date(value as string);
                          return date.toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                          });
                        }}
                      />
                    )}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-muted-foreground">Aucune donnee</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cooking types distribution */}
        <Card variant="sunny">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="text-primary size-5" />
              <CardTitle>Types de cuisson</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {stats.cookingTypes.length > 0 ? (
              <ChartContainer
                config={cookingChartConfig}
                className="h-[300px] w-full"
              >
                <PieChart>
                  <ChartTooltip
                    content={(props) => <ChartTooltipContent {...props} />}
                  />
                  <Pie
                    data={stats.cookingTypes}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name} (${((percent as number) * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {stats.cookingTypes.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(var(--primary) / ${1 - index * 0.15})`}
                      />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="type" />}
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-muted-foreground">Aucune donnee</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly comparison */}
        <Card variant="sunny">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="text-primary size-5" />
              <CardTitle>Consommation mensuelle</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {stats.monthlyConsumption.length > 0 ? (
              <ChartContainer
                config={consumptionChartConfig}
                className="h-[300px] w-full"
              >
                <BarChart data={stats.monthlyConsumption}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value: string) => {
                      const [year, month] = value.split("-");
                      const monthNames = [
                        "Jan",
                        "Fev",
                        "Mar",
                        "Avr",
                        "Mai",
                        "Jun",
                        "Jul",
                        "Aou",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ];
                      return `${monthNames[parseInt(month) - 1]} ${year.slice(2)}`;
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip
                    content={(props) => <ChartTooltipContent {...props} />}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-muted-foreground">Aucune donnee</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current freshness distribution */}
        <Card variant="sunny">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Leaf className="text-primary size-5" />
              <CardTitle>Fraicheur du stock actuel</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {stats.currentFreshness.some((f) => f.count > 0) ? (
              <div className="space-y-4">
                {stats.currentFreshness.map((item) => (
                  <div key={item.status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="size-3 rounded-full"
                          style={{
                            backgroundColor: FRESHNESS_COLORS[item.status],
                          }}
                        />
                        <span className="text-sm font-medium">
                          {FRESHNESS_LABELS[item.status]}
                        </span>
                      </div>
                      <Badge variant="secondary">{item.count} oeufs</Badge>
                    </div>
                    <div className="bg-muted h-2 overflow-hidden rounded-full">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${stats.totalEggs > 0 ? (item.count / stats.totalEggs) * 100 : 0}%`,
                          backgroundColor: FRESHNESS_COLORS[item.status],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-muted-foreground">Aucun oeuf en stock</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Freshness at consumption */}
      <Card variant="sunny">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Egg className="text-primary size-5" />
            <CardTitle>Fraicheur a la consommation</CardTitle>
            <Badge variant="outline">90 derniers jours</Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Repartition de la fraicheur des oeufs au moment de leur consommation
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.freshnessAtConsumption.map((item) => (
              <div
                key={item.status}
                className="flex items-center gap-3 rounded-lg border p-4"
                style={{
                  borderColor: FRESHNESS_COLORS[item.status],
                  backgroundColor: `${FRESHNESS_COLORS[item.status]}10`,
                }}
              >
                <div
                  className="size-10 rounded-full"
                  style={{ backgroundColor: FRESHNESS_COLORS[item.status] }}
                />
                <div>
                  <p className="text-lg font-bold">{item.count}</p>
                  <p className="text-muted-foreground text-sm">
                    {FRESHNESS_LABELS[item.status]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
