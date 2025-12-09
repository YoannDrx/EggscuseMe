"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useEffect, useState } from "react";

const COOKING_TYPE_LABELS: Record<string, string> = {
  SOFT_BOILED: "A la coque",
  POACHED: "Poché",
  RAW: "Cru",
  FRIED: "Au plat",
  SCRAMBLED: "Brouillés",
  OMELETTE: "Omelette",
  HARD_BOILED: "Dur",
  BAKING: "Pâtisserie",
  OTHER: "Autre",
};

const COOKING_TYPES = Object.keys(COOKING_TYPE_LABELS);

export default function HistoryPage() {
  const isMobile = useIsMobile();
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
        <label className="text-muted-foreground mb-2 block text-sm font-medium">
          Type de cuisson
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
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {COOKING_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {COOKING_TYPE_LABELS[type]}
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
        title="Historique"
        subtitle={
          total > 0 ? `${total} consommation${total > 1 ? "s" : ""}` : undefined
        }
        rightAction={
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-full"
            onClick={() => setFilterModalOpen(true)}
          >
            <Filter className="size-4" />
            {cookingTypeFilter && (
              <span className="bg-primary absolute -top-1 -right-1 size-2 rounded-full" />
            )}
          </Button>
        }
      />

      {/* Desktop Header */}
      <div className="hidden space-y-6 md:block">
        <div className="flex items-center gap-4">
          <Eggy mood="happy" size="lg" />
          <div>
            <h1 className="font-heading text-2xl font-bold">Historique</h1>
            <p className="text-muted-foreground">
              Retrouvez toutes vos consommations passées
            </p>
          </div>
        </div>

        {/* Desktop Filters */}
        <Card variant="sunny">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="size-4" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="min-w-[200px]">
                <label className="text-muted-foreground mb-2 block text-sm">
                  Type de cuisson
                </label>
                <Select
                  value={cookingTypeFilter || "all"}
                  onValueChange={(value) => {
                    setCookingTypeFilter(value === "all" ? "" : value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {COOKING_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {COOKING_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {total > 0 && (
                <div className="flex items-end">
                  <Badge variant="secondary">
                    {total} résultat{total > 1 ? "s" : ""}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <main className="flex-1 px-[var(--space-page-x)] py-[var(--space-page-y)] md:px-0">
        {isPending ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="text-primary size-8 animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <HistoryEmpty />
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
              <Card variant="sunny">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Boîte</TableHead>
                          <TableHead>Quantité</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Note</TableHead>
                          <TableHead>Commentaire</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="whitespace-nowrap">
                              {new Date(item.date).toLocaleDateString("fr-FR", {
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
                                {item.quantity} oeuf
                                {item.quantity > 1 ? "s" : ""}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {COOKING_TYPE_LABELS[item.cookingType] ??
                                item.cookingType}
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
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {item.notes ?? (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                  Page {page} sur {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="size-4" />
                    <span className="hidden sm:inline">Précédent</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    <span className="hidden sm:inline">Suivant</span>
                    <ChevronRight className="size-4" />
                  </Button>
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
        title="Filtres"
        description="Filtrer l'historique par type de cuisson"
      >
        {filterContent}
      </ResponsiveModal>
    </div>
  );
}
