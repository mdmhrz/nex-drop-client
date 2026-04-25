"use client";

import type { CSSProperties } from "react";
import { GripVerticalIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Cell, Header } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Draggable column header
// ---------------------------------------------------------------------------
interface DraggableTableHeaderProps<TData> {
    header: Header<TData, unknown>;
}

export function DraggableTableHeader<TData>({ header }: DraggableTableHeaderProps<TData>) {
    const { attributes, isDragging, listeners, setNodeRef, transform, transition } =
        useSortable({ id: header.column.id });

    const style: CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        position: "relative",
        transform: CSS.Translate.toString(transform),
        transition,
        whiteSpace: "nowrap",
        width: header.column.getSize(),
        zIndex: isDragging ? 1 : 0,
    };

    const sorted = header.column.getIsSorted();

    return (
        <TableHead
            ref={setNodeRef}
            style={style}
            className="h-11 border-t bg-muted/50 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-border first:before:bg-transparent"
            aria-sort={
                sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none"
            }
        >
            <div className="flex items-center gap-0.5">
                {/* Drag handle */}
                <Button
                    size="icon"
                    variant="ghost"
                    className="-ml-1 size-7 cursor-grab text-muted-foreground/50 hover:text-muted-foreground"
                    {...attributes}
                    {...listeners}
                    aria-label="Drag to reorder column"
                    tabIndex={0}
                >
                    <GripVerticalIcon className="size-3.5" aria-hidden />
                </Button>

                {/* Column label */}
                <span className="grow truncate">
                    {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                </span>

                {/* Sort toggle */}
                {header.column.getCanSort() && (
                    <Button
                        size="icon"
                        variant="ghost"
                        className="group -mr-1 size-7"
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                header.column.getToggleSortingHandler()?.(e);
                            }
                        }}
                        aria-label="Toggle sort"
                    >
                        {sorted === "asc" ? (
                            <ChevronUpIcon className="size-3.5 opacity-60" aria-hidden />
                        ) : sorted === "desc" ? (
                            <ChevronDownIcon className="size-3.5 opacity-60" aria-hidden />
                        ) : (
                            <ChevronUpIcon
                                className="size-3.5 opacity-0 transition-opacity group-hover:opacity-40"
                                aria-hidden
                            />
                        )}
                    </Button>
                )}
            </div>

            {/* Column resize handle */}
            {header.column.getCanResize() && (
                <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className="absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none bg-border/0 hover:bg-primary/40"
                />
            )}
        </TableHead>
    );
}

// ---------------------------------------------------------------------------
// Drag-along body cell (moves with its column while dragging)
// ---------------------------------------------------------------------------
interface DragAlongCellProps<TData> {
    cell: Cell<TData, unknown>;
}

export function DragAlongCell<TData>({ cell }: DragAlongCellProps<TData>) {
    const { isDragging, setNodeRef, transform, transition } = useSortable({
        id: cell.column.id,
    });

    const style: CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        position: "relative",
        transform: CSS.Translate.toString(transform),
        transition,
        width: cell.column.getSize(),
        zIndex: isDragging ? 1 : 0,
    };

    return (
        <TableCell
            ref={setNodeRef}
            style={style}
            className="truncate px-3 py-3 text-sm align-middle"
        >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
    );
}
