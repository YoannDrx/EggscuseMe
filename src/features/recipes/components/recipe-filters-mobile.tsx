"use client";

import { NeoBadge } from "@/components/neo";
import { NeoButton } from "@/components/neo";
import { NeoInput } from "@/components/neo";
import { ResponsiveModal } from "@/components/eggscuseme/modals/responsive-modal";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  ChefHat,
  Clock,
  Egg,
  Filter,
  Flame,
  Leaf,
  RotateCcw,
  Search,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";
import { getAllTags } from "../get-suggestions";
import {
  type DifficultyOption,
  difficultyOptions,
  type EggRange,
  eggRanges,
  type FreshnessOption,
  freshnessOptions,
  recipeSearchParams,
  type TimeRange,
  timeRanges,
} from "../lib/recipe-search-params";

type FilterSectionProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

function FilterSection({ title, icon, children }: FilterSectionProps) {
  return (
    <div className="space-y-2">
      <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
        {icon}
        <span>{title}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

type FilterBadgeProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

function FilterBadge({
  active,
  onClick,
  children,
  className,
}: FilterBadgeProps) {
  return (
    <button type="button" onClick={onClick}>
      <NeoBadge
        variant={active ? "default" : "outline"}
        className={cn(
          "cursor-pointer transition-all hover:scale-105",
          active && "ring-primary/20 ring-2",
          className,
        )}
      >
        {children}
      </NeoBadge>
    </button>
  );
}

/**
 * Recipe filters with responsive modal for mobile
 * - Mobile: Filter button opens bottom sheet
 * - Desktop: Inline filters
 */
export function RecipeFiltersWithModal() {
  const isMobile = useIsMobile();
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const t = useTranslations("recipes.filters");
  const tDifficulty = useTranslations("recipes.difficulty");

  const [filters, setFilters] = useQueryStates(
    {
      ...recipeSearchParams,
      tags: parseAsArrayOf(parseAsString).withDefault([]),
    },
    {
      shallow: false,
      throttleMs: 300,
    },
  );

  const allTags = getAllTags();
  const hasActiveFilters =
    filters.tags.length > 0 ||
    filters.time !== "all" ||
    filters.eggs !== "all" ||
    filters.difficulty !== "all" ||
    filters.freshness !== "all" ||
    filters.search !== "";

  const activeFilterCount = [
    filters.tags.length > 0,
    filters.time !== "all",
    filters.eggs !== "all",
    filters.difficulty !== "all",
    filters.freshness !== "all",
  ].filter(Boolean).length;

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    void setFilters({ tags: newTags });
  };

  const clearFilters = () => {
    void setFilters({
      tags: [],
      time: "all",
      eggs: "all",
      difficulty: "all",
      freshness: "all",
      search: "",
    });
  };

  const timeLabels: Record<TimeRange, string> = {
    all: t("time.all"),
    quick: t("time.quick"),
    medium: t("time.medium"),
    long: t("time.long"),
  };

  const eggLabels: Record<EggRange, string> = {
    all: t("eggs.all"),
    "1-2": "1-2",
    "3-4": "3-4",
    "5+": "5+",
  };

  const difficultyLabels: Record<DifficultyOption, string> = {
    all: t("difficulty.all"),
    easy: tDifficulty("easy"),
    medium: tDifficulty("medium"),
    hard: tDifficulty("hard"),
  };

  const difficultyIcons: Record<DifficultyOption, React.ReactNode> = {
    all: null,
    easy: <Sparkles className="size-3" />,
    medium: <ChefHat className="size-3" />,
    hard: <Flame className="size-3" />,
  };

  const freshnessLabels: Record<FreshnessOption, string> = {
    all: t("freshness.all"),
    "extra-fresh": t("freshness.extraFresh"),
    fresh: t("freshness.fresh"),
    "cook-thoroughly": t("freshness.cookThoroughly"),
  };

  const freshnessColors: Record<FreshnessOption, string> = {
    all: "",
    "extra-fresh": "bg-fresh-extra/10 text-fresh-extra border-fresh-extra/20",
    fresh: "bg-fresh/10 text-fresh border-fresh/20",
    "cook-thoroughly": "bg-fresh-cook/10 text-fresh-cook border-fresh-cook/20",
  };

  // Filter content (shared between mobile modal and desktop inline)
  const filterContent = (
    <div className="space-y-4">
      {/* Filter sections */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Time filter */}
        <FilterSection
          title={t("time.label")}
          icon={<Clock className="size-3" />}
        >
          {timeRanges.map((range) => (
            <FilterBadge
              key={range}
              active={filters.time === range}
              onClick={() => void setFilters({ time: range })}
            >
              {timeLabels[range]}
            </FilterBadge>
          ))}
        </FilterSection>

        {/* Eggs filter */}
        <FilterSection
          title={t("eggs.label")}
          icon={<Egg className="size-3" />}
        >
          {eggRanges.map((range) => (
            <FilterBadge
              key={range}
              active={filters.eggs === range}
              onClick={() => void setFilters({ eggs: range })}
            >
              {eggLabels[range]}
            </FilterBadge>
          ))}
        </FilterSection>

        {/* Difficulty filter */}
        <FilterSection
          title={t("difficulty.label")}
          icon={<ChefHat className="size-3" />}
        >
          {difficultyOptions.map((diff) => (
            <FilterBadge
              key={diff}
              active={filters.difficulty === diff}
              onClick={() => void setFilters({ difficulty: diff })}
            >
              {difficultyIcons[diff]}
              {difficultyLabels[diff]}
            </FilterBadge>
          ))}
        </FilterSection>

        {/* Freshness filter */}
        <FilterSection
          title={t("freshness.label")}
          icon={<Leaf className="size-3" />}
        >
          {freshnessOptions.map((fresh) => (
            <FilterBadge
              key={fresh}
              active={filters.freshness === fresh}
              onClick={() => void setFilters({ freshness: fresh })}
              className={
                filters.freshness === fresh ? freshnessColors[fresh] : ""
              }
            >
              {freshnessLabels[fresh]}
            </FilterBadge>
          ))}
        </FilterSection>
      </div>

      {/* Tags filter */}
      <FilterSection title={t("tags.label")} icon={<Tag className="size-3" />}>
        {allTags.slice(0, 15).map((tag) => (
          <FilterBadge
            key={tag}
            active={filters.tags.includes(tag)}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </FilterBadge>
        ))}
      </FilterSection>

      {/* Clear filters button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <NeoButton
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground gap-1.5"
          >
            <RotateCcw className="size-3" />
            {t("clearAll")}
          </NeoButton>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search bar - Always visible */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <NeoInput
            placeholder={t("searchPlaceholder")}
            value={filters.search}
            onChange={(e) => void setFilters({ search: e.target.value })}
            className="pr-10 pl-10"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => void setFilters({ search: "" })}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Mobile filter button */}
        {isMobile && (
          <NeoButton
            variant="outline"
            size="icon"
            className="relative shrink-0"
            onClick={() => setFilterModalOpen(true)}
          >
            <Filter className="size-4" />
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
                {activeFilterCount}
              </span>
            )}
          </NeoButton>
        )}
      </div>

      {/* Desktop: Inline filters */}
      {!isMobile && filterContent}

      {/* Mobile: Filter modal */}
      <ResponsiveModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        title="Filtres"
        description="Affiner votre recherche de recettes"
        footer={
          <div className="flex w-full gap-2">
            <NeoButton
              variant="outline"
              className="flex-1"
              onClick={() => {
                clearFilters();
                setFilterModalOpen(false);
              }}
            >
              Reinitialiser
            </NeoButton>
            <NeoButton
              className="flex-1"
              onClick={() => setFilterModalOpen(false)}
            >
              Appliquer
            </NeoButton>
          </div>
        }
      >
        {filterContent}
      </ResponsiveModal>
    </div>
  );
}
