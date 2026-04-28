"use client";

import { useId, useState } from "react";
import { Eye, Inbox, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

import type { ColumnDef, RowData, SortingState, ColumnFiltersState } from "@tanstack/react-table";
import {
    flexRender,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { DragAlongCell, DraggableTableHeader } from "./draggable-columns";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import type { DataTableProps } from "./types";

// Re-export types for convenience
export type { DataTableProps } from "./types";
export type { DataTableActionHandlers, DataTableSortingProps, DataTablePaginationProps, DataTableSearchProps } from "./types";

declare module "@tanstack/react-table" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: "text" | "select" | "range";
        filterLabel?: string;
    }
}

export function DataTable<TData extends RowData>({
    data,
    columns: userColumns,
    isLoading = false,
    emptyMessage,
    showCheckbox = true,
    actions,
    sorting: sortingProp,
    pagination: paginationProp,
    search,
    onCreate,
    createButtonLabel,
}: DataTableProps<TData>) {
    "use no memo"; // TanStack Table returns functions that React Compiler can't safely memoize
    const dndId = useId();

    // ---------- Internal state used when caller doesn't provide their own ----------
    const [internalSorting, setInternalSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnOrder, setColumnOrder] = useState<string[]>(() => {
        const base: string[] = [];
        if (showCheckbox) base.push("select");
        userColumns.forEach((c) => {
            const id = (c as { id?: string; accessorKey?: string }).id ?? (c as { accessorKey?: string }).accessorKey;
            if (id) base.push(String(id));
        });
        if (actions) base.push("_actions");
        return base;
    });

    // ---------- Inject select checkbox column ----------
    const selectColumn: ColumnDef<TData> = {
        id: "select",
        size: 40,
        enableSorting: false,
        enableResizing: false,
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                aria-label="Select all rows"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(v) => row.toggleSelected(!!v)}
                aria-label="Select row"
            />
        ),
    };

    // ---------- Inject actions column ----------
    const actionsColumn: ColumnDef<TData> = {
        id: "_actions",
        size: 56,
        enableSorting: false,
        enableResizing: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open actions</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 p-2">
                        {actions?.onView && (
                            <>
                                <DropdownMenuItem
                                    className="cursor-pointer gap-2"
                                    onClick={() => actions.onView!(row.original)}
                                >
                                    <Eye className="size-4 text-muted-foreground" />
                                    View
                                </DropdownMenuItem>
                                {(actions.onEdit || actions.onDelete) && (
                                    <DropdownMenuSeparator />
                                )}
                            </>
                        )}
                        {actions?.onEdit && (
                            <>
                                <DropdownMenuItem
                                    className="cursor-pointer gap-2"
                                    onClick={() => actions.onEdit!(row.original)}
                                >
                                    <Pencil className="size-4 text-muted-foreground" />
                                    Edit
                                </DropdownMenuItem>
                                {actions.onDelete && <DropdownMenuSeparator />}
                            </>
                        )}
                        {actions?.onDelete && (
                            <DropdownMenuItem
                                className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                                onClick={() => actions.onDelete!(row.original)}
                            >
                                <Trash2 className="size-4" />
                                Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    };

    const allColumns: ColumnDef<TData>[] = [
        ...(showCheckbox ? [selectColumn] : []),
        ...userColumns,
        ...(actions ? [actionsColumn] : []),
    ];

    // ---------- Build table ----------
    const table = useReactTable<TData>({
        data,
        columns: allColumns,
        columnResizeMode: "onChange",
        state: {
            sorting: sortingProp ? sortingProp.state : internalSorting,
            columnFilters,
            columnOrder,
            ...(paginationProp ? { pagination: paginationProp.state } : {}),
        },
        // Sorting
        onSortingChange: sortingProp
            ? (updater) => {
                const next =
                    typeof updater === "function" ? updater(sortingProp.state) : updater;
                sortingProp.onChange(next);
            }
            : setInternalSorting,
        manualSorting: !!sortingProp,
        enableSortingRemoval: false,

        // Pagination
        ...(paginationProp
            ? {
                manualPagination: true,
                pageCount: paginationProp.pageCount ?? -1,
                onPaginationChange: (updater) => {
                    const next =
                        typeof updater === "function"
                            ? updater(paginationProp.state)
                            : updater;
                    paginationProp.onChange(next);
                },
            }
            : { getPaginationRowModel: getPaginationRowModel() }),

        // Column drag order
        onColumnOrderChange: setColumnOrder,

        // Column filters
        onColumnFiltersChange: setColumnFilters,

        // Row models
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),

        enableRowSelection: showCheckbox,
    });

    // Resolve ids for DnD context – only draggable user-defined columns (not select/actions)
    const draggableIds = columnOrder.filter((id) => id !== "select" && id !== "_actions");

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        setColumnOrder((current) => {
            const oldIdx = current.indexOf(String(active.id));
            const newIdx = current.indexOf(String(over.id));
            return arrayMove(current, oldIdx, newIdx);
        });
    }

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor)
    );

    const skeletonRows = Math.max(5, data.length);
    const colSpan = allColumns.length;

    return (
        <div className="w-full space-y-3">
            {/* Toolbar: global search + per-column filters + create button */}
            <DataTableToolbar
                table={table}
                search={search}
                onCreate={onCreate}
                createButtonLabel={createButtonLabel}
            />

            {/* Table */}
            <div className="relative overflow-hidden rounded-md border border-border bg-card">
                {/* Primary accent bar */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-primary/50" />

                <div className="overflow-x-auto">
                    <DndContext
                        id={dndId}
                        collisionDetection={closestCenter}
                        modifiers={[restrictToHorizontalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                    >
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((hg) => (
                                    <TableRow key={hg.id} className="hover:bg-transparent">
                                        <SortableContext
                                            items={draggableIds}
                                            strategy={horizontalListSortingStrategy}
                                        >
                                            {hg.headers.map((header) => {
                                                // Select & actions columns are NOT draggable
                                                if (
                                                    header.column.id === "select" ||
                                                    header.column.id === "_actions"
                                                ) {
                                                    return (
                                                        <TableHead
                                                            key={header.id}
                                                            className="h-11 bg-muted/50 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                                                            style={{
                                                                width: header.column.getSize(),
                                                            }}
                                                        >
                                                            {flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                        </TableHead>
                                                    );
                                                }
                                                return (
                                                    <DraggableTableHeader
                                                        key={header.id}
                                                        header={header}
                                                    />
                                                );
                                            })}
                                        </SortableContext>
                                    </TableRow>
                                ))}
                            </TableHeader>

                            <TableBody>
                                {isLoading ? (
                                    // Loading skeleton rows
                                    Array.from({ length: skeletonRows }).map((_, ri) => (
                                        <TableRow
                                            key={`sk-${ri}`}
                                            className={cn(
                                                "border-b border-border/30",
                                                ri % 2 === 1 && "bg-muted/2.5"
                                            )}
                                        >
                                            {Array.from({ length: colSpan }).map((_, ci) => (
                                                <TableCell
                                                    key={`sk-${ri}-${ci}`}
                                                    className="px-3 py-3"
                                                >
                                                    <Skeleton className="h-4 w-full" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map((row, ri) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            className={cn(
                                                "border-b border-border/30 transition-colors",
                                                "hover:bg-primary/3",
                                                ri % 2 === 1 && "bg-muted/2.5"
                                            )}
                                        >
                                            <SortableContext
                                                items={draggableIds}
                                                strategy={horizontalListSortingStrategy}
                                            >
                                                {row.getVisibleCells().map((cell) => {
                                                    if (
                                                        cell.column.id === "select" ||
                                                        cell.column.id === "_actions"
                                                    ) {
                                                        return (
                                                            <TableCell
                                                                key={cell.id}
                                                                className="px-3 py-3 align-middle"
                                                            >
                                                                {flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext()
                                                                )}
                                                            </TableCell>
                                                        );
                                                    }
                                                    return (
                                                        <DragAlongCell
                                                            key={cell.id}
                                                            cell={cell}
                                                        />
                                                    );
                                                })}
                                            </SortableContext>
                                        </TableRow>
                                    ))
                                ) : (
                                    // Empty state
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={colSpan} className="h-64">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <div className="relative">
                                                    <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
                                                    <div className="relative rounded-full border border-border/50 bg-muted/60 p-6">
                                                        <Inbox className="size-10 text-muted-foreground/50" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1 text-center">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {emptyMessage ?? "No results found"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        There are no records to display right now.
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>

                {/* Pagination footer */}
                {paginationProp && (
                    <div className="border-t border-border/30 px-4 py-3">
                        <DataTablePagination
                            pagination={paginationProp}
                            totalPages={table.getPageCount()}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
