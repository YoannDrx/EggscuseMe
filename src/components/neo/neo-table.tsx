"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoTableVariants = cva(
  [
    "w-full",
    "border-collapse",
    "rounded-[var(--radius-neo-xl)]",
    "overflow-hidden",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "border-[length:var(--border-neo)] border-neo-border/30",
        outline: "border-[length:var(--border-neo)] border-neo-border/50",
        ghost: "border-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Table Root
export type NeoTableProps = React.ComponentProps<"table"> &
  VariantProps<typeof neoTableVariants>;

const NeoTable = React.forwardRef<HTMLTableElement, NeoTableProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      className={cn(
        "relative w-full overflow-auto",
        "rounded-[var(--radius-neo-xl)]",
        "border-neo-border/30 border-[length:var(--border-neo)]",
        "shadow-[var(--shadow-neo-md)]",
        "bg-neo-card",
      )}
    >
      <table
        ref={ref}
        data-slot="neo-table"
        className={cn(neoTableVariants({ variant, className }))}
        {...props}
      />
    </div>
  ),
);
NeoTable.displayName = "NeoTable";

// Table Header
const NeoTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"thead">
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    data-slot="neo-table-header"
    className={cn("bg-neo-bg/50", "[&_tr]:border-b-0", className)}
    {...props}
  />
));
NeoTableHeader.displayName = "NeoTableHeader";

// Table Body
const NeoTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"tbody">
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    data-slot="neo-table-body"
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
NeoTableBody.displayName = "NeoTableBody";

// Table Footer
const NeoTableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"tfoot">
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    data-slot="neo-table-footer"
    className={cn(
      "bg-neo-bg/30 border-neo-border/20 border-t-[length:var(--border-neo)] font-medium",
      className,
    )}
    {...props}
  />
));
NeoTableFooter.displayName = "NeoTableFooter";

// Table Row
const NeoTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.ComponentProps<"tr"> & { interactive?: boolean }
>(({ className, interactive = false, ...props }, ref) => (
  <tr
    ref={ref}
    data-slot="neo-table-row"
    className={cn(
      "border-neo-border/10 border-b-[length:var(--border-neo)]",
      "transition-colors duration-150",
      interactive && [
        "cursor-pointer",
        "hover:bg-neo-accent/5",
        "active:bg-neo-accent/10",
      ],
      className,
    )}
    {...props}
  />
));
NeoTableRow.displayName = "NeoTableRow";

// Table Head Cell
const NeoTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<"th">
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    data-slot="neo-table-head"
    className={cn(
      "h-12 px-4",
      "text-left align-middle",
      "text-neo-text text-sm font-bold",
      "border-neo-border/20 border-b-[length:var(--border-neo)]",
      "[&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
NeoTableHead.displayName = "NeoTableHead";

// Table Cell
const NeoTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<"td">
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    data-slot="neo-table-cell"
    className={cn(
      "px-4 py-3",
      "align-middle",
      "text-neo-text text-sm",
      "[&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
NeoTableCell.displayName = "NeoTableCell";

// Table Caption
const NeoTableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.ComponentProps<"caption">
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    data-slot="neo-table-caption"
    className={cn("text-neo-text-muted mt-4 text-sm", className)}
    {...props}
  />
));
NeoTableCaption.displayName = "NeoTableCaption";

export {
  NeoTable,
  NeoTableHeader,
  NeoTableBody,
  NeoTableFooter,
  NeoTableRow,
  NeoTableHead,
  NeoTableCell,
  NeoTableCaption,
};
