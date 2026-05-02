import type { ColumnDef, PaginationState, RowData, SortingState } from "@tanstack/react-table";

// Augment react-table ColumnMeta so we can tag filter behaviour per column
declare module "@tanstack/react-table" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        /** "text" = free-text search, "select" = dropdown, "range" = min/max numbers */
        filterVariant?: "text" | "select" | "range";
        /** Human-readable label used in filter headers */
        filterLabel?: string;
    }
}

export interface DataTableActionHandlers<TData> {
    onView?: (row: TData) => void;
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
}

export interface DataTableSortingProps {
    state: SortingState;
    onChange: (state: SortingState) => void;
}

export interface DataTablePaginationProps {
    state: PaginationState;
    onChange: (state: PaginationState) => void;
    /** Total number of pages (pass when using server-side pagination) */
    pageCount?: number;
    /** Total records (shown in the "X – Y of Z" counter) */
    totalItems?: number;
}

export interface DataTableSearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export interface DataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    isLoading?: boolean;
    emptyMessage?: string;
    /** Show the checkbox column for row selection. Defaults to true. */
    showCheckbox?: boolean;
    /** Enable drag-and-drop column reordering. Defaults to true. */
    enableDragDrop?: boolean;
    /** Enable column resizing via drag handles. Defaults to false. */
    enableColumnResizing?: boolean;

    // Optional feature props – omit any you don't need
    actions?: DataTableActionHandlers<TData>;
    sorting?: DataTableSortingProps;
    pagination?: DataTablePaginationProps;
    search?: DataTableSearchProps;
    /** When provided, a "+ Create" button is rendered in the toolbar */
    onCreate?: () => void;
    createButtonLabel?: string;
}
