"use client";

import {
  ChartCarousel,
  ChartItem,
} from "@/components/eggscuseme/charts/chart-carousel";
import {
  StatsCard,
  StatsCardCarousel,
} from "@/components/eggscuseme/cards/stats-card";
import {
  IconChartSticker,
  IconEggSticker,
  SavingsSummary,
} from "@/components/eggscuseme/illustrations";
import { MobileHeader } from "@/components/eggscuseme/navigation/mobile-header";
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
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Download,
  Egg,
  Euro,
  Leaf,
  Loader2,
  Package,
  TrendingUp,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useLocale, useTranslations } from "next-intl";
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

const COOKING_TYPE_OPTIONS = {
  SOFT_BOILED: "softBoiled",
  POACHED: "poached",
  RAW: "raw",
  FRIED: "fried",
  SCRAMBLED: "scrambled",
  OMELETTE: "omelette",
  HARD_BOILED: "hardBoiled",
  BAKING: "baking",
  OTHER: "other",
} as const;

export default function StatisticsPage() {
  const locale = useLocale();
  const t = useTranslations("fridge.statistics");
  const tCooking = useTranslations("cooking");
  const tFreshness = useTranslations("freshness");
  const cookingChartConfig: ChartConfig = {
    count: {
      label: t("chart.count"),
      color: "hsl(var(--primary))",
    },
  };

  const consumptionChartConfig: ChartConfig = {
    count: {
      label: t("chart.consumption"),
      color: "hsl(var(--primary))",
    },
  };
  const isMobile = useIsMobile();
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

  // Loading state
  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col">
        <MobileHeader title={t("title")} />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="text-primary size-8 animate-spin" />
            <p className="text-muted-foreground">{t("loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!stats) {
    return (
      <div className="flex min-h-screen flex-col">
        <MobileHeader
          title={t("title")}
          subtitle={t("noData")}
          mascot
          mascotMood="sad"
        />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-[var(--space-page-x)] py-12">
          <Eggy mood="sad" size="lg" className="md:hidden" />
          <p className="text-muted-foreground text-center">{t("noData")}</p>
        </div>

        {/* Desktop empty state */}
        <div className="hidden space-y-6 md:block">
          <div className="flex items-center gap-4">
            <Eggy mood="sad" size="lg" />
            <div>
              <h1 className="font-heading text-2xl font-bold">{t("title")}</h1>
              <p className="text-muted-foreground">{t("noData")}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const freshnessLabels: Record<string, string> = {
    "extra-fresh": tFreshness("extraFresh"),
    fresh: tFreshness("fresh"),
    "cook-thoroughly": tFreshness("cookThoroughly"),
    expired: tFreshness("expired"),
  };

  const cookingTypes = stats.cookingTypes.map((item) => {
    const typeKey = item.type as keyof typeof COOKING_TYPE_OPTIONS;
    const cookingOption =
      typeKey in COOKING_TYPE_OPTIONS
        ? COOKING_TYPE_OPTIONS[typeKey]
        : COOKING_TYPE_OPTIONS.OTHER;
    return {
      ...item,
      type: tCooking(cookingOption),
    };
  });

  // Export button for header
  const exportButton = (
    <Button
      variant="ghost"
      size="icon"
      className="size-10 rounded-full"
      onClick={() => exportCSV()}
      disabled={isExporting}
    >
      {isExporting ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Download className="size-4" />
      )}
    </Button>
  );

  // Chart components
  const DailyConsumptionChart = () => (
    <>
      {stats.dailyConsumption.length > 0 ? (
        <ChartContainer
          config={consumptionChartConfig}
          className="h-[250px] w-full md:h-[300px]"
        >
          <AreaChart data={stats.dailyConsumption}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return new Intl.DateTimeFormat(locale, {
                  day: "numeric",
                  month: "short",
                }).format(date);
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
                    return date.toLocaleDateString(locale, {
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
        <div className="flex h-[250px] items-center justify-center md:h-[300px]">
          <p className="text-muted-foreground">{t("chart.noData")}</p>
        </div>
      )}
    </>
  );

  const CookingTypesChart = () => (
    <>
      {cookingTypes.length > 0 ? (
        <ChartContainer
          config={cookingChartConfig}
          className="h-[250px] w-full md:h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={(props) => <ChartTooltipContent {...props} />}
            />
            <Pie
              data={cookingTypes}
              dataKey="count"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 80 : 100}
              label={
                isMobile
                  ? false
                  : ({ name, percent }) =>
                      `${name} (${((percent as number) * 100).toFixed(0)}%)`
              }
              labelLine={false}
            >
              {cookingTypes.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(var(--primary) / ${1 - index * 0.15})`}
                />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="type" />} />
          </PieChart>
        </ChartContainer>
      ) : (
        <div className="flex h-[250px] items-center justify-center md:h-[300px]">
          <p className="text-muted-foreground">{t("chart.noData")}</p>
        </div>
      )}
    </>
  );

  const MonthlyConsumptionChart = () => (
    <>
      {stats.monthlyConsumption.length > 0 ? (
        <ChartContainer
          config={consumptionChartConfig}
          className="h-[250px] w-full md:h-[300px]"
        >
          <BarChart data={stats.monthlyConsumption}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickFormatter={(value: string) => {
                const [year, month] = value.split("-");
                const date = new Date(parseInt(year), parseInt(month) - 1);
                return new Intl.DateTimeFormat(locale, {
                  month: "short",
                  year: "2-digit",
                }).format(date);
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
        <div className="flex h-[250px] items-center justify-center md:h-[300px]">
          <p className="text-muted-foreground">{t("chart.noData")}</p>
        </div>
      )}
    </>
  );

  const FreshnessDistribution = () => (
    <>
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
                    {freshnessLabels[item.status]}
                  </span>
                </div>
                <Badge variant="secondary">
                  {item.count} {t("eggs")}
                </Badge>
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
          <p className="text-muted-foreground">{t("noEggsInStock")}</p>
        </div>
      )}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <MobileHeader
        title={t("title")}
        subtitle={t("last90days")}
        rightAction={exportButton}
      />

      {/* Desktop Header */}
      <div className="hidden space-y-6 md:block">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Eggy mood="happy" size="lg" />
            <div>
              <h1 className="font-heading text-2xl font-bold">{t("title")}</h1>
              <p className="text-muted-foreground">{t("subtitle")}</p>
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
            {t("exportCSV")}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-[var(--space-page-x)] py-[var(--space-page-y)] md:px-0">
        <div className="space-y-[var(--space-section)]">
          {/* KPI Cards */}
          {isMobile ? (
            <StatsCardCarousel>
              <StatsCard
                icon={<Egg className="text-primary size-5" />}
                iconBg="bg-primary/10"
                value={stats.totalEggs}
                label={t("currentStock")}
                trendLabel={t("activeBoxes", { count: stats.activeBoxes })}
              />
              <StatsCard
                icon={<TrendingUp className="text-fresh-extra size-5" />}
                iconBg="bg-fresh-extra/20"
                value={stats.totalConsumed}
                label={t("consumed")}
                trendLabel={t("last90days")}
              />
              <StatsCard
                icon={<Euro className="text-fresh size-5" />}
                iconBg="bg-fresh/20"
                value={`${stats.moneySaved.toFixed(0)}EUR`}
                label={t("savings")}
                trendLabel={t("antiWasteEstimate")}
              />
              <StatsCard
                icon={<Leaf className="text-fresh-extra size-5" />}
                iconBg="bg-fresh-extra/20"
                value={`${stats.avgFreshnessScore}${locale === "fr" ? "j" : "d"}`}
                label={t("avgFreshness")}
                trendLabel={t("beforeExpiry")}
              />
            </StatsCardCarousel>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card variant="sunny">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("currentStock")}
                  </CardTitle>
                  <Egg className="text-primary size-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalEggs}</div>
                  <p className="text-muted-foreground text-xs">
                    {t("activeBoxes", { count: stats.activeBoxes })}
                  </p>
                </CardContent>
              </Card>

              <Card variant="sunny">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("consumed")}
                  </CardTitle>
                  <TrendingUp className="text-fresh-extra size-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalConsumed}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {t("last90days")}
                  </p>
                </CardContent>
              </Card>

              <Card variant="sunny">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("savings")}
                  </CardTitle>
                  <Euro className="text-fresh size-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.moneySaved.toFixed(2)} EUR
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {t("antiWasteEstimate")}
                  </p>
                </CardContent>
              </Card>

              <Card variant="sunny">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("avgFreshness")}
                  </CardTitle>
                  <Leaf className="text-fresh-extra size-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.avgFreshnessScore}{" "}
                    {locale === "fr" ? "jours" : "days"}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {t("beforeExpiry")}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Charts */}
          {isMobile ? (
            <ChartCarousel showDots>
              <ChartItem title={t("dailyConsumption")}>
                <DailyConsumptionChart />
              </ChartItem>
              <ChartItem title={t("cookingTypes")}>
                <CookingTypesChart />
              </ChartItem>
              <ChartItem title={t("monthlyConsumption")}>
                <MonthlyConsumptionChart />
              </ChartItem>
              <ChartItem title={t("currentFreshness")}>
                <FreshnessDistribution />
              </ChartItem>
            </ChartCarousel>
          ) : (
            <>
              {/* Desktop Charts Row 1 */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card variant="sunny">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <IconChartSticker className="size-6" />
                      <CardTitle>{t("dailyConsumption")}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <DailyConsumptionChart />
                  </CardContent>
                </Card>

                <Card variant="sunny">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Package className="text-primary size-5" />
                      <CardTitle>{t("cookingTypes")}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CookingTypesChart />
                  </CardContent>
                </Card>
              </div>

              {/* Desktop Charts Row 2 */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card variant="sunny">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="text-primary size-5" />
                      <CardTitle>{t("monthlyConsumption")}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <MonthlyConsumptionChart />
                  </CardContent>
                </Card>

                <Card variant="sunny">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Leaf className="text-primary size-5" />
                      <CardTitle>{t("currentFreshness")}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <FreshnessDistribution />
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Savings Summary */}
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-500/5 p-6">
            <p className="text-muted-foreground text-sm font-medium">
              {t("antiWasteEstimate")}
            </p>
            <SavingsSummary
              money={stats.moneySaved}
              eggs={stats.totalConsumed}
              size="lg"
            />
          </div>

          {/* Freshness at consumption - Full width on both */}
          <Card variant="sunny">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <IconEggSticker className="size-6" />
                <CardTitle className="text-base md:text-lg">
                  {t("freshnessAtConsumption")}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {t("badge90days")}
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs md:text-sm">
                {t("freshnessAtConsumptionDescription")}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {stats.freshnessAtConsumption.map((item) => (
                  <div
                    key={item.status}
                    className="flex items-center gap-2 rounded-lg border p-3 md:gap-3 md:p-4"
                    style={{
                      borderColor: FRESHNESS_COLORS[item.status],
                      backgroundColor: `${FRESHNESS_COLORS[item.status]}10`,
                    }}
                  >
                    <div
                      className="size-8 shrink-0 rounded-full md:size-10"
                      style={{ backgroundColor: FRESHNESS_COLORS[item.status] }}
                    />
                    <div className="min-w-0">
                      <p className="text-base font-bold md:text-lg">
                        {item.count}
                      </p>
                      <p className="text-muted-foreground truncate text-xs md:text-sm">
                        {freshnessLabels[item.status]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
