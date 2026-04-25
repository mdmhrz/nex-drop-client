"use client";

import { Plus, SearchIcon } from "lucide-react";
import type { Table, RowData } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColumnFilter } from "./column-filter";
import type { DataTableProps } from "./types";

interface DataTableToolbarProps<TData extends RowData> {
    table: Table<TData>;
    search?: DataTableProps<TData>["search"];
    onCreate?: DataTableProps<TData>["onCreate"];
    createButtonLabel?: DataTableProps<TData>["createButtonLabel"];
}

export function DataTableToolbar<TData extends RowData>({
    table,
    search,
    onCreate,
    createButtonLabel,
}: DataTableToolbarProps<TData>) {
    // Collect all filterable columns (those with a filterVariant in meta)
    const filterableColumns = table
        .getAllColumns()
        .filter((col) => col.getCanFilter() && col.columnDef.meta?.filterVariant);

    const hasToolbar = search || filterableColumns.length > 0 || onCreate;
    if (!hasToolbar) return null;

    return (
        <div className="flex flex-wrap items-end justify-between gap-3 pb-3">
            {/* Global search */}
            {search && (
                <div className="relative w-full max-w-xs">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                    <Input
                        value={search.value}
                        onChange={(e) => search.onChange(e.target.value)}
                        placeholder={search.placeholder ?? "Search…"}
                        className="h-9 pl-9"
                    />
                </div>
            )}

            {/* Per-column filters */}
            {filterableColumns.length > 0 && (
                <div className="flex flex-wrap items-end gap-3">
                    {filterableColumns.map((col) => (
                        <div key={col.id} className="w-40">
                            <ColumnFilter column={col} />
                        </div>
                    ))}
                </div>
            )}

            {/* Create button */}
            {onCreate && (
                <Button size="sm" className="ml-auto h-9 shrink-0 gap-2" onClick={onCreate}>
                    <Plus className="size-4" />
                    {createButtonLabel ?? "Create"}
                </Button>
            )}
        </div>
    );
}
