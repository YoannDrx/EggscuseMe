"use client";

import { Badge } from "@/components/ui/badge";
import { NeoButton } from "@/components/neo/neo-button";
import {
  NeoCard,
  NeoCardContent,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo/neo-card";
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
import { MobileHeader } from "@/components/eggscuseme/navigation/mobile-header";
import { ResponsiveModal } from "@/components/eggscuseme/modals/responsive-modal";
import {
  HistoryCard,
  HistoryEmpty,
  type HistoryItem,
} from "@/features/statistics/components/history-card";
import { Eggy } from "@/features/mascot";
import { getConsumptionHistoryAction } from "@/features/statistics/statistics.action";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  History,
  Loader2,
  Star,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

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

const COOKING_TYPES: (keyof typeof COOKING_TYPE_OPTIONS)[] = [
  "SOFT_BOILED",
  "POACHED",
  "RAW",
  "FRIED",
  "SCRAMBLED",
  "OMELETTE",
  "HARD_BOILED",
  "BAKING",
  "OTHER",
];

export default function HistoryPage() {
  const isMobile = useIsMobile();
  const locale = useLocale();
  const t = useTranslations("fridge.history");
  const tCooking = useTranslations("cooking");
  const [page, setPage] = useState(1);
  const [cookingTypeFilter, setCookingTypeFilter] = useState<string>("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const {
    execute: loadHistory,
    result,
    isPending,
  } = useAction(getConsumptionHistoryAction);

  useEffect(() => {
    loadHistory({
      page,
      limit: 20,
      cookingType: cookingTypeFilter || undefined,
    });
  }, [loadHistory, page, cookingTypeFilter]);

  const data = result.data;
  const history = data?.history ?? [];
  const totalPages = data?.pages ?? 0;
  const total = data?.total ?? 0;

  // Transform data for HistoryCard
  const historyItems: HistoryItem[] = history.map((item) => ({
    id: item.id,
    date: new Date(item.date),
    eggBoxName: item.eggBoxName,
    quantity: item.quantity,
    cookingType: item.cookingType,
    rating: item.rating,
    notes: item.notes,
  }));

  // Filter content for mobile modal
  const filterContent = (
    <div className="space-y-4">
      <div>
        <label className="text-neo-text-muted mb-2 block text-sm font-medium">
          {t("cookingType")}
        </label>
        <Select
          value={cookingTypeFilter || "all"}
          onValueChange={(value) => {
            setCookingTypeFilter(value === "all" ? "" : value);
            setPage(1);
            setFilterModalOpen(false);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("allTypes")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allTypes")}</SelectItem>
            {COOKING_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {tCooking(COOKING_TYPE_OPTIONS[type])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <MobileHeader
        title={t("title")}
        subtitle={
          total > 0 ? t("consumptionCount", { count: total }) : undefined
        }
        rightAction={
          <NeoButton
            variant="ghost"
            size="icon"
            className="size-10 rounded-full"
            onClick={() => setFilterModalOpen(true)}
          >
            <Filter className="size-4" />
            {cookingTypeFilter && (
              <span className="bg-primary absolute -top-1 -right-1 size-2 rounded-full" />
            )}
          </NeoButton>
        }
      />

      {/* Desktop Header */}
      <div className="hidden space-y-6 md:block">
        <div className="flex items-center gap-4">
          <Eggy mood="happy" size="lg" />
          <div>
            <h1 className="font-heading text-2xl font-bold">{t("title")}</h1>
            <p className="text-neo-text-muted">{t("subtitle")}</p>
          </div>
        </div>

        {/* Desktop Filters */}
        <NeoCard variant="elevated" padding="md">
          <NeoCardHeader>
            <NeoCardTitle className="flex items-center gap-2 text-base">
              <History className="size-4" />
              {t("filters")}
            </NeoCardTitle>
          </NeoCardHeader>
          <NeoCardContent>
            <div className="flex flex-wrap gap-4">
              <div className="min-w-[200px]">
                <label className="text-neo-text-muted mb-2 block text-sm">
                  {t("cookingType")}
                </label>
                <Select
                  value={cookingTypeFilter || "all"}
                  onValueChange={(value) => {
                    setCookingTypeFilter(value === "all" ? "" : value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("allTypes")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allTypes")}</SelectItem>
                    {COOKING_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {tCooking(COOKING_TYPE_OPTIONS[type])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {total > 0 && (
                <div className="flex items-end">
                  <Badge variant="secondary">
                    {t("results", { count: total })}
                  </Badge>
                </div>
              )}
            </div>
          </NeoCardContent>
        </NeoCard>
      </div>

      {/* Content */}
      <main className="flex-1 px-[var(--space-page-x)] py-[var(--space-page-y)] md:px-0">
        {isPending ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="text-neo-accent size-8 animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <NeoCard
            variant="elevated"
            padding="lg"
            className="mx-auto w-full max-w-5xl"
          >
            <NeoCardContent>
              <HistoryEmpty />
            </NeoCardContent>
          </NeoCard>
        ) : (
          <>
            {/* Mobile: Card List */}
            {isMobile ? (
              <div className="space-y-3">
                {historyItems.map((item, index) => (
                  <HistoryCard key={item.id} item={item} delay={index * 0.05} />
                ))}
              </div>
            ) : (
              /* Desktop: Table */
              <NeoCard variant="elevated" padding="md">
                <NeoCardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("date")}</TableHead>
                          <TableHead>{t("box")}</TableHead>
                          <TableHead>{t("quantity")}</TableHead>
                          <TableHead>{t("type")}</TableHead>
                          <TableHead>{t("rating")}</TableHead>
                          <TableHead>{t("comment")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="whitespace-nowrap">
                              {new Date(item.date).toLocaleDateString(locale, {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.eggBoxName}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {t("eggCount", { count: item.quantity })}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {tCooking(
                                item.cookingType in COOKING_TYPE_OPTIONS
                                  ? COOKING_TYPE_OPTIONS[
                                      item.cookingType as keyof typeof COOKING_TYPE_OPTIONS
                                    ]
                                  : COOKING_TYPE_OPTIONS.OTHER,
                              )}
                            </TableCell>
                            <TableCell>
                              {item.rating != null ? (
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`size-4 ${
                                        i < (item.rating ?? 0)
                                          ? "fill-primary text-primary"
                                          : "text-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <span className="text-neo-text-muted">-</span>
                              )}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {item.notes ?? (
                                <span className="text-neo-text-muted">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </NeoCardContent>
              </NeoCard>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-neo-text-muted text-sm">
                  {t("page", { current: page, total: totalPages })}
                </p>
                <div className="flex gap-2">
                  <NeoButton
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="size-4" />
                    <span className="hidden sm:inline">{t("previous")}</span>
                  </NeoButton>
                  <NeoButton
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    <span className="hidden sm:inline">{t("next")}</span>
                    <ChevronRight className="size-4" />
                  </NeoButton>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Mobile Filter Modal */}
      <ResponsiveModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        title={t("filterModalTitle")}
        description={t("filterDescription")}
      >
        {filterContent}
      </ResponsiveModal>
    </div>
  );
}
