"use client";

import { useId, useMemo } from "react";
import { SearchIcon } from "lucide-react";
import type { Column, RowData } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ColumnFilterProps<TData extends RowData> {
    column: Column<TData, unknown>;
}

export function ColumnFilter<TData extends RowData>({ column }: ColumnFilterProps<TData>) {
    const id = useId();
    const filterVariant = column.columnDef.meta?.filterVariant ?? "text";
    const label =
        column.columnDef.meta?.filterLabel ??
        (typeof column.columnDef.header === "string" ? column.columnDef.header : column.id);

    const columnFilterValue = column.getFilterValue();

    const facetedUniqueValues = column.getFacetedUniqueValues();
    const sortedUniqueValues = useMemo(() => {
        if (filterVariant !== "select") return [];
        const values = Array.from(facetedUniqueValues.keys()).flat();
        return Array.from(new Set(values)).sort();
    }, [facetedUniqueValues, filterVariant]);

    if (filterVariant === "range") {
        const range = columnFilterValue as [number | undefined, number | undefined] | undefined;
        return (
            <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <div className="flex">
                    <Input
                        id={`${id}-min`}
                        type="number"
                        value={range?.[0] ?? ""}
                        onChange={(e) =>
                            column.setFilterValue((old: [number, number]) => [
                                e.target.value ? Number(e.target.value) : undefined,
                                old?.[1],
                            ])
                        }
                        placeholder="Min"
                        className="h-8 rounded-r-none text-xs [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
                        aria-label={`${label} minimum`}
                    />
                    <Input
                        id={`${id}-max`}
                        type="number"
                        value={range?.[1] ?? ""}
                        onChange={(e) =>
                            column.setFilterValue((old: [number, number]) => [
                                old?.[0],
                                e.target.value ? Number(e.target.value) : undefined,
                            ])
                        }
                        placeholder="Max"
                        className="-ms-px h-8 rounded-l-none text-xs [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
                        aria-label={`${label} maximum`}
                    />
                </div>
            </div>
        );
    }

    if (filterVariant === "select") {
        return (
            <div className="space-y-1.5">
                <Label htmlFor={`${id}-select`} className="text-xs text-muted-foreground">
                    {label}
                </Label>
                <Select
                    value={(columnFilterValue as string) ?? "all"}
                    onValueChange={(value) =>
                        column.setFilterValue(value === "all" ? undefined : value)
                    }
                >
                    <SelectTrigger id={`${id}-select`} className="h-8 text-xs">
                        <SelectValue placeholder={`All ${label}`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {sortedUniqueValues.map((val) => (
                            <SelectItem key={String(val)} value={String(val)}>
                                {String(val)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    }

    // Default: text search
    return (
        <div className="space-y-1.5">
            <Label htmlFor={`${id}-input`} className="text-xs text-muted-foreground">
                {label}
            </Label>
            <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                    id={`${id}-input`}
                    type="text"
                    value={(columnFilterValue as string) ?? ""}
                    onChange={(e) => column.setFilterValue(e.target.value)}
                    placeholder={`Search ${label.toLowerCase()}`}
                    className="h-8 pl-8 text-xs"
                />
            </div>
        </div>
    );
}
