"use client";

import { NeoButton } from "@/components/neo";
import { NeoCard, NeoCardContent, NeoCardHeader } from "@/components/neo";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import type { ReactNode } from "react";

export type FilterOption = {
  value: string;
  label: string;
};

export type AdminDataTableProps<T> = {
  data: T[];
  columns: {
    key: string;
    header: string;
    render: (item: T) => ReactNode;
    className?: string;
  }[];
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  // Filter
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: FilterOption[];
  filterPlaceholder?: string;
  // Pagination
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  // States
  isLoading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  // Styling
  className?: string;
};

export function AdminDataTable<T extends { id: string }>({
  data,
  columns,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  filterValue,
  onFilterChange,
  filterOptions,
  filterPlaceholder = "Filtrer",
  page = 1,
  totalPages = 1,
  onPageChange,
  isLoading = false,
  emptyMessage = "Aucun résultat",
  loadingMessage = "Chargement...",
  className,
}: AdminDataTableProps<T>) {
  const hasFilters =
    Boolean(onSearchChange) || Boolean(onFilterChange && filterOptions);
  const hasPagination = totalPages > 1 && onPageChange;

  return (
    <NeoCard className={className}>
      {hasFilters && (
        <NeoCardHeader className="flex flex-row items-center gap-4">
          {onSearchChange && (
            <InputGroup className="flex-1">
              <InputGroupInput
                placeholder={searchPlaceholder}
                value={searchValue ?? ""}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <InputGroupAddon align="inline-start">
                <Search className="text-muted-foreground size-4" />
              </InputGroupAddon>
            </InputGroup>
          )}
          {onFilterChange && filterOptions && (
            <Select value={filterValue} onValueChange={onFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={filterPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </NeoCardHeader>
      )}
      <NeoCardContent className={cn(!hasFilters && "pt-6")}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  {loadingMessage}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {hasPagination && (
          <div className="mt-4 flex justify-center gap-2">
            <NeoButton
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
            >
              Précédent
            </NeoButton>
            <span className="text-muted-foreground flex items-center text-sm">
              Page {page} / {totalPages}
            </span>
            <NeoButton
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Suivant
            </NeoButton>
          </div>
        )}
      </NeoCardContent>
    </NeoCard>
  );
}
