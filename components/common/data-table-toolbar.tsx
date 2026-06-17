"use client";

import { Table } from "@tanstack/react-table";
import { Search, SlidersHorizontal, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showColumnToggle?: boolean;
  showExport?: boolean;
  showExportSelection?: boolean;
  onExportAll?: () => void;
  onExportSelection?: () => void;
  selectedCount?: number;
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search...",
  showSearch = true,
  showColumnToggle = true,
  showExport = false,
  showExportSelection = false,
  onExportAll,
  onExportSelection,
  selectedCount = 0,
}: DataTableToolbarProps<TData>) {
  const hideableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide());

  return (
    <div className="flex min-w-0 flex-col gap-3 px-4 pt-4 pb-3 sm:flex-row sm:items-center sm:justify-between">
      {showSearch && (
        <div className="relative w-full min-w-0 flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      )}
      <div className="flex min-w-0 flex-wrap items-center gap-2 sm:ml-auto sm:justify-end">
        {showExportSelection && onExportSelection && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExportSelection}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export selection ({selectedCount})
          </Button>
        )}
        {showExport && onExportAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExportAll}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        )}
        {showColumnToggle && hideableColumns.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {hideableColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {typeof column.columnDef.header === "string"
                    ? column.columnDef.header
                    : column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
