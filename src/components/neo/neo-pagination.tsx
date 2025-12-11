"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

// Pagination Root
export type NeoPaginationProps = React.ComponentProps<"nav"> & {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
};

const NeoPagination = ({
  className,
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  ...props
}: NeoPaginationProps) => {
  // Generate page numbers to display
  const generatePages = () => {
    const pages: (number | "ellipsis")[] = [];

    // Always show first page
    if (showFirstLast) {
      pages.push(1);
    }

    // Calculate range around current page
    const leftSibling = Math.max(
      currentPage - siblingCount,
      showFirstLast ? 2 : 1,
    );
    const rightSibling = Math.min(
      currentPage + siblingCount,
      showFirstLast ? totalPages - 1 : totalPages,
    );

    // Add left ellipsis
    if (leftSibling > (showFirstLast ? 2 : 1)) {
      pages.push("ellipsis");
    }

    // Add pages around current
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Add right ellipsis
    if (rightSibling < (showFirstLast ? totalPages - 1 : totalPages)) {
      pages.push("ellipsis");
    }

    // Always show last page
    if (showFirstLast && totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <nav
      data-slot="neo-pagination"
      className={cn("flex items-center justify-center gap-1", className)}
      {...props}
    >
      {/* Previous button */}
      <NeoPaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </NeoPaginationButton>

      {/* Page numbers */}
      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <NeoPaginationEllipsis key={`ellipsis-${index}`} />
        ) : (
          <NeoPaginationButton
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </NeoPaginationButton>
        ),
      )}

      {/* Next button */}
      <NeoPaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </NeoPaginationButton>
    </nav>
  );
};

// Pagination Button
type NeoPaginationButtonProps = React.ComponentProps<"button"> & {
  active?: boolean;
};

const NeoPaginationButton = React.forwardRef<
  HTMLButtonElement,
  NeoPaginationButtonProps
>(({ className, active = false, disabled, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    disabled={disabled}
    className={cn(
      "flex size-9 items-center justify-center",
      "rounded-[var(--radius-neo-lg)]",
      "text-sm font-medium",
      "transition-all duration-200",
      "outline-none",
      active
        ? [
            "bg-neo-accent text-neo-accent-foreground",
            "border-neo-border/30 border-[length:var(--border-neo)]",
            "shadow-[var(--shadow-neo-sm)]",
          ]
        : [
            "bg-neo-card text-neo-text-muted",
            "border-neo-border/20 border-[length:var(--border-neo)]",
            "hover:bg-neo-bg hover:text-neo-text",
            "hover:shadow-[var(--shadow-neo-sm)]",
            "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
          ],
      disabled && "pointer-events-none cursor-not-allowed opacity-50",
      className,
    )}
    {...props}
  >
    {children}
  </button>
));
NeoPaginationButton.displayName = "NeoPaginationButton";

// Pagination Ellipsis
const NeoPaginationEllipsis = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "text-neo-text-muted flex size-9 items-center justify-center",
      className,
    )}
  >
    <MoreHorizontal className="size-4" />
  </span>
);

// Simple pagination info text
type NeoPaginationInfoProps = {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
};

const NeoPaginationInfo = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  className,
}: NeoPaginationInfoProps) => {
  const start = totalItems
    ? (currentPage - 1) * (itemsPerPage ?? 10) + 1
    : null;
  const end = totalItems
    ? Math.min(currentPage * (itemsPerPage ?? 10), totalItems)
    : null;

  return (
    <p className={cn("text-neo-text-muted text-sm", className)}>
      {totalItems ? (
        <>
          Showing <span className="text-neo-text font-medium">{start}</span> to{" "}
          <span className="text-neo-text font-medium">{end}</span> of{" "}
          <span className="text-neo-text font-medium">{totalItems}</span>{" "}
          results
        </>
      ) : (
        <>
          Page <span className="text-neo-text font-medium">{currentPage}</span>{" "}
          of <span className="text-neo-text font-medium">{totalPages}</span>
        </>
      )}
    </p>
  );
};

export {
  NeoPagination,
  NeoPaginationButton,
  NeoPaginationEllipsis,
  NeoPaginationInfo,
};
