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
import { Eggy } from "@/features/mascot";
import { getConsumptionHistoryAction } from "@/features/statistics/statistics.action";
import {
  ChevronLeft,
  ChevronRight,
  History,
  Loader2,
  Star,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

const COOKING_TYPE_LABELS: Record<string, string> = {
  SOFT_BOILED: "A la coque",
  POACHED: "Poche",
  RAW: "Cru",
  FRIED: "Au plat",
  SCRAMBLED: "Brouilles",
  OMELETTE: "Omelette",
  HARD_BOILED: "Dur",
  BAKING: "Patisserie",
  OTHER: "Autre",
};

const COOKING_TYPES = Object.keys(COOKING_TYPE_LABELS);

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const [cookingTypeFilter, setCookingTypeFilter] = useState<string>("");

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Eggy mood="happy" size="lg" />
        <div>
          <h1 className="font-heading text-2xl font-bold">Historique</h1>
          <p className="text-muted-foreground">
            Retrouvez toutes vos consommations passees
          </p>
        </div>
      </div>

      {/* Filters */}
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
                value={cookingTypeFilter}
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
                  {total} resultat{total > 1 ? "s" : ""}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card variant="sunny">
        <CardContent className="p-0">
          {isPending ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="text-primary size-8 animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <Eggy mood="sad" size="lg" />
              <p className="text-muted-foreground">
                Aucune consommation trouvee
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Boite</TableHead>
                      <TableHead>Quantite</TableHead>
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
                            {item.quantity} oeuf{item.quantity > 1 ? "s" : ""}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t p-4">
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
                      Precedent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page >= totalPages}
                    >
                      Suivant
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
