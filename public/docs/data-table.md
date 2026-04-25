# DataTable Component

Reusable, feature-rich table built on **TanStack Table v8** + **@dnd-kit** for drag-and-drop column reordering.

## Features

| Feature | Notes |
|---|---|
| Multi-row select | Auto-injected checkbox column |
| Column drag & drop | Grip handle on each header |
| Column sorting | Click header; shift-click for multi-sort |
| Column resizing | Drag the right edge of any header |
| Per-column filters | `text`, `select`, or `range` via column meta |
| Global search | Pass a `search` prop |
| Pagination | Client-side (built-in) or server-side (controlled) |
| Row actions | View / Edit / Delete via dropdown |
| Loading skeleton | Pass `isLoading={true}` |
| Empty state | Shown automatically when `data` is empty |

---

## Import

```ts
import { DataTable } from "@/components/shared/data-table";
import type {
    DataTableActionHandlers,
    DataTableSortingProps,
    DataTablePaginationProps,
    DataTableSearchProps,
} from "@/components/shared/data-table";
```

---

## Minimal Example (client-side, zero config)

```tsx
"use client";

import { DataTable } from "@/components/shared/data-table";
import type { ColumnDef } from "@tanstack/react-table";

type User = { id: string; name: string; email: string; role: string };

const columns: ColumnDef<User>[] = [
    { accessorKey: "name",  header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role",  header: "Role" },
];

const data: User[] = [
    { id: "1", name: "Alice", email: "alice@example.com", role: "Admin" },
    { id: "2", name: "Bob",   email: "bob@example.com",   role: "Rider" },
];

export default function UsersPage() {
    return <DataTable data={data} columns={columns} />;
}
```

That renders a full table with checkboxes, drag handles, sorting, resizing, and built-in pagination — no extra props needed.

---

## Adding Per-Column Filters

Set `meta.filterVariant` on any column to get a filter input in the toolbar:

```ts
const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: "Name",
        meta: { filterVariant: "text", filterLabel: "Name" },
    },
    {
        accessorKey: "role",
        header: "Role",
        // Shows a dropdown seeded with every unique value in this column
        meta: { filterVariant: "select", filterLabel: "Role" },
    },
    {
        accessorKey: "age",
        header: "Age",
        // Shows Min / Max number inputs
        meta: { filterVariant: "range", filterLabel: "Age" },
    },
];
```

---

## Global Search

Control the search input from the parent (useful for debouncing / URL state):

```tsx
const [search, setSearch] = useState("");

<DataTable
    data={data}
    columns={columns}
    search={{
        value: search,
        onChange: setSearch,
        placeholder: "Search users…",
    }}
/>
```

---

## Row Actions (View / Edit / Delete)

```tsx
const actions: DataTableActionHandlers<User> = {
    onView:   (row) => router.push(`/users/${row.id}`),
    onEdit:   (row) => openEditModal(row),
    onDelete: (row) => deleteUser(row.id),
};

<DataTable data={data} columns={columns} actions={actions} />
```

Only the handlers you provide appear in the dropdown. If you pass no `actions` prop the column is not rendered.

---

## Create Button

```tsx
<DataTable
    data={data}
    columns={columns}
    onCreate={() => router.push("/users/new")}
    createButtonLabel="New User"   // optional – defaults to "Create"
/>
```

---

## Server-Side Sorting & Pagination

Pass controlled `sorting` and `pagination` props to drive the table from the server.

```tsx
"use client";

import { useState } from "react";
import type { SortingState, PaginationState } from "@tanstack/react-table";

export default function UsersPage() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20,
    });

    // Build your query from these states and fetch data
    const { data, total, pageCount, isLoading } = useUsers({ sorting, pagination });

    return (
        <DataTable
            data={data}
            columns={columns}
            isLoading={isLoading}
            sorting={{
                state: sorting,
                onChange: setSorting,
            }}
            pagination={{
                state: pagination,
                onChange: setPagination,
                pageCount,      // total pages from the server
                totalItems: total,
            }}
        />
    );
}
```

> **Tip:** When `sorting` or `pagination` props are absent the table handles them internally (client-side). You can mix — e.g. server-side pagination + client-side sorting.

---

## Full Props Reference

### `DataTableProps<TData>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `TData[]` | **required** | Row data |
| `columns` | `ColumnDef<TData>[]` | **required** | Column definitions |
| `isLoading` | `boolean` | `false` | Shows skeleton rows |
| `emptyMessage` | `string` | `"No data available"` | Empty-state message |
| `actions` | `DataTableActionHandlers<TData>` | — | View / Edit / Delete callbacks |
| `sorting` | `DataTableSortingProps` | — | Controlled sorting (server-side) |
| `pagination` | `DataTablePaginationProps` | — | Controlled pagination (server-side) |
| `search` | `DataTableSearchProps` | — | Controlled global search |
| `onCreate` | `() => void` | — | Renders a "+ Create" button |
| `createButtonLabel` | `string` | `"Create"` | Label for the create button |

### `DataTableActionHandlers<TData>`

| Prop | Type |
|---|---|
| `onView` | `(row: TData) => void` |
| `onEdit` | `(row: TData) => void` |
| `onDelete` | `(row: TData) => void` |

### Column `meta` (per-column filter config)

```ts
meta: {
    filterVariant?: "text" | "select" | "range";
    filterLabel?: string;   // label shown above the filter input
}
```

---

## File Structure

```
src/components/shared/data-table/
├── index.ts                      ← barrel export (import from here)
├── types.ts                      ← all TypeScript types
├── data-table.tsx                ← main component
├── data-table-toolbar.tsx        ← search bar + per-column filters + create button
├── data-table-pagination.tsx     ← rows-per-page + navigation
├── draggable-columns.tsx         ← DnD header cell + body cell
└── column-filter.tsx             ← per-column filter input (text/select/range)
```
