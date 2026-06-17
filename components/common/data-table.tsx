"use client";

import { ReactNode, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  Row,
  SortingState,
  VisibilityState,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
  sortingFns,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";

export type ColumnAlign = "left" | "center" | "right";

const alignClasses: Record<ColumnAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;
  align?: ColumnAlign;
  headerClassName?: string;
  cellClassName?: string;
  accessorFn?: (row: T) => string | number | null | undefined;
  enableSorting?: boolean;
  enableHiding?: boolean;
  enableGlobalFilter?: boolean;
  sortingFn?: keyof typeof sortingFns | "auto";
  /** Used for CSV export when cell returns JSX */
  exportValue?: (row: T) => string | number | null | undefined;
}

export interface DataTableFeatures {
  sorting?: boolean;
  globalFilter?: boolean;
  pagination?: boolean;
  columnVisibility?: boolean;
  rowSelection?: boolean;
  export?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string | number;
  title?: string;
  emptyMessage?: string;
  className?: string;
  features?: DataTableFeatures;
  pageSize?: number;
  pageSizeOptions?: number[];
  searchPlaceholder?: string;
  exportFileName?: string;
  "data-testid"?: string;
  /** When set, clicking a row navigates to the returned URL */
  getRowHref?: (row: T) => string | undefined;
}

type ColumnMeta<T> = {
  align?: ColumnAlign;
  headerClassName?: string;
  cellClassName?: string;
  exportValue?: (row: T) => string | number | null | undefined;
};

function escapeCsvValue(value: unknown): string {
  const str = value == null ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function getHeaderLabel<T>(column: ColumnDef<T>, fallback: string) {
  return typeof column.header === "string" ? column.header : fallback;
}

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  title,
  emptyMessage = "No data available",
  className,
  features: featuresProp,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 20, 50],
  searchPlaceholder = "Search...",
  exportFileName = "export.csv",
  "data-testid": dataTestId,
  getRowHref,
}: DataTableProps<T>) {
  const router = useRouter();
  const features = {
    sorting: true,
    globalFilter: true,
    pagination: true,
    columnVisibility: true,
    rowSelection: false,
    export: false,
    ...featuresProp,
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const globalFilterFn: FilterFn<T> = (row, _columnId, filterValue) => {
    const search = String(filterValue).toLowerCase().trim();
    if (!search) return true;

    return columns.some((col) => {
      const canFilter = col.enableGlobalFilter ?? !!col.accessorFn;
      if (!canFilter || !col.accessorFn) return false;
      const value = col.accessorFn(row.original);
      return String(value ?? "")
        .toLowerCase()
        .includes(search);
    });
  };

  const columnDefs = useMemo<ColumnDef<T>[]>(() => {
    const resolveSortingFn = (
      col: DataTableColumn<T>,
    ): ColumnDef<T>["sortingFn"] | undefined => {
      if (!col.accessorFn) return undefined;
      if (!col.sortingFn || col.sortingFn === "auto") {
        return sortingFns.alphanumeric;
      }
      return sortingFns[col.sortingFn as keyof typeof sortingFns];
    };

    const defs: ColumnDef<T>[] = columns.map((col) => {
      const canSort =
        features.sorting && (col.enableSorting ?? !!col.accessorFn);
      const resolvedSortingFn = canSort ? resolveSortingFn(col) : undefined;

      const base: ColumnDef<T> = {
        id: col.id,
        header:
          typeof col.header === "string"
            ? col.header
            : () => col.header,
        enableSorting: canSort,
        enableHiding: features.columnVisibility && (col.enableHiding ?? true),
        enableGlobalFilter:
          features.globalFilter && (col.enableGlobalFilter ?? !!col.accessorFn),
        ...(resolvedSortingFn ? { sortingFn: resolvedSortingFn } : {}),
        meta: {
          align: col.align,
          headerClassName: col.headerClassName,
          cellClassName: col.cellClassName,
          exportValue: col.exportValue,
        } satisfies ColumnMeta<T>,
        cell: ({ row }) => col.cell(row.original, row.index),
      };

      if (col.accessorFn) {
        return {
          ...base,
          accessorFn: col.accessorFn,
        };
      }

      return base;
    });

    if (features.rowSelection) {
      defs.unshift({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        enableGlobalFilter: false,
      });
    }

    return defs;
  }, [columns, features.sorting, features.columnVisibility, features.globalFilter, features.rowSelection]);

  const table = useReactTable({
    data,
    columns: columnDefs,
    getRowId: (row) => String(getRowKey(row)),
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: features.sorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: features.globalFilter ? getFilteredRowModel() : undefined,
    getPaginationRowModel: features.pagination
      ? getPaginationRowModel()
      : undefined,
    globalFilterFn,
    sortingFns,
    enableRowSelection: features.rowSelection,
    initialState: {
      pagination: { pageSize: initialPageSize },
    },
  });

  const exportRows = (rowsToExport: Row<T>[]) => {
    if (rowsToExport.length === 0) return;

    const visibleColumns = table
      .getVisibleLeafColumns()
      .filter((col) => col.id !== "select");

    const headers = visibleColumns.map((col) => {
      const header = col.columnDef.header;
      return typeof header === "string" ? header : col.id;
    });

    const csvRows = rowsToExport.map((row) =>
      visibleColumns
        .map((col) => {
          const colDef = columns.find((c) => c.id === col.id);
          const meta = col.columnDef.meta as ColumnMeta<T> | undefined;
          if (colDef?.exportValue) {
            return escapeCsvValue(colDef.exportValue(row.original));
          }
          if (meta?.exportValue) {
            return escapeCsvValue(meta.exportValue(row.original));
          }
          if (colDef?.accessorFn) {
            return escapeCsvValue(colDef.accessorFn(row.original));
          }
          return "";
        })
        .join(","),
    );

    const csv = [headers.join(","), ...csvRows].join("\n");
    downloadCsv(exportFileName, csv);
  };

  const handleExportAll = () => {
    exportRows(table.getFilteredRowModel().rows);
  };

  const handleExportSelection = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) return;
    exportRows(selectedRows);
  };

  const showToolbar =
    features.globalFilter ||
    features.columnVisibility ||
    features.export;

  const visibleColumns = table.getVisibleLeafColumns();
  const rows = table.getRowModel().rows;
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  const tableContent = (
    <div className="space-y-0">
      {showToolbar && (
        <DataTableToolbar
          table={table}
          searchPlaceholder={searchPlaceholder}
          showSearch={features.globalFilter}
          showColumnToggle={features.columnVisibility}
          showExport={features.export}
          onExportAll={features.export ? handleExportAll : undefined}
          onExportSelection={
            features.export && features.rowSelection
              ? handleExportSelection
              : undefined
          }
          showExportSelection={
            features.export && features.rowSelection && selectedCount > 0
          }
          selectedCount={selectedCount}
        />
      )}

      <div
        data-testid={dataTestId}
        className={cn("hidden overflow-x-auto md:block", className)}
      >
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as
                    | ColumnMeta<T>
                    | undefined;
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "py-3 px-4 align-middle font-medium text-foreground",
                        alignClasses[meta?.align ?? "left"],
                        meta?.headerClassName,
                        canSort && "cursor-pointer select-none",
                      )}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          meta?.align === "center" && "justify-center",
                          meta?.align === "right" && "justify-end",
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {canSort && (
                          <span className="text-muted-foreground">
                            {sorted === "asc" ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : sorted === "desc" ? (
                              <ArrowDown className="h-4 w-4" />
                            ) : (
                              <ArrowUpDown className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="py-8 px-4 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const rowHref = getRowHref?.(row.original);
                return (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className={cn(
                    "border-b border-border hover:bg-accent/50 transition-colors",
                    row.getIsSelected() && "bg-accent/30",
                    rowHref && "cursor-pointer",
                  )}
                  onClick={
                    rowHref
                      ? () => router.push(rowHref)
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | ColumnMeta<T>
                      | undefined;
                    const isInteractiveColumn =
                      cell.column.id === "select" ||
                      cell.column.id === "action" ||
                      cell.column.id === "actions";

                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          "py-3 px-4 align-middle",
                          alignClasses[meta?.align ?? "left"],
                          meta?.cellClassName,
                        )}
                        onClick={
                          isInteractiveColumn
                            ? (e) => e.stopPropagation()
                            : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className={cn("grid gap-3 px-4 pb-4 md:hidden", className)}>
        {rows.length === 0 ? (
          <div className="rounded-lg border border-border p-6 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          rows.map((row) => {
            const rowHref = getRowHref?.(row.original);

            return (
              <div
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                className={cn(
                  "rounded-lg border border-border bg-background p-4 shadow-xs",
                  row.getIsSelected() && "bg-accent/30",
                  rowHref && "cursor-pointer",
                )}
                onClick={rowHref ? () => router.push(rowHref) : undefined}
              >
                <div className="space-y-3">
                  {row.getVisibleCells().map((cell) => {
                    const headerLabel = getHeaderLabel(
                      cell.column.columnDef,
                      cell.column.id,
                    );
                    const isInteractiveColumn =
                      cell.column.id === "select" ||
                      cell.column.id === "action" ||
                      cell.column.id === "actions";

                    return (
                      <div
                        key={cell.id}
                        className="grid grid-cols-[110px_1fr] items-start gap-3 text-sm"
                        onClick={
                          isInteractiveColumn
                            ? (event) => event.stopPropagation()
                            : undefined
                        }
                      >
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {headerLabel}
                        </span>
                        <div className="min-w-0 text-right">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {features.pagination && data.length > 0 && (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );

  if (title) {
    return (
      <Card className="mb-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
          {tableContent}
        </div>
      </Card>
    );
  }

  return tableContent;
}
